# FastAPI Auth: аутентификация с нуля

Третья часть справочника (после `fastapi-basics.md` и `fastapi-depends.md`), но написана самодостаточно — все нужные понятия вводятся по ходу. Формат прежний: каждый пример подписан файлом.

БД в проекте ещё не выбрана, поэтому хранилище юзеров здесь — временный in-memory словарь. Когда появится база, поменяется только слой хранения; вся auth-механика останется как есть.

---

## 0. Структура

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py              # ← НОВЫЙ: настройки (SECRET_KEY и т.д.)
│   ├── security.py            # ← НОВЫЙ: хеширование паролей, работа с JWT
│   ├── dependencies.py        # get_current_user живёт здесь
│   ├── schemas.py             # Pydantic-модели, включая auth-модели
│   ├── fake_users_db.py       # ← ВРЕМЕННЫЙ: словарь вместо БД
│   └── routers/
│       ├── __init__.py
│       ├── auth.py            # ← НОВЫЙ: /auth/register, /auth/login
│       └── users.py           # /users/me и другие защищённые роуты
├── .env                       # секреты (в .gitignore!)
└── requirements.txt
```

Разделение ответственности:
- `security.py` — «криптографический» слой: хеширование, создание/проверка токенов. Ничего не знает про HTTP
- `routers/auth.py` — HTTP-слой: эндпоинты регистрации и логина
- `dependencies.py` — мост между ними: зависимость, достающая юзера из токена
- `config.py` — секреты и настройки из переменных окружения

Установка пакетов:

```bash
pip install pyjwt "pwdlib[argon2]" python-multipart
pip freeze > requirements.txt
```

---

## 1. Термины: аутентификация vs авторизация

- **Аутентификация (authentication)** — ответ на вопрос «кто ты?». Проверка логина и пароля, выдача токена, проверка токена.
- **Авторизация (authorization)** — ответ на вопрос «что тебе можно?». Проверка прав: этот юзер может читать роадмап, но не может его удалить.

Путать их — классика; запомнить просто: сначала система узнаёт тебя (аутентификация), потом решает, что тебе разрешено (авторизация). Этот документ — в основном про первую; авторизация строится поверх неё одной дополнительной зависимостью (раздел 8).

---

## 2. Стратегия: сессии vs токены

Два фундаментальных способа «помнить», что юзер залогинен:

**Сессии (stateful).** После логина сервер создаёт запись у себя (в Redis/БД): «сессия abc123 = юзер 42». Клиенту в cookie уезжает только ID сессии. Каждый запрос — поиск сессии в хранилище.

- ✅ Мгновенный отзыв: удалил запись — юзер разлогинен
- ❌ Нужно хранилище сессий; каждый запрос — лишний поход в него

**JWT-токены (stateless).** После логина сервер выдаёт подписанный токен, в котором закодированы данные (ID юзера, срок жизни). Сервер ничего у себя не хранит: проверка токена = проверка криптографической подписи.

- ✅ Не нужно хранилище; проверка дешёвая; легко масштабировать
- ❌ Токен нельзя отозвать до истечения срока — поэтому его делают короткоживущим

Для архитектуры devio (Next-фронт + отдельный FastAPI-бэк) индустриальный стандарт — **JWT**. Его и строим.

---

## 3. Хеширование паролей

**Железное правило: пароль никогда не хранится в открытом виде.** Ни в БД, ни в логах, ни «временно». Утечка базы с открытыми паролями — катастрофа, потому что люди используют одни пароли везде.

Хранится **хеш** — результат односторонней функции: из пароля хеш получить легко, из хеша пароль — практически невозможно.

Почему не подходит обычный `sha256`: он слишком **быстрый**. Злоумышленник с утёкшей базой перебирает миллиарды вариантов в секунду. Поэтому для паролей используют специальные медленные алгоритмы — **argon2** (современный стандарт) или **bcrypt**. Их медленность — фича: перебор становится экономически бессмысленным.

```python
# app/security.py
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()   # argon2 с разумными настройками

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return password_hash.verify(plain, hashed)
```

Как работает проверка при логине, если хеш необратим: `verify` хеширует введённый пароль **тем же способом** и сравнивает результаты. Пароль «расшифровывать» не нужно — совпали хеши, значит совпали пароли.

Ещё одно свойство: два вызова `hash_password("123456")` дадут **разные** строки — внутрь подмешивается случайная «соль». Это защита от радужных таблиц (предвычисленных хешей популярных паролей). Соль хранится внутри самой строки хеша, `verify` достаёт её сам.

---

## 4. JWT: что внутри токена

JWT (JSON Web Token) — строка из трёх частей, разделённых точками:

```
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiI0MiIsImV4cCI6MTcy...} . SflKxwRJSMeKKF2QT4...
      header                    payload                      signature
