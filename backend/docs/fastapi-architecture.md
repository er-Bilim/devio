# Архитектура FastAPI-проекта: слои

Девятая часть справочника. Здесь не новая технология, а способ раскладывать код, который уже написан. Разбор идёт на реальном `app/routers/auth.py` из devio.

---

## 0. Проблема: посмотри на свой auth.py

Открой его и оцени, что там лежит вперемешку:

```python
@router.post("/login", response_model=UserPublic)
async def login(form, response, db):
    result = await db.execute(select(User).where(User.email == form.username))   # ← SQL
    user = result.scalar_one_or_none()
    if user is None or not verify_password(...):                                  # ← правила
        raise HTTPException(status_code=401, ...)                                 # ← HTTP

    access = create_access_token(user_id=str(user.id))                            # ← бизнес-логика
    refresh = generate_refresh_token()
    db.add(RefreshToken(token_hash=..., expires_at=...))                          # ← SQL
    await db.commit()
    set_auth_cookies(response, access, refresh)                                   # ← HTTP
    return user
```

В одной функции: работа с базой, бизнес-правила («пароль не сошёлся — отказ», «выдаём пару токенов») и HTTP-детали (статусы, куки). Пока функций пять — терпимо. Когда их станет пятьдесят, начнутся конкретные боли:

- **Дублирование.** Логика выдачи пары токенов уже сейчас скопирована в `login` и в `refresh_tokens` — почти построчно. Поменяешь правило (например, добавишь запись в лог входов) — надо не забыть оба места
- **Невозможно переиспользовать.** Захочешь логин из другого места (админский вход «зайти как юзер», seed-скрипт, тесты) — придётся тащить с собой HTTP-объекты `Response` и `Form`, которых там нет
- **Тяжело тестировать.** Чтобы проверить правило «просроченный refresh не принимается», нужно поднимать HTTP-клиент и куки, хотя правило само по себе — три строки логики
- **Тяжело читать.** Чтобы понять, что делает эндпоинт, приходится продираться через `select(...).where(...)` и `scalar_one_or_none()`

Лечится это разделением на слои.

---

## 1. Слои и правило зависимостей

Слоёная (layered) архитектура — де-факто стандарт для FastAPI. Официального «правильного» варианта нет, но в продакшен-проектах чаще всего встречается такой:

```
routers/        HTTP: принять запрос, отдать ответ, статусы, куки
    ↓
services/       бизнес-логика: правила проекта
    ↓
queries/        доступ к данным: SQL и только SQL
    ↓
models/         таблицы (SQLAlchemy)
```

**Главное правило: стрелки смотрят только вниз.** Роутер знает про сервис, сервис знает про запросы, запросы знают про модели. Обратно — никогда: `queries` не должен ничего знать про HTTP, а `services` — про `Request` и `Response`.

Проверка правила одним вопросом: **если из `services/` или `queries/` импортируется что-то из `fastapi` — скорее всего, слой протёк.** (Исключение — `HTTPException`, о нём в разделе 4.)

Зачем это нужно на практике:

- логику можно вызвать откуда угодно — из другого эндпоинта, из скрипта, из фоновой задачи
- каждый слой тестируется отдельно, без поднятия HTTP
- читая роутер, видишь **что** делает эндпоинт, не отвлекаясь на **как**

---

## 2. Что в какой слой

| Слой | Что там живёт | Чего там НЕ должно быть |
|---|---|---|
| `routers/` | декораторы, `response_model`, статусы, куки, вызов сервиса | `select(...)`, бизнес-правила, вычисления |
| `services/` | правила проекта, сценарии, оркестрация нескольких запросов | `Response`, `Cookie`, конструирование HTTP-ответов |
| `queries/` | `select`, `insert`, агрегации, `db.get` | `if`-правила бизнеса, HTTPException |
| `models/` | описание таблиц | вообще ничего другого |
| `schemas/` | формы входа и выхода API | логика |
| `security.py` | хеши, токены — чистые функции | БД, HTTP |

Пограничные случаи, которые смущают чаще всего:

**«Проверка `if user is None` — это правило или запрос?»** Сам поиск юзера — запрос (`queries`), а решение «не нашли → это ошибка авторизации» — правило (`services`). Запрос возвращает `User | None` и не судит, хорошо это или плохо.

**«Валидация входных данных — где?»** Формат (email похож на email, пароль не пустой) — это Pydantic-схема, то есть граница HTTP. А правило «email должен быть уникален» — бизнес-правило, оно в сервисе.

**«Куда положить `set_auth_cookies`?»** В роутер (или в отдельный `app/cookies.py`, который импортирует только роутер). Куки — чистый HTTP-транспорт, сервис про них знать не должен: он возвращает пару токенов, а как их довезти до клиента — решает верхний слой. Именно поэтому, кстати, переезд с Bearer на куки в своё время не затронул `security.py`.

---

## 3. Разбираем твой auth.py по слоям

Возьмём `login` и разложим. Снизу вверх.

### Слой запросов

```python
# app/queries/users.py
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    return await db.get(User, user_id)


async def create(db: AsyncSession, email: str, password_hash: str) -> User:
    user = User(email=email, password_hash=password_hash)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
```

Обрати внимание: функции **ничего не решают**. `get_by_email` вернул `None` — и всё, никаких исключений. Это тупой слой доступа к данным, и в этом его ценность: его можно звать из любого сценария с любой реакцией на пустой результат.

Аналогично для токенов:

```python
# app/queries/refresh_tokens.py
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import RefreshToken
from app.security import hash_refresh_token


async def get_by_token(db: AsyncSession, raw_token: str) -> RefreshToken | None:
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(raw_token))
    )
    return result.scalar_one_or_none()


async def store(db: AsyncSession, raw_token: str, user_id) -> None:
    db.add(
        RefreshToken(
            token_hash=hash_refresh_token(raw_token),
            user_id=user_id,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.refresh_token_expire_days),
        )
    )
```

Заметь: `store` **не делает commit**. Почему — раздел 5.

### Слой сервисов

```python
# app/services/auth.py
from dataclasses import dataclass

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.queries import refresh_tokens as tokens_q
from app.queries import users as users_q
from app.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    verify_password,
)


@dataclass
class TokenPair:
    access: str
    refresh: str


async def _issue_tokens(db: AsyncSession, user: User) -> TokenPair:
    """Выдать пару токенов и запомнить refresh. Было продублировано в login и refresh."""
    access = create_access_token(user_id=str(user.id))
    refresh = generate_refresh_token()
    await tokens_q.store(db, refresh, user.id)
    return TokenPair(access=access, refresh=refresh)


async def register(db: AsyncSession, email: str, password: str) -> User:
    if await users_q.get_by_email(db, email) is not None:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = await users_q.create(db, email=email, password_hash=hash_password(password))
    return user


async def login(db: AsyncSession, email: str, password: str) -> tuple[User, TokenPair]:
    user = await users_q.get_by_email(db, email)
    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    pair = await _issue_tokens(db, user)
    await db.commit()
    return user, pair
```

Вот здесь и живут правила devio: «email занят — отказ», «пароль не сошёлся — отказ», «при входе выдаётся пара токенов». Ни `select`, ни `Response` тут нет.

`_issue_tokens` с подчёркиванием в начале — питоновское соглашение «функция для внутреннего использования, снаружи модуля звать не надо». И это ровно тот дубль из `login`/`refresh_tokens`, который теперь существует в одном экземпляре.

**Про `@dataclass`.** Декоратор из стандартной библиотеки: автоматически дописывает классу конструктор, сравнение и человекочитаемый вывод. Эти два варианта эквивалентны:

```python
@dataclass                          # ✅ пять строк
class TokenPair:
    access: str
    refresh: str

class TokenPair:                    # то же самое вручную
    def __init__(self, access: str, refresh: str):
        self.access = access
        self.refresh = refresh
    def __repr__(self): ...
    def __eq__(self, other): ...
```

Пользоваться одинаково: `pair = TokenPair(access="eyJ...", refresh="a8f...")`, дальше `pair.access`.

Зачем он тут — сравни варианты возврата двух токенов из сервиса:

```python
return access, refresh                      # ❌ кортеж: легко перепутать порядок
return {"access": ..., "refresh": ...}      # ❌ словарь: опечатки в ключах, нет автокомплита
return TokenPair(access=..., refresh=...)   # ✅ явные имена, автокомплит, проверка типов
```

С кортежем ничто не мешает положить refresh в куку access — и этот баг найдётся не сразу. TokenPair делает такую ошибку невозможной.

**Чем отличается от Pydantic-модели**, раз обе «классы с полями»: `@dataclass` — просто структура данных, без валидации, из стандартной библиотеки. `BaseModel` — валидирует типы, парсит JSON, попадает в `/docs`. Правило: данные пересекают границу API → Pydantic; данные ходят между внутренними слоями → `@dataclass` достаточно.

### Слой роутеров

```python
# app/routers/auth.py
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies import DbSession
from app.schemas import UserPublic, UserRegister
from app.services import auth as auth_service
from app.cookies import set_auth_cookies, clear_auth_cookies

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic, status_code=201)
async def register(data: UserRegister, db: DbSession):
    return await auth_service.register(db, email=data.email, password=data.password)


@router.post("/login", response_model=UserPublic)
async def login(
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    db: DbSession,
):
    user, pair = await auth_service.login(db, email=form.username, password=form.password)
    set_auth_cookies(response, pair.access, pair.refresh)
    return user
```

Сравни с тем, что было в начале доки. Эндпоинт стал в три строки, и каждая читается: «вызови сценарий → положи токены в куки → верни юзера». Вся возня с SQL и правилами ушла вниз.

Куки — в отдельный файл, чтобы `set` и `delete` всегда были согласованы (тот самый баг с `/auth` против `/auth/` перестанет быть возможным):

```python
# app/cookies.py
from fastapi import Response

from app.config import settings

ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"
REFRESH_PATH = "/auth"          # ОДНА константа на set и delete


def set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(
        key=ACCESS_COOKIE, value=access, httponly=True, samesite="lax", secure=True,
        max_age=60 * settings.access_token_expire_minutes, path="/",
    )
    response.set_cookie(
        key=REFRESH_COOKIE, value=refresh, httponly=True, samesite="lax", secure=True,
        max_age=60 * 60 * 24 * settings.refresh_token_expire_days,   # секунды → дни!
        path=REFRESH_PATH,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key=ACCESS_COOKIE, path="/")
    response.delete_cookie(key=REFRESH_COOKIE, path=REFRESH_PATH)
```

Это иллюстрация побочной пользы слоёв: **разложив код по местам, часть багов становится невозможной**. Пути и имена кук теперь физически не могут разъехаться.

---

## 4. Два честных вопроса про этот подход

### «HTTPException в сервисе — это же протёкший слой?»

Формально да: `HTTPException` — из `fastapi`. Строгий вариант — заводить свои исключения (`EmailAlreadyTaken`, `InvalidCredentials`) и переводить их в HTTP в роутере или глобальным обработчиком.

Для devio это пока оверинжиниринг: лишний слой исключений, лишний маппинг, а выигрыш появится только если API станет не единственным потребителем логики (например, добавится CLI или gRPC). **Договорённость для проекта: `HTTPException` в сервисах разрешён, всё остальное из `fastapi` — нет.** Если однажды понадобится — вынести будет несложно, сервис уже отделён.

### «А всегда ли нужен сервис-слой?»

Нет, и это важно. Для тонкого CRUD сервис — пустая прослойка:

```python
# бессмысленный сервис
async def list_roadmaps(db):
    return await roadmaps_q.list_all(db)     # просто переадресация
```

Правило: **сервис появляется там, где есть что решать.** Признаки, что он нужен:

- в сценарии больше одного шага работы с данными (найти → проверить → записать)
- есть правила, которые нужно держать в одном месте
- логика вызывается из нескольких эндпоинтов

Для чистого «отдай список роадмапов» роутер может звать `queries` напрямую — и это нормальная, зрелая архитектура, а не лень. `auth` сервис заслужил, `GET /roadmaps` — нет.

---

## 5. Кто делает commit

Тонкий момент, который стоит решить один раз. В примере выше `queries.store` не коммитит, а сервис — коммитит. Причина: **транзакция принадлежит сценарию, а не отдельному запросу.**

Смотри на `refresh_tokens`: там нужно погасить старый токен **и** создать новый. Это должно произойти либо целиком, либо никак — иначе юзер останется без обоих. Если бы каждый запрос коммитил сам, атомарности не было бы.

Договорённость для devio:

- `queries/` — только `db.add()` / `select` / изменение объектов, **без commit**
- `services/` — вызывает нужные запросы и делает **один** `commit` в конце сценария

Исключение — простые однооперационные функции вроде `users_q.create`, где коммит внутри удобен и безопасен. Главное — не смешивать: если сценарий составной, коммит всегда наверху.

---

## 6. Итоговая структура devio

```
backend/app/
├── main.py                 приложение, CORS, подключение роутеров
├── config.py               настройки из .env
├── db.py                   engine, сессии, get_db
├── dependencies.py         DbSession, CurrentUser, AdminUser
├── security.py             хеши и токены (чистые функции)
├── cookies.py              транспорт токенов в куках
├── models.py               таблицы
├── schemas.py              формы API
├── queries/
│   ├── users.py
│   ├── refresh_tokens.py
│   ├── roadmaps.py
│   └── stats.py            ← уже есть, лежит правильно
├── services/
│   ├── auth.py             ← переезжает из routers/auth.py
│   └── progress.py         ← появится: завершение этапа, стрик
└── routers/
    ├── auth.py             тонкий
    ├── users.py
    ├── roadmaps.py
    └── stats.py
```

Когда файлов станет много (обычно после ~15–20 эндпоинтов), эта же логика перекладывается **по фичам** — все слои одной фичи рядом:

```
app/features/
├── auth/
│   ├── router.py
│   ├── service.py
│   ├── queries.py
│   └── schemas.py
├── roadmaps/
│   └── ...
└── progress/
    └── ...
```

Правило зависимостей то же, меняется только группировка: не «все роутеры вместе», а «всё про auth вместе». Для devio сейчас рано — переезжай, когда начнёшь уставать прыгать между четырьмя папками ради одной фичи.

---

## 7. Как не надо

### Толстый роутер

Исходный `auth.py` — эталонный пример. Маркер: в теле эндпоинта есть `select(...)` или больше пяти строк логики.

### Логика в зависимостях

`Depends` — для получения ресурсов (сессия, юзер, права), не для бизнес-сценариев. Если в зависимость заползает «а ещё запишем в лог и обновим счётчик» — это сервис.

### Слой ради слоя

Пустые прослойки, которые только переадресуют вызов, — вред: файлов больше, пользы ноль. См. раздел 4.

### `utils.py` как помойка

Файл, куда сваливают всё подряд, растёт до тысячи строк и становится клубком зависимостей. Если функция про токены — она в `security.py`, про куки — в `cookies.py`, про данные — в `queries/`. Название файла должно отвечать на вопрос «что здесь живёт».

### Импорт снизу вверх

`queries/users.py`, импортирующий что-то из `services/` или `routers/`, — сломанное правило зависимостей и прямая дорога к циклическим импортам (Python упадёт с `ImportError: cannot import name ... (most likely due to a circular import)`).

### Модели, которые знают про API

Методы вроде `user.to_response_dict()` в модели — смешение слоёв. Форму ответа задаёт Pydantic-схема, модель отвечает только за хранение.

---

## Резюме

- Слои: **routers → services → queries → models**, зависимости только вниз
- **routers** — HTTP и ничего больше; **services** — правила проекта; **queries** — SQL без решений
- Сервис заводится там, где есть что решать; для тонкого CRUD роутер зовёт queries напрямую
- Транзакция принадлежит сценарию: commit делает сервис, а не каждый запрос
- Раскладка «по слоям» → при росте превращается в «по фичам»
- Побочный эффект правильной раскладки: часть багов (вроде разъехавшихся путей кук) становится невозможной

Порядок рефакторинга auth: сначала почини три бага → потом вынеси `queries/users.py` и `queries/refresh_tokens.py` → потом `services/auth.py` → потом `cookies.py` → роутер похудеет сам. По одному шагу, проверяя цикл register/login/me/refresh/logout после каждого.
