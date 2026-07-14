# FastAPI Auth: переезд на httpOnly cookie

Шестая часть справочника. Место в очереди: **после** `fastapi-database.md` и переезда auth на Postgres — то есть к этому моменту у тебя рабочий auth на Bearer-заголовке (собран по `fastapi-auth.md`) и юзеры в реальной базе.

Это дока-**миграция**: рефакторинг работающей системы, а не сборка с нуля. Формат «было → стало» с объяснением каждого изменения.

---

## 0. Зачем переезжать

В Bearer-варианте токен после логина попадает на фронт и хранится там (localStorage/память). Проблема: всё, что доступно фронт-коду, доступно **любому JS на странице** — включая вредоносный скрипт, попавший через XSS-уязвимость (свою или из скомпрометированного npm-пакета). Одна дыра = украденные токены всех посетителей.

httpOnly cookie закрывает этот класс атак: браузер хранит cookie сам и **не даёт JS её читать** — `document.cookie` её просто не видит. XSS остаётся злом, но украсть токен через него уже нельзя.

Побочный бонус: фронт вообще перестаёт знать о существовании токена — браузер возит его автоматически. Из фронт-кода исчезает вся логика «сохранить/приложить/удалить токен».

Цена: две обязательные настройки (CSRF и CORS-credentials, разделы 4–5) и чуть менее удобная проверка в Swagger. Для продакшен-амбиций devio обмен выгодный.

**Карта изменений** (и, что не менее важно, НЕ-изменений):

| Файл | Что происходит |
|---|---|
| `app/security.py` | **не меняется вообще** — хеширование и JWT не знают, как токен ездит |
| `app/routers/auth.py` | логин кладёт токен в cookie вместо тела; появляется `/auth/logout` |
| `app/dependencies.py` | `get_current_user` читает cookie вместо заголовка |
| `app/schemas.py` | схема `Token` больше не нужна |
| `app/main.py` (CORS) | не меняется, но становится критичным — проверим |
| фронт | добавляется `credentials: "include"` |

Красивая иллюстрация слоёв: транспорт токена — отдельный слой, и мы меняем только его.

---

## 1. Логин: токен уезжает в Set-Cookie

**Было** (из `fastapi-auth.md`): логин возвращал `Token(access_token=..., token_type="bearer")` в теле ответа.

**Стало:**

```python
# app/routers/auth.py
from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

# ... register без изменений ...

@router.post("/login", response_model=UserPublic)
async def login(
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    db: DbSession,
):
    result = await db.execute(select(User).where(User.email == form.username))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(user_id=str(user.id))
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,     # JS не может прочитать cookie — суть всего переезда
        samesite="lax",    # cookie не поедет с cross-site POST — защита от CSRF (раздел 4)
        secure=True,       # только по HTTPS (для localhost браузеры делают исключение)
        max_age=60 * 30,   # секунды; держи в согласии со сроком жизни токена
        path="/",
    )
    return user
```

Разбор изменений:

- **Аргумент `response: Response`** — новый приём: FastAPI даёт объект будущего ответа, на который можно навесить заголовки/куки, продолжая возвращать значение через `return` как обычно. Гибрид «декларативный ответ + точечная ручная настройка»
- **`set_cookie` добавляет заголовок `Set-Cookie`** — дальше работает браузер: сохраняет cookie и прикладывает её к каждому следующему запросу на наш бэкенд. Твой Express-опыт тут переносится один в один: это `res.cookie(...)` с теми же флагами
- **`response_model` сменился на `UserPublic`** — токен больше не возвращается в теле. Осознанно: чем меньше мест, где токен виден, тем лучше. Логин теперь отдаёт юзера — фронту это даже удобнее (сразу есть кто залогинился)
- **Заголовок `WWW-Authenticate: Bearer` из 401 убран** — он часть Bearer-протокола, при куках не нужен

Схему `Token` из `schemas.py` можно удалять — последний потребитель исчез.

## 2. Логаут: теперь это эндпоинт

В Bearer-варианте логаут был делом фронта («забудь токен»). При httpOnly cookie фронт не может её ни прочитать, ни удалить — стирает сервер:

```python
# app/routers/auth.py — добавить
@router.post("/logout", status_code=204)
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
```

`delete_cookie` шлёт `Set-Cookie` с истёкшей датой — браузер удаляет cookie. `204 No Content` — семантически точный статус: операция успешна, тела нет.

## 3. get_current_user: читаем cookie

**Было:** токен доставал `OAuth2PasswordBearer` из заголовка `Authorization`.

**Стало:**

```python
# app/dependencies.py
from typing import Annotated

from fastapi import Cookie, Depends, HTTPException
import jwt

from app.security import decode_access_token

async def get_current_user(
    db: DbSession,
    access_token: Annotated[str | None, Cookie()] = None,
) -> User:
    credentials_error = HTTPException(status_code=401, detail="Could not validate credentials")

    if access_token is None:          # cookie не пришла — не залогинен
        raise credentials_error
    try:
        payload = decode_access_token(access_token)
    except jwt.InvalidTokenError:
        raise credentials_error

    user = await db.get(User, uuid.UUID(payload["sub"]))
    if user is None:
        raise credentials_error
    return user
```

Разбор:

