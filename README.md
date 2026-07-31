# devio

**Интерактивные роадмапы для входа в IT — этапы, примеры, практика.**

Вместо хаотичного гугления «с чего начать» — понятный путь: направления, этапы, примеры и отслеживание собственного прогресса. Визуальная метафора проекта — карта метро: каждый этап обучения это станция, а направление — ветка.

---

## Возможности

**Роадмапы по направлениям**
Пошаговые пути обучения — Frontend и Backend (DevOps и Mobile в планах). Каждый роадмап разбит на этапы: что учить, в каком порядке и зачем, с примерами кода и практикой.

**Профиль и прогресс**
Текущая станция на карте, пройденные этапы, стрик — счётчик дней непрерывного обучения — и личная статистика.

**Статистика популярности**
Какие направления изучают чаще всего и какой этап становится следующим — считается по реальной активности пользователей.

---

## Стек

| Слой | Технологии |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript (strict), Tailwind CSS, TanStack Query, Zustand |
| Backend | FastAPI, Python 3.12 |
| ORM / БД | SQLAlchemy 2.0 (async), asyncpg, PostgreSQL 17 |
| Миграции | Alembic |
| Auth | JWT (pyjwt) + argon2 (pwdlib), httpOnly cookies, access + refresh с ротацией |
| Инфраструктура | Docker Compose |

---

## Как устроен бэкенд

```
backend/
├── alembic/                  миграции схемы БД
├── app/
│   ├── main.py               создание приложения, роутеры, CORS
│   ├── config.py             настройки из .env (pydantic-settings)
│   ├── db.py                 engine, async-сессии, зависимость get_db
│   ├── models.py             таблицы: User, Roadmap, Stage, StageProgress, RefreshToken
│   ├── schemas.py            Pydantic-схемы запросов и ответов
│   ├── security.py           хеширование паролей, выпуск и проверка токенов
│   ├── dependencies.py       get_current_user, роли, алиасы зависимостей
│   ├── queries/              SQL-запросы статистики
│   └── routers/              эндпоинты: auth, users, roadmaps, stats
├── docker-compose.yml
└── requirements.txt
```

**Аутентификация.** Пароли хранятся только в виде argon2-хеша. После логина клиент получает пару токенов в httpOnly cookies: короткий access (JWT) и долгий refresh. Refresh хранится в БД в виде sha256-хеша, при каждом использовании ротируется, отзыв возможен в любой момент.

**Статистика.** Популярность направлений и стрик считаются на стороне базы — агрегациями с JOIN и оконными функциями, без выгрузки строк в приложение.

---

## Быстрый старт

Нужны Docker и Python 3.12+.

```bash
git clone https://github.com/er-Bilim/devio.git
cd devio/backend
```

**1. Поднять базу**

```bash
docker compose up -d
```

**2. Окружение и зависимости**

```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

**3. Переменные окружения**

Скопируйте `.env.example` в `.env` и заполните:

```env
SECRET_KEY=сгенерируйте: openssl rand -hex 32
DATABASE_URL=postgresql+asyncpg://devio:devio@localhost:5432/devio
```

**4. Применить миграции**

```bash
alembic upgrade head
```

**5. Запустить API**

```bash
fastapi dev app/main.py
```

- API: http://127.0.0.1:8000
- Интерактивная документация: http://127.0.0.1:8000/docs

---

## Документация

В папке `docs/` — серия справочников по стеку проекта, написанных по ходу разработки:

| Файл | О чём |
|---|---|
| `fastapi-basics.md` | Основы FastAPI: роуты, параметры, Pydantic, структура проекта |
| `fastapi-depends.md` | Система зависимостей: цепочки, yield, Annotated, подмена в тестах |
| `fastapi-auth.md` | Аутентификация с нуля: argon2, JWT, get_current_user |
| `docker-basics.md` | Docker и Compose на примере PostgreSQL |
| `fastapi-database.md` | SQLAlchemy 2.0 async, модели, связи, Alembic |
| `fastapi-auth-cookies.md` | Переезд с Bearer-заголовка на httpOnly cookies, CSRF и CORS |
| `fastapi-refresh-tokens.md` | Пара access + refresh, ротация, отзыв сессий |
| `fastapi-sql-stats.md` | SQL для статистики: JOIN, GROUP BY, оконные функции, стрик |

---

## Статус

- [x] Схема БД и миграции
- [x] Регистрация, логин, защищённые эндпоинты
- [x] httpOnly cookies, access + refresh с ротацией
- [x] Запросы статистики: популярность направлений, стрик
- [ ] CRUD роадмапов и наполнение контентом
- [ ] Фронтенд: главная, страница направления, профиль
- [ ] Тесты
- [ ] Деплой

---

## Лицензия

MIT