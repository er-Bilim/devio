# FastAPI Auth: refresh-токены

Седьмая часть справочника. Место в очереди: после `fastapi-auth-cookies.md` — то есть у тебя уже работает auth на Postgres с access-токеном в httpOnly cookie. Эта дока достраивает систему до полной схемы **access + refresh**, которую ты делал на Express — теперь она соберётся на нашем стеке.

---

## 0. Структура

Новых файлов нет — расширяются существующие:

```
backend/
├── app/
│   ├── config.py             # + срок жизни refresh
│   ├── security.py           # + генерация/хеширование refresh-токенов
│   ├── models.py             # модель RefreshToken (из fastapi-database.md, раздел 7)
│   └── routers/
│       └── auth.py           # login выдаёт пару, + эндпоинт /auth/refresh, logout отзывает
```

Если модель `RefreshToken` ещё не в базе — сначала миграция: добавь модель из доки по БД → `alembic revision --autogenerate -m "add refresh tokens"` → прочитать глазами → `upgrade head`.

---

## 1. Проблема, которую решает пара токенов

У одиночного access-токена неразрешимая дилемма:

- **Короткий** (15–30 мин) — безопасно: украденный токен быстро протухает. Но юзера выкидывает каждые полчаса
- **Длинный** (30 дней) — удобно, но украденный токен месяц в руках злоумышленника, и отозвать его нельзя (JWT stateless — сервер его не помнит)

Решение — разделить обязанности между двумя токенами:

| | access | refresh |
|---|---|---|
| срок | 15–30 минут | 30 дней |
| ходит | с каждым запросом | только на `POST /auth/refresh` |
| природа | JWT (stateless, проверка = подпись) | случайная строка (stateful, хранится в БД) |
| отзыв | невозможен (и не нужен — короткий) | мгновенный: пометить в БД |

Флоу: access протух → фронт дёргает `/auth/refresh` → сервер сверяет refresh с БД → выдаёт свежую пару → юзер ничего не заметил. Протух и refresh (месяц не заходил) — честный редирект на логин.

Получается лучшее из двух миров: 99% запросов проверяются дёшево и stateless (access), а «долгая память» о сессии (refresh) лежит в БД, где её можно отозвать — разлогинить украденную сессию, «выйти на всех устройствах».

## 2. Почему refresh — НЕ JWT, и почему он хешируется

Два архитектурных решения, которые стоит понять, а не запомнить.

**Refresh — случайная непрозрачная строка.** JWT нужен там, где проверка должна работать без БД. Но refresh мы и так сверяем с БД при каждом использовании (иначе не отозвать) — самоописываемость JWT ничего не добавляет, а поверхность атаки (алгоритмы, подпись, библиотека) добавляет. Случайные 256 бит из `secrets.token_urlsafe` — проще и не менее безопасно.

**В БД лежит хеш, а не сам токен.** Та же логика, что с паролями: утечка базы не должна давать готовые к использованию сессии. Утёк дамп с хешами — злоумышленник не может предъявить их серверу: сервер хеширует присланный токен и сравнивает, а обратить хеш нельзя.

**Но хеш — sha256, а не argon2, и это не халтура.** Вспомни, почему пароли хешируют *медленными* алгоритмами: пароли низкоэнтропийны (человеческие слова), их перебирают по словарям, и медленность делает перебор дорогим. Refresh-токен — 256 бит криптографической случайности: перебирать его бессмысленно при любой скорости хеша (вариантов больше, чем атомов в обозримой Вселенной). Медленный хеш здесь не добавил бы защиты, зато замедлял бы каждый refresh-запрос. Правило: **низкая энтропия (пароли) → argon2, высокая энтропия (токены) → sha256**.

## 3. Настройки и security-слой

```python
# app/config.py — добавить поле
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    secret_key: str
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30      # ← новое

settings = Settings()  # type: ignore[call-arg]
```

```python
# app/security.py — добавить
import hashlib
import secrets

def generate_refresh_token() -> str:
    return secrets.token_urlsafe(32)          # 32 байта случайности → ~43 символа base64

def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
```

- **`secrets`** — модуль стандартной библиотеки для криптографической случайности. Именно он, а не `random`: `random` предсказуем и для секретов запрещён
- Функции нарочно живут в `security.py` рядом с парольными — весь криптослой в одном файле

Модель уже описана в `fastapi-database.md` (раздел 7), напомню форму:

```python
# app/models.py — уже должна быть
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    token_hash: Mapped[str] = mapped_column(unique=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    expires_at: Mapped[datetime]
    revoked: Mapped[bool] = mapped_column(server_default=text("false"))
```

## 4. Логин: выдаём пару

Refresh уезжает **второй httpOnly-кукой с суженным path**:

```python
# app/routers/auth.py — login в новой редакции
from datetime import datetime, timedelta, timezone

from app.security import (
    create_access_token, generate_refresh_token, hash_refresh_token, verify_password,
)
from app.models import RefreshToken

def set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(
        key="access_token", value=access,
        httponly=True, samesite="lax", secure=True,
        max_age=60 * settings.access_token_expire_minutes, path="/",
    )
    response.set_cookie(
        key="refresh_token", value=refresh,
        httponly=True, samesite="lax", secure=True,
        max_age=60 * 60 * 24 * settings.refresh_token_expire_days,
        path="/auth/refresh",          # ← кука прикладывается ТОЛЬКО к этому пути
    )

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

    access = create_access_token(user_id=str(user.id))
    refresh = generate_refresh_token()
    db.add(RefreshToken(
        token_hash=hash_refresh_token(refresh),        # в БД — только хеш!
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days),
    ))
    await db.commit()

    set_auth_cookies(response, access, refresh)
    return user
```

Разбор решений:

- **`path="/auth/refresh"`** — браузер приложит refresh-куку только к запросам на этот путь. Access ходит везде, refresh — в одну дверь: даже если где-то в логировании/прокси светятся куки обычных запросов, refresh среди них не будет. Минимизация поверхности
- **`set_auth_cookies`** — обычная функция-помощник (не зависимость): выдача пары понадобится и в login, и в refresh — выносим сразу
- Сам refresh-токен после `set_cookie` **нигде не сохраняется** на сервере — только его хеш. Оригинал существует в двух местах: у браузера в куке и мимолётно в этой функции

## 5. Эндпоинт /auth/refresh: обмен и ротация

```python
# app/routers/auth.py — добавить
@router.post("/refresh", response_model=UserPublic)
async def refresh_tokens(
    response: Response,
    db: DbSession,
    refresh_token: Annotated[str | None, Cookie()] = None,
):
    credentials_error = HTTPException(status_code=401, detail="Could not validate credentials")

    if refresh_token is None:
        raise credentials_error

    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(refresh_token))
    )
    stored = result.scalar_one_or_none()

    now = datetime.now(timezone.utc)
    if stored is None or stored.revoked or stored.expires_at < now:
        raise credentials_error

    user = await db.get(User, stored.user_id)
    if user is None:
        raise credentials_error

    # РОТАЦИЯ: старый refresh гасим, выдаём новую пару
    stored.revoked = True
    new_refresh = generate_refresh_token()
    db.add(RefreshToken(
        token_hash=hash_refresh_token(new_refresh),
        user_id=user.id,
        expires_at=now + timedelta(days=settings.refresh_token_expire_days),
    ))
    await db.commit()

    set_auth_cookies(response, create_access_token(user_id=str(user.id)), new_refresh)
    return user
```

Построчно про неочевидное:

- **Поиск по хешу**: хешируем присланный токен и ищем совпадение — та же механика, что `verify_password`, только хеш детерминированный (sha256 без соли даёт одинаковый результат — поэтому по нему можно искать `WHERE token_hash = ...`; с argon2 так бы не вышло, у него соль внутри)
- **Три причины отказа — один 401**: не нашли / отозван / просрочен. Знакомый принцип неразглашения
- **Ротация — refresh одноразовый.** Каждое использование гасит старый и выдаёт новый. Зачем: если токен украден, им воспользуется либо вор, либо юзер — а второй раз этот токен уже не сработает ни у кого. Кража перестаёт быть «тихой»: кто-то из двоих быстро упрётся в 401
- `get_current_user` этот эндпоинт **не** использует — refresh работает и с протухшим access, в этом его смысл

> **Продвинутый уровень (на будущее, не сейчас):** reuse detection — если предъявлен уже отозванный токен, это почти наверняка значит, что токен украли и им пользуются двое. Параноидальная реакция: отозвать ВСЕ refresh-токены юзера, разлогинив все сессии. Оставь TODO — красивая фича для этапа «полировка безопасности».

## 6. Логаут: отзыв + чистка кук

```python
# app/routers/auth.py — logout в новой редакции
@router.post("/logout", status_code=204)
async def logout(
    response: Response,
    db: DbSession,
    refresh_token: Annotated[str | None, Cookie()] = None,
):
    if refresh_token is not None:
        result = await db.execute(
            select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(refresh_token))
        )
        stored = result.scalar_one_or_none()
        if stored is not None:
            stored.revoked = True
            await db.commit()

    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/auth/refresh")
```

Нюанс: refresh-кука имеет `path="/auth/refresh"`, поэтому на `POST /auth/logout` браузер её… **не пришлёт**. Два варианта: перевесить logout на путь под `/auth/refresh` (некрасиво) или — проще и честнее — сузить path не так агрессивно: `path="/auth"` покрывает и refresh, и logout, оставаясь узким. Выбери второй вариант и поправь `set_auth_cookies` и `delete_cookie` на `path="/auth"`. (Оставил этот момент в тексте нарочно — это реальный подводный камень path-кук, лучше встретить его в доке, чем в проде.)

`delete_cookie` должен совпадать с `set_cookie` по `path` — иначе браузер посчитает это разными куками и ничего не удалит.

## 7. Фронтенд: перехват 401

Логика на твоём стеке (концептуально, соберёшь при стыковке фронта):

```typescript
// lib/api.ts — идея интерцептора
async function api(path: string, init?: RequestInit) {
  let res = await fetch(`${API_URL}${path}`, { ...init, credentials: "include" });

  if (res.status === 401 && path !== "/auth/refresh") {
    const refreshed = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST", credentials: "include",
    });
    if (refreshed.ok) {
      res = await fetch(`${API_URL}${path}`, { ...init, credentials: "include" });  // повтор
    }
  }
  return res;
}
```

Схема: поймал 401 → попробовал refresh → успех: повтори исходный запрос; провал: юзер разлогинен, редирект на логин. Тонкость для будущего: несколько одновременных 401 не должны запускать несколько refresh (ротация сделает все, кроме первого, невалидными) — решается «одним общим промисом refresh»; TanStack Query упростит обвязку. Это задача этапа стыковки с фронтом.

## 8. Проверка руками

1. `POST /auth/login` через `/docs` → в DevTools → Cookies две куки: `access_token` (path `/`) и `refresh_token` (path `/auth`)
2. `POST /auth/refresh` → 200, в DevTools **значения обеих кук изменились** (ротация), в базе: `SELECT revoked, expires_at FROM refresh_tokens;` — старая запись `revoked=true`, появилась новая
3. Повтори `POST /auth/refresh` со старой кукой не выйдет (браузер уже держит новую) — но можно скопировать старое значение руками через curl и убедиться в 401: одноразовость работает
4. `POST /auth/logout` → обе куки исчезли, запись в БД отозвана → `GET /users/me` → 401

## 9. Как не надо

- ❌ **Хранить refresh в БД открытым текстом** — утечка дампа = готовые сессии всех юзеров
- ❌ **`random` вместо `secrets`** — предсказуемый генератор для секретов не годится
- ❌ **Refresh без ротации** (многоразовый) — украденный токен работает до конца срока незаметно
- ❌ **Refresh-кука с `path="/"`** — токен «долгой памяти» ездит с каждым запросом, теряя главное преимущество узкого канала
- ❌ **Разный `path` у set_cookie и delete_cookie** — кука не удалится, «логаут не работает»
- ❌ **Забыть чистку**: отозванные и просроченные записи копятся вечно. Не срочно, но заведи TODO — периодический `DELETE WHERE revoked OR expires_at < now()` (при деплое станет cron-задачей)

---

## Резюме

- **Access** — короткий JWT, stateless, ходит везде; **refresh** — долгая случайная строка, живёт в БД хешем (sha256 — достаточно: энтропия высокая), ходит только на `/auth/refresh`
- Логин выдаёт пару: access-кука `path="/"`, refresh-кука узким path
- `/auth/refresh`: хеш → поиск → проверки (есть/не отозван/не просрочен) → **ротация** → новая пара
- Логаут отзывает refresh в БД и чистит обе куки (path должен совпадать!)
- Фронт: 401 → refresh → повтор запроса → при провале на логин
- `get_current_user` и весь остальной код не изменились — снова поменяли только слой, и снова это было дёшево благодаря слоистости

Порядок сборки: модель + миграция (если не было) → config → security (generate/hash) → set_auth_cookies + login → /auth/refresh → logout → проверка по разделу 8.