- **`Cookie()`** — родня `Query()`, `Path()` и `Header()` из базовой доки: инструкция «возьми значение из cookie запроса». Имя cookie = имя аргумента: `access_token` — ровно как назвали в `set_cookie`
- **`str | None = None`** — cookie объявлена необязательной **на уровне парсинга**. Иначе её отсутствие давало бы автоматический 422 «missing cookie», а мы хотим осмысленный 401 «не залогинен» — поэтому проверяем на `None` сами
- **`OAuth2PasswordBearer` удаляется** вместе с импортом — его роль (достать токен из транспорта) целиком перешла к `Cookie()`. Всё, что после извлечения токена (decode, поиск юзера), — без изменений
- В официальном туториале FastAPI и большинстве гайдов auth построен на заголовке — теперь ты знаешь, **какой именно слой** у них отличается, и можешь читать их без путаницы

## 4. CSRF: почему нужен samesite

Новый класс атак взамен закрытого. Раз браузер прикладывает cookie **сам**, злой сайт `evil.com` может отрендерить форму, отправляющую POST на `api.devio.…/roadmaps/x/complete` — и браузер приложил бы cookie залогиненного юзера. Это CSRF (cross-site request forgery).

Защита уже стоит в нашем `set_cookie`: `samesite="lax"` — браузер не прикладывает cookie к запросам, инициированным с чужих сайтов, кроме «безопасных» top-level переходов (GET по ссылке). Практическое следствие для API: **все мутации — только POST/PATCH/DELETE, никогда GET**. GET-эндпоинт, меняющий данные, при `lax` остаётся уязвимым — это теперь не только вопрос семантики HTTP, но и безопасности.

Для devio `lax` достаточно. Более строгие схемы (CSRF-токены, `samesite="strict"`) — оверкилл, пока у тебя нет POST-форм, на которые юзеры переходят по внешним ссылкам.

## 5. CORS + credentials: согласие двух сторон

Кросс-доменные cookie (фронт `localhost:3000` → API `localhost:8000`) по умолчанию не ездят — нужно явное согласие **обеих** сторон.

Бэкенд — наш CORS из `fastapi-basics.md` уже настроен правильно, просто теперь каждая строчка заработала по-настоящему:

```python
# app/main.py — проверить, что ровно так
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # ТОЧНЫЙ origin: с credentials нельзя "*"
    allow_credentials=True,                    # ← разрешение на куки в кросс-доменных запросах
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Фронтенд — каждый запрос к API с флагом:

```typescript
// lib/api.ts — обёртка, через которую пойдут все запросы
export function api(path: string, init?: RequestInit) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",   // без этого браузер НЕ приложит cookie к кросс-доменному запросу
  });
}
```

Связка правил, которую стоит понять один раз: `credentials: "include"` требует, чтобы сервер ответил `Access-Control-Allow-Credentials: true` (это и делает `allow_credentials=True`), а стандарт CORS запрещает сочетание credentials с `allow_origins=["*"]` — иначе любой сайт мог бы ходить в API с чужими куками. Поэтому origin всегда точный.

Итоговая картина на твоём стеке: в Zustand — только **статус** auth и данные юзера из `/users/me` (токена на фронте не существует как сущности); TanStack Query — через обёртку `api()`; глобальная ловля 401 → редирект на логин.

## 6. Проверка руками

Swagger живёт на том же origin (`127.0.0.1:8000`), поэтому кнопка Authorize больше не нужна — браузер сам сохранит cookie после логина и сам приложит к следующим запросам:

1. `POST /auth/login` → Try it out → 200
2. DevTools → Application → Cookies → `http://127.0.0.1:8000` → видишь `access_token`, колонка **HttpOnly** отмечена
3. Консоль DevTools: `document.cookie` → строки `access_token` там **нет**. Это httpOnly в действии — момент, ради которого всё затевалось
4. `GET /users/me` → 200 без всяких Authorize
5. `POST /auth/logout` → `GET /users/me` → 401

## 7. Как не надо: грабли cookie-мира

- ❌ **Забыть `credentials: "include"` на фронте.** Классический симптом: логин возвращает 200, а следующий запрос — 401. Cookie пришла в ответе, но браузер не прикладывает её к кросс-доменным запросам без флага
- ❌ **Смешивать `localhost` и `127.0.0.1`.** Для браузера это разные origin'ы: фронт открыт на `localhost:3000`, а API зовёшь по `127.0.0.1:8000` — cookie поедет мимо CORS-правил. Одно имя хоста везде
- ❌ **GET-эндпоинты, меняющие данные.** При `samesite="lax"` это дыра под CSRF (раздел 4)
- ❌ **`allow_origins=["*"]` в надежде «чтобы работало».** С credentials это не заработает никогда — ограничение стандарта, а не FastAPI
- ❌ **Разные сроки жизни cookie и токена.** `max_age` куки ≠ `exp` токена даёт странные состояния («кука есть, токен протух»). Держи их согласованными — лучше через общую настройку в `config.py`

---

## Резюме

- Переезд затронул только **транспортный слой**: `security.py` не изменился ни на строчку — токены и хеши не знают, как ездят по сети
- Логин: `response.set_cookie(httponly, samesite="lax", secure)`; токен исчез из тела ответа. Логаут стал эндпоинтом
- `get_current_user`: `Cookie()` вместо `OAuth2PasswordBearer`
- Две новые обязанности: CSRF (лечится `samesite` + дисциплина «мутации не через GET») и CORS-credentials (`allow_credentials=True` + точный origin + `credentials: "include"`)
- Фронт стал проще: токен-логики нет вообще, в Zustand только статус

Следующая связанная итерация — refresh-токены (раздел 11 в `fastapi-auth.md` + таблица `refresh_tokens` из доки по БД): refresh поедет второй httpOnly cookie с `path="/auth/refresh"`, чтобы прикладываться только к одному эндпоинту. Доберёмся, когда основной цикл заработает на куках.