```

- **header** — метаданные: алгоритм подписи
- **payload** — полезные данные (claims): кто юзер, когда истекает токен
- **signature** — подпись: хеш от `header + payload + СЕКРЕТНЫЙ_КЛЮЧ`

**Критично понять:** header и payload — это просто base64, **не шифрование**. Любой, у кого есть токен, может их прочитать (попробуй вставить токен на jwt.io). Поэтому в payload нельзя класть ничего чувствительного — только ID юзера и служебные поля.

Защита — в подписи. Изменил злоумышленник payload (подставил чужой `user_id`) — подпись перестала сходиться, сервер токен отвергнет. Подделать подпись без секретного ключа нельзя.

Стандартные claims, которые нам нужны:
- `sub` (subject) — идентификатор владельца токена, кладём ID юзера
- `exp` (expiration) — unix-время истечения; библиотека проверяет его автоматически

```python
# app/security.py (продолжение файла)
from datetime import datetime, timedelta, timezone
import jwt

from app.config import settings

ALGORITHM = "HS256"

def create_access_token(user_id: str, expires_minutes: int = 30) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    # бросит jwt.InvalidTokenError (включая ExpiredSignatureError), если
    # подпись неверна или токен просрочен
    return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
```

---

## 5. Секретный ключ и настройки

`SECRET_KEY` — сердце безопасности: кто знает ключ, тот может выпускать «валидные» токены от имени кого угодно. Правила:

1. Длинная случайная строка. Сгенерировать: `openssl rand -hex 32`
2. Живёт в переменных окружения, **не в коде и не в git**
3. Разный для дев- и прод-окружений

```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str                      # обязательная — без неё приложение не стартует
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
```

```
# .env  (добавь в .gitignore!)
SECRET_KEY=d4f8a1b2c3...результат openssl rand -hex 32
```

`pydantic-settings` (ставится отдельно: `pip install pydantic-settings`) читает `.env` и переменные окружения, валидирует типы. Имена сопоставляются без учёта регистра: поле `secret_key` ← переменная `SECRET_KEY`. Это аналог связки `dotenv` + валидация env-переменных через Zod, только в одном флаконе.

---

## 6. Эндпоинты: регистрация и логин

Схемы данных:

```python
# app/schemas.py (добавить к существующим)
from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email: EmailStr        # EmailStr валидирует формат email (нужен пакет email-validator,
    password: str          # он уже есть, если ставил fastapi[standard])

class UserPublic(BaseModel):
    id: str
    email: EmailStr
    # password_hash здесь НЕТ — эта модель определяет, что уходит наружу

class Token(BaseModel):
    access_token: str
    token_type: str        # всегда "bearer" — так требует стандарт OAuth2
```

Временное хранилище (заменится на БД):

```python
# app/fake_users_db.py
# структура: {email: {"id": ..., "email": ..., "password_hash": ...}}
fake_users_db: dict[str, dict] = {}
```

Сами эндпоинты:

```python
# app/routers/auth.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
import uuid

from app.schemas import UserRegister, UserPublic, Token
from app.security import hash_password, verify_password, create_access_token
from app.fake_users_db import fake_users_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserPublic, status_code=201)
def register(data: UserRegister):
    if data.email in fake_users_db:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = {
        "id": str(uuid.uuid4()),
        "email": data.email,
        "password_hash": hash_password(data.password),   # хешируем СРАЗУ
    }
    fake_users_db[data.email] = user
    return user   # response_model=UserPublic отрежет password_hash — наружу он не уйдёт

@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form.username)   # в OAuth2-форме поле называется username,
                                              # но мы кладём туда email
    if user is None or not verify_password(form.password, user["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(user_id=user["id"])
    return Token(access_token=token, token_type="bearer")
```

Три неочевидных момента:

**Почему логин принимает форму, а не JSON.** `OAuth2PasswordRequestForm` — стандарт OAuth2: логин приходит как `application/x-www-form-urlencoded` с полями `username` и `password` (для этого и нужен `python-multipart`). Можно сделать и JSON-логин, но форма даёт бесплатный бонус — кнопка **Authorize** в Swagger заработает из коробки, и ты сможешь тестировать защищённые эндпоинты прямо из `/docs`. С фронта это просто `FormData` или `URLSearchParams` вместо JSON-тела.

**Почему при ошибке логина ответ одинаковый** («Incorrect email or password», без уточнения). Ответ «пароль неверный» подтверждает злоумышленнику, что email существует, — это утечка информации, позволяющая собирать базу зарегистрированных адресов. По той же причине статус один — 401.

**Почему 409 при повторной регистрации.** Conflict — семантически точный статус для «такой ресурс уже есть». (Забегая вперёд: сам факт ответа «email занят» — тоже утечка, но для учебного проекта это нормальный компромисс; борются с ней через «письмо-подтверждение в любом случае».)

---

## 7. Защита эндпоинтов: get_current_user

Ключевая конструкция всей системы — зависимость, которая превращает токен из заголовка в объект юзера:

```python
# app/dependencies.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.security import decode_access_token
from app.fake_users_db import fake_users_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_error = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
    except jwt.InvalidTokenError:          # неверная подпись, истёк exp — всё сюда
        raise credentials_error

    user_id = payload.get("sub")
    user = next((u for u in fake_users_db.values() if u["id"] == user_id), None)
    if user is None:                       # токен валиден, но юзера уже нет
        raise credentials_error
    return user
```

Разбор по частям:

- **`OAuth2PasswordBearer(tokenUrl="auth/login")`** — хелпер FastAPI, который: достаёт значение из заголовка `Authorization: Bearer <token>`; если заголовка нет — сам отвечает 401; сообщает Swagger, где логиниться (`tokenUrl`), чтобы работала кнопка Authorize.
- **Один общий 401 на все случаи** (битая подпись, истёкший токен, удалённый юзер) — та же логика неразглашения, что и в логине.
- **Проверка юзера в хранилище обязательна:** токен мог быть выпущен до удаления/блокировки аккаунта. Подпись валидна ≠ юзер существует.

Использование — просто аргумент в сигнатуре:

```python
# app/routers/users.py
from fastapi import APIRouter, Depends
from app.schemas import UserPublic
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserPublic)
def read_me(current_user: dict = Depends(get_current_user)):
    return current_user
```

Правило чтения кода: **эндпоинт с `Depends(get_current_user)` — защищённый, без него — публичный.** Никаких if-проверок токена внутри хендлеров — вся механика в одном месте, в зависимости. (Подробно о том, как работают зависимости, их цепочки и кеш — `fastapi-depends.md`.)

Подключение роутеров:

```python
# app/main.py (фрагмент)
from app.routers import auth, users

app.include_router(auth.router)
app.include_router(users.router)
```

---

## 8. Авторизация: роли как зависимости

Когда появятся роли (админ devio, редактирующий роадмапы), авторизация наслаивается одной зависимостью поверх `get_current_user`:

```python
# app/dependencies.py (добавить)
def get_current_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user
```

```python
# app/routers/roadmaps.py — редактирование только для админа
@router.delete("/{slug}")
def delete_roadmap(slug: str, admin: dict = Depends(get_current_admin)):
    ...
```

Обрати внимание на статусы — это частая путаница:
- **401 Unauthorized** — «я не знаю, кто ты» (нет/невалиден токен) → фронт редиректит на логин
- **403 Forbidden** — «я знаю, кто ты, но тебе нельзя» (не хватает прав) → редирект на логин бессмысленен

---

## 9. Проверка руками через /docs

Полный цикл теста без единой строчки фронта:

1. `fastapi dev app/main.py` → открой `http://127.0.0.1:8000/docs`
2. `POST /auth/register` → Try it out → введи email/пароль → 201, в ответе нет `password_hash`
3. Нажми кнопку **Authorize** (замочек справа вверху) → введи те же email (в поле username) и пароль → Swagger сам дёрнет `/auth/login` и запомнит токен
4. `GET /users/me` → Try it out → 200 и твой юзер. Нажми Logout в Authorize → тот же запрос → 401

Если этот цикл проходит — ядро auth работает.

---

## 10. Фронтенд: куда класть токен

Развилка с трейдоффами (решение понадобится, когда дойдёшь до фронта):

**Вариант А: localStorage + заголовок.** Логин → сохранить `access_token` → каждый запрос слать `Authorization: Bearer <token>` (обёртка над fetch / интерцептор).
- ✅ Просто, механика прозрачна
- ❌ Токен доступен любому JS на странице → уязвим к XSS

**Вариант Б: httpOnly cookie.** Бэк кладёт токен в cookie с флагом `httpOnly` — JS его прочитать не может.
- ✅ Защита от кражи токена через XSS
- ❌ Нужна защита от CSRF (`SameSite=Lax` обычно достаточно) и аккуратный CORS: `allow_credentials=True` + точный origin (`allow_origins=["*"]` с куками не работает — это ограничение самого стандарта)

**Рекомендация для devio:** начни с варианта А — меньше движущихся частей, вся механика на виду. Миграция на cookie потом затронет только слой транспорта. На твоём стеке: токен и статус auth — в Zustand, запросы — через TanStack Query с обёрткой, добавляющей заголовок.

---

## 11. Access + Refresh (вторая итерация, не для старта)

Дилемма: короткий токен (30 мин) безопасен, но выкидывает юзера каждые полчаса; длинный (30 дней) удобен, но украденный токен месяц у злоумышленника.

Решение — два токена:
- **access** — короткий (15–30 мин), ходит с каждым запросом
- **refresh** — длинный (недели), используется только на `POST /auth/refresh` для обмена на свежий access

Флоу фронта: запрос → 401 → дёрнуть `/auth/refresh` → повторить исходный запрос → если refresh тоже мёртв, на логин.

**Для первой версии devio:** один access-токен на 24 часа. Да, компромисс по безопасности, но для учебного проекта разумный — сначала рабочий цикл register/login/me, refresh добавишь отдельной итерацией, когда основа устаканится.

---

## 12. Как не надо: чеклист ошибок

- ❌ **Пароль в открытом виде** — где угодно: в БД, в логах, в ответах API
- ❌ **Быстрые хеши для паролей** (`sha256`, `md5`) — только argon2/bcrypt через pwdlib
- ❌ **Секреты в коде или git** — `SECRET_KEY` живёт в `.env`, а `.env` — в `.gitignore`
- ❌ **Чувствительное в payload JWT** — он читается любым, кто видит токен
- ❌ **«Email не найден» / «пароль неверный» раздельно** — один ответ 401 на оба случая
- ❌ **Проверка токена копипастой в хендлерах** — только через зависимость
- ❌ **Доверять фронту** — «кнопка скрыта у не-админов» не защита; каждый защищённый эндпоинт проверяет права на бэке
- ❌ **Самописная криптография** — только стандартные библиотеки (pyjwt, pwdlib)
- ❌ **401 vs 403 наугад** — «не знаю кто ты» против «знаю, но нельзя»

---

## Резюме

Вся система — пять кирпичей:

1. **`security.py`**: `hash_password` / `verify_password` (argon2) + `create_access_token` / `decode_access_token` (JWT)
2. **`config.py`**: `SECRET_KEY` из `.env`
3. **`routers/auth.py`**: `POST /auth/register` (хешируем, сохраняем) и `POST /auth/login` (сверяем, выдаём токен)
4. **`dependencies.py`**: `get_current_user` — токен из заголовка → проверка → юзер; роли — зависимостью поверх
5. Защищённый эндпоинт = `Depends(get_current_user)` в сигнатуре

Порядок сборки: security → config → register → login → get_current_user → `/users/me` → проверка через Authorize в `/docs`.

Когда появится БД, `fake_users_db` заменится на реальные запросы — интерфейс всех остальных частей не изменится ни на строчку.
