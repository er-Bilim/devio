# FastAPI + PostgreSQL: подключение базы данных

Четвёртая часть справочника (`fastapi-basics.md` → `fastapi-depends.md` → `fastapi-auth.md` → эта). Здесь `get_db` из доки по Depends перестаёт быть псевдокодом, а `fake_users_db` из доки по auth уходит на пенсию.

Стек слоя данных:

| Что | Роль | Аналог из Node-опыта |
|---|---|---|
| **PostgreSQL** | сама база (единственная) | MongoDB-сервер |
| **SQLAlchemy 2.0** | ORM: модели, запросы из Python | Mongoose |
| **asyncpg** | асинхронный драйвер, работает под капотом SQLAlchemy | нативный mongodb-драйвер внутри Mongoose |
| **Alembic** | версионируемые миграции схемы | аналога в Mongoose из коробки нет |

Все примеры — в современном синтаксисе SQLAlchemy 2.0 (`Mapped` / `mapped_column`, `select()`). В старых туториалах повсюду стиль 1.x (`Column(...)`, `session.query(...)`) — он работает, но для нового кода не используется; маркеры старого стиля собраны в разделе 11.

---

## 0. Структура

```
backend/
├── alembic/                  # ← создастся командой alembic init (раздел 8)
│   ├── env.py
│   └── versions/             # файлы миграций
├── alembic.ini
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py             # + database_url
│   ├── db.py                 # ← НОВЫЙ СМЫСЛ: engine, сессии, get_db, Base
│   ├── models.py             # ← НОВЫЙ: SQLAlchemy-модели (таблицы)
│   ├── schemas.py            # Pydantic-модели (формы API) — это ДРУГОЕ, см. раздел 5
│   ├── dependencies.py
│   ├── security.py
│   └── routers/
└── requirements.txt
```

Установка:

```bash
pip install "sqlalchemy[asyncio]" asyncpg alembic
pip freeze > requirements.txt
```

---

## 1. Поднимаем сам PostgreSQL

Два нормальных пути, выбери один:

**Вариант А: Docker (рекомендую для разработки).** Ничего не ставится в систему, база сносится и пересоздаётся одной командой:

```yaml
# backend/docker-compose.yml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: devio
      POSTGRES_PASSWORD: devio
      POSTGRES_DB: devio
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker compose up -d      # поднять
docker compose down       # остановить (данные сохранятся в volume)
```

**Вариант Б: облако (Neon, Supabase).** Регистрируешься, создаёшь проект, получаешь готовый URL подключения. Плюс: тот же инстанс потом станет продом. Минус: разработка зависит от интернета.

Проверка подключения не нужна отдельно — увидим её в разделе 8 при первой миграции.

---

## 2. URL подключения и конфиг

База описывается одной строкой подключения:

```
postgresql+asyncpg://devio:devio@localhost:5432/devio
└────┬────┘ └──┬──┘  └─┬─┘ └─┬─┘ └───┬───┘ └┬─┘ └─┬─┘
  диалект   драйвер  юзер пароль   хост   порт  имя БД
```

Часть `+asyncpg` критична: она говорит SQLAlchemy работать через асинхронный драйвер. Забудешь — получишь ошибку про «greenlet» или синхронный драйвер (частая ошибка №1).

```python
# app/config.py — добавить поле
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    secret_key: str
    access_token_expire_minutes: int = 30
    database_url: str                      # ← новое обязательное поле

settings = Settings()  # type: ignore[call-arg]
```

```
# .env — добавить строку
DATABASE_URL=postgresql+asyncpg://devio:devio@localhost:5432/devio
```

---

## 3. Engine, сессии, get_db

Три сущности, которые важно не путать:

- **Engine** — «завод подключений»: держит пул соединений с базой. Создаётся **один раз** на всё приложение
- **Session** — рабочая единица: короткоживущий объект «одна сессия = один запрос», через неё идут все операции. Аналог: в Mongoose ты об этом не думал — модель сама ходила через глобальное подключение; в SQLAlchemy единица работы явная, и это даёт контроль над транзакциями
- **get_db** — зависимость, выдающая сессию в хендлер и гарантированно закрывающая её (yield-паттерн из `fastapi-depends.md`, раздел 5 — теперь вживую)

```python
# app/db.py
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

# один на приложение: пул соединений
engine = create_async_engine(settings.database_url, echo=True)
# echo=True печатает каждый SQL-запрос в консоль — бесценно при обучении, на проде выключить

# фабрика сессий
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# базовый класс всех моделей — через него Alembic узнаёт о таблицах
class Base(DeclarativeBase):
    pass

# зависимость: одна сессия на запрос
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session
```

`async with` — асинхронный вариант контекстного менеджера: сам закроет сессию после запроса, включая случай исключения (это тот же `try/finally` из доки по Depends, но встроенный в протокол объекта).

Алиас для сигнатур — сразу в привычном стиле:

```python
# app/dependencies.py — добавить
from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db

DbSession = Annotated[AsyncSession, Depends(get_db)]
```

---

## 4. Модели: описываем таблицы

Модель SQLAlchemy = класс, описывающий таблицу. Начнём с ядра devio — юзеры, роадмапы, этапы, прогресс:

```python
# app/models.py
from datetime import datetime
import uuid

from sqlalchemy import ForeignKey, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, server_default=text("gen_random_uuid()")
    )
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password_hash: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    progress: Mapped[list["StageProgress"]] = relationship(back_populates="user")


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(unique=True, index=True)
    title: Mapped[str]
    description: Mapped[str | None]        # nullable выводится из | None

    stages: Mapped[list["Stage"]] = relationship(
        back_populates="roadmap", order_by="Stage.position"
    )


class Stage(Base):
    __tablename__ = "stages"

    id: Mapped[int] = mapped_column(primary_key=True)
    roadmap_id: Mapped[int] = mapped_column(ForeignKey("roadmaps.id"))
    title: Mapped[str]
    position: Mapped[int]                  # порядок этапа в роадмапе

    roadmap: Mapped["Roadmap"] = relationship(back_populates="stages")


class StageProgress(Base):
    __tablename__ = "stage_progress"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    stage_id: Mapped[int] = mapped_column(ForeignKey("stages.id"))
    completed_at: Mapped[datetime] = mapped_column(server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="progress")
```

Разбор нового синтаксиса:

- **`Mapped[тип]`** — «колонка такого типа». SQL-тип выводится из питоновского: `str` → `VARCHAR`, `int` → `INTEGER`, `datetime` → `TIMESTAMP`, `uuid.UUID` → `UUID`. `Mapped[str | None]` → колонка `NULLABLE`
- **`mapped_column(...)`** — детали колонки: `primary_key`, `unique`, `index`, дефолты. Если деталей нет (`password_hash`), можно вообще без него
- **`server_default`** — дефолт считает **база**, не Python: `func.now()` → SQL `now()`, `gen_random_uuid()` → Postgres сам генерирует UUID. Надёжнее питоновских дефолтов: работает даже при записи в таблицу мимо приложения
- **`ForeignKey("roadmaps.id")`** — ссылка на другую таблицу с проверкой целостности: базу физически невозможно привести в состояние «этап ссылается на несуществующий роадмап». В Mongo это было на твоей совести — здесь это закон
- **`relationship(...)`** — питоновская навигация по связи: `roadmap.stages` вернёт список этапов. Это не колонка (в таблице её нет), а инструкция ORM, как связаны объекты. `back_populates` связывает две стороны: изменил одну — вторая в курсе

**Связь многие-ко-многим** здесь — `StageProgress`: юзер ↔ этапы через промежуточную таблицу. В Mongoose ты бы хранил массив ссылок; в SQL промежуточная таблица — стандарт, и она удобнее: на связь можно вешать свои данные (у нас — `completed_at`, из которого потом посчитается стрик).

---

## 5. Модели БД ≠ схемы API

Важная перестройка после Mongoose, где модель была одна на всё. Здесь классов **два вида**, и это осознанное разделение:

- `app/models.py` (SQLAlchemy) — как данные **хранятся**: все поля, включая `password_hash`
- `app/schemas.py` (Pydantic) — как данные **ходят по API**: что принимаем, что отдаём

Чтобы Pydantic умел строить схему прямо из SQLAlchemy-объекта:

```python
# app/schemas.py
import uuid
from pydantic import BaseModel, ConfigDict

class StageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)   # «читай поля из атрибутов объекта»

    id: int
    title: str
    position: int

class RoadmapOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    description: str | None
    stages: list[StageOut] = []
```

`from_attributes=True` позволяет `response_model` брать значения не из dict-ключей, а из атрибутов ORM-объекта (`roadmap.slug`). Вернул из хендлера SQLAlchemy-объект — на выходе JSON строго по Pydantic-схеме.

Кажется дублированием? Это фича: схем API на одну модель БД обычно несколько (`UserRegister` на вход, `UserPublic` наружу — без хеша), и они меняются независимо от хранения.

---

## 6. Запросы: CRUD в стиле 2.0

Центральная конструкция — `select()`, выполняемая через сессию:

```python
# app/routers/roadmaps.py — целиком, на живой базе
from fastapi import APIRouter, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.dependencies import DbSession
from app.models import Roadmap
from app.schemas import RoadmapOut

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


@router.get("/", response_model=list[RoadmapOut])
async def list_roadmaps(db: DbSession):
    result = await db.execute(
        select(Roadmap).options(selectinload(Roadmap.stages))
    )
    return result.scalars().all()


@router.get("/{slug}", response_model=RoadmapOut)
async def get_roadmap(slug: str, db: DbSession):
    result = await db.execute(
        select(Roadmap)
        .where(Roadmap.slug == slug)
        .options(selectinload(Roadmap.stages))
    )
    roadmap = result.scalar_one_or_none()
    if roadmap is None:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap
```

Построчно:

- **`select(Roadmap).where(Roadmap.slug == slug)`** — конструктор SQL. Обрати внимание: `Roadmap.slug == slug` — это не сравнение, а построение выражения `WHERE slug = :slug` (перегруженный оператор). Значения подставляются параметрами — SQL-инъекции невозможны by design
- **`await db.execute(...)`** — вот он, честный await: запрос ушёл в базу асинхронно
- **`.scalars().all()`** / **`.scalar_one_or_none()`** — распаковка результата: список объектов / один или None
- **`selectinload(Roadmap.stages)`** — явная подгрузка связи. Критично в async-мире: см. раздел 10, грабля №2

Запись:

```python
# фрагмент: создание (например, в будущей админке)
@router.post("/", response_model=RoadmapOut, status_code=201)
async def create_roadmap(data: RoadmapCreate, db: DbSession):
    roadmap = Roadmap(slug=data.slug, title=data.title, description=data.description)
    db.add(roadmap)              # запланировать INSERT (в базу ещё не ушло)
    await db.commit()            # зафиксировать транзакцию
    await db.refresh(roadmap)    # подтянуть с базы server_default-поля (id и т.п.)
    return roadmap
```

Паттерн «add → commit → refresh» — стандартный цикл создания. `commit` фиксирует **транзакцию**: до него изменения видны только твоей сессии, при ошибке всё откатывается атомарно. Ключевое отличие от Mongoose, где каждый `save()` жил сам по себе: здесь несколько операций можно сделать неделимым блоком — или все, или ни одной.

Точечное чтение по первичному ключу — короче: `await db.get(Roadmap, roadmap_id)`.

А вот твоя фича популярности — то, ради чего брали SQL:

```python
# фрагмент: сколько юзеров прошли хотя бы один этап каждого роадмапа
from sqlalchemy import func, select
from app.models import Roadmap, Stage, StageProgress

stmt = (
    select(Roadmap.slug, func.count(func.distinct(StageProgress.user_id)).label("learners"))
    .join(Stage, Stage.roadmap_id == Roadmap.id)
    .join(StageProgress, StageProgress.stage_id == Stage.id)
    .group_by(Roadmap.slug)
    .order_by(func.count(func.distinct(StageProgress.user_id)).desc())
)
```

JOIN + GROUP BY + COUNT — один запрос, база сделает всё сама. Разбор таких запросов — тема отдельной доки, здесь просто оцени форму.

---

## 7. Auth переезжает на базу

`fake_users_db` из `fastapi-auth.md` заменяется реальными запросами. Меняется только слой хранения — вся крипто-механика (`security.py`) не трогается вообще:

```python
# app/routers/auth.py — фрагмент register в новой редакции
@router.post("/register", response_model=UserPublic, status_code=201)
async def register(data: UserRegister, db: DbSession):
    exists = await db.execute(select(User).where(User.email == data.email))
    if exists.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(email=data.email, password_hash=hash_password(data.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
```

`get_current_user` аналогично: вместо перебора словаря — `await db.get(User, user_id)`. Логин — `select` по email + `verify_password`. Перепиши эти три места сам по образцу выше — хорошее первое упражнение на живой базе.

Под refresh-токены (ты их планируешь) заведи таблицу сразу:

```python
# app/models.py — добавить
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    token_hash: Mapped[str] = mapped_column(unique=True)   # хеш, не сам токен!
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    expires_at: Mapped[datetime]
    revoked: Mapped[bool] = mapped_column(server_default=text("false"))
```

---

## 8. Alembic: миграции

Таблицы описаны в коде, но в базе их ещё нет. Создавать их будет не приложение, а **миграции** — версионируемые скрипты изменений схемы. Думай о них как о git для структуры БД: каждый шаг записан, применяется по порядку, работает одинаково на твоей машине и на проде.

Инициализация (из `backend/`, важен флаг async):

```bash
alembic init -t async alembic
```

Появятся `alembic.ini` и папка `alembic/`. Две правки в `alembic/env.py`:

```python
# alembic/env.py — фрагменты для правки

# 1) отдать Alembic'у URL из настроек (вместо захардкоженного в alembic.ini)
from app.config import settings
config.set_main_option("sqlalchemy.url", settings.database_url)

# 2) показать Alembic'у модели — без этого autogenerate слеп
from app.db import Base
from app import models  # noqa: F401  ← импорт нужен, чтобы модели зарегистрировались в Base
target_metadata = Base.metadata
```

Рабочий цикл, который ты будешь гонять постоянно:

```bash
# 1. Изменил/добавил модели в app/models.py
# 2. Сгенерировать миграцию (Alembic сравнит модели с реальной базой):
alembic revision --autogenerate -m "add users and roadmaps"
# 3. ПРОЧИТАТЬ сгенерированный файл в alembic/versions/ — глазами!
# 4. Применить:
alembic upgrade head
```

Шаг 3 не формальность: autogenerate хорош, но не всевидящ (переименование колонки он видит как «удалить + создать» — с потерей данных). Правило: **сгенерировал — прочитал — применил**.

Откат на шаг назад: `alembic downgrade -1`.

> В туториалах встретишь `Base.metadata.create_all(engine)` — создание таблиц напрямую из моделей. Для продакшен-подхода это тупик: никакой истории изменений, невозможно эволюционировать схему с данными. Мы это не используем — только миграции, с первого дня.

---

## 9. Жизненный цикл: engine и приложение

Engine создан на уровне модуля и живёт всё время работы приложения. Единственное, что стоит сделать явно — корректно закрыть пул при остановке, через lifespan:

```python
# app/main.py — фрагмент
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield                          # ← здесь приложение работает
    await engine.dispose()         # при остановке: закрыть пул соединений

app = FastAPI(title="devio API", lifespan=lifespan)
```

Знакомый паттерн: это тот же yield-механизм «setup / teardown», что и в зависимостях, только на уровне всего приложения.

---

## 10. Как не надо: грабли async + SQLAlchemy

### 1. Синхронный драйвер в async-коде

`DATABASE_URL` без `+asyncpg` (просто `postgresql://...`) → SQLAlchemy возьмёт синхронный драйвер → ошибки вида `greenlet_spawn has not been called` или молчаливая блокировка event loop. URL всегда `postgresql+asyncpg://`.

### 2. Ленивая подгрузка связей (грабля №1 по популярности)

```python
result = await db.execute(select(Roadmap))
roadmap = result.scalars().first()
roadmap.stages                      # ❌ MissingGreenlet!
```

По умолчанию связи ленивые: обращение к `roadmap.stages` втихую делает **ещё один запрос** к базе. В async-мире неявный запрос невозможен (нет await) — получишь `MissingGreenlet`. Решение: явно объявлять, что грузим, — `.options(selectinload(Roadmap.stages))` в запросе. Побочный бонус: это же лечит проблему N+1 запросов, знакомую по любым ORM.

### 3. Забытый await

`db.execute(...)` без await не выполнит запрос, а вернёт корутину; ошибка всплывёт дальше по коду в неожиданном месте (`'coroutine' object has no attribute ...`). Все операции сессии — `execute`, `commit`, `refresh`, `get` — асинхронные.

### 4. Забытый commit

`db.add(obj)` без `await db.commit()` — изменения тихо откатятся при закрытии сессии. Симптом: «эндпоинт отработал без ошибок, а в базе пусто».

### 5. Строковый SQL с конкатенацией

```python
await db.execute(text(f"SELECT * FROM users WHERE email = '{email}'"))   # ❌ SQL-инъекция
```

Сырой SQL иногда нужен (сложная аналитика), но **только** с параметрами: `text("... WHERE email = :email"), {"email": email}`. А в 95% случаев — просто `select()`, там инъекции исключены конструктивно.

### 6. Старый стиль из туториалов

Маркеры кода 1.x, который не надо копировать в проект: `session.query(User)` (→ `select(User)`), `Column(String)` (→ `Mapped[str]`), `declarative_base()` (→ `class Base(DeclarativeBase)`), `sessionmaker` без async (→ `async_sessionmaker`). Работать оно будет, но это уходящий синтаксис, и смешивать стили в одном проекте — путь к каше.

---

## Резюме

Слой данных целиком:

1. **Postgres в Docker** (`docker compose up -d`), URL в `.env`
2. **`db.py`**: engine (один, на модуле) → `async_sessionmaker` → `get_db` с yield → алиас `DbSession`
3. **`models.py`**: `Mapped[тип]` + `mapped_column`, `ForeignKey` для связей, `relationship` для навигации
4. **`schemas.py`** отдельно от моделей: `from_attributes=True` — мост между ORM-объектами и API
5. **Запросы**: `select().where()` + `await db.execute()`; связи — только через `selectinload`; запись — add → commit → refresh
6. **Alembic**: изменил модели → `revision --autogenerate` → прочитал глазами → `upgrade head`

Порядок сборки: docker-compose → пакеты → config → db.py → модели User/Roadmap/Stage/StageProgress → alembic init + первая миграция → переписать auth с fake_users_db на базу → роутер роадмапов.

Следующие темы по мере продвижения: SQL-запросы для статистики (JOIN/GROUP BY — под фичу популярности), расчёт стрика по `completed_at`, refresh-токены поверх таблицы `refresh_tokens`.
