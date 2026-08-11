# devio 🚇

Интерактивные роадмапы для входа в IT. Каждое направление — ветка метро: станции в правильном порядке, прогресс на карте, стрик не даёт сойти с маршрута.

**Стек:** FastAPI · SQLAlchemy 2.0 (async) · PostgreSQL 17 · Alembic · Next.js (App Router) · TypeScript · Tailwind · TanStack Query · Zustand

---

## Быстрый старт

Нужен только Docker:

```bash
git clone https://github.com/er-Bilim/devio.git && cd devio
cp backend/.env.example backend/.env    # вписать SECRET_KEY (для дева — любая строка)
docker compose up --build
```

Через минуту:

| Что | Где |
|---|---|
| Фронтенд | http://localhost:3000 |
| API + Swagger | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 (`devio` / тестовая `devio_test` создаётся сама) |

Миграции накатываются при старте автоматически. Порты привязаны к 127.0.0.1.

## Режимы запуска

```bash
docker compose up                        # ДЕВ: bind mounts + hot-reload бэка и фронта
docker compose -f docker-compose.yml up  # ПРОД-репетиция: standalone-образы, код запечён
```

Подробная шпаргалка команд: [docs/docker-commands.md](docs/docker-commands.md)

## Тесты

```bash
cd backend && pytest -v
```

Интеграционные тесты против настоящего Postgres (`devio_test`): auth-цикл целиком (регистрация → логин → refresh-ротация → отзыв → логаут), идемпотентность завершения этапов, стрик на параметризованных сценариях дат. Изоляция — savepoint-транзакции: каждый тест стартует с чистой базы.

CI гоняет тесты + ruff на каждый PR; красное не мержится.

## Как устроен код

```
backend/app/
├── routers/      # HTTP-слой: принял → отдал (без SQL и бизнес-логики)
├── services/     # сценарии: транзакции, составные операции
├── queries/      # весь SQL проекта
├── models/       # таблицы по доменам (users, roadmaps, progress, tokens)
├── schemas/      # Pydantic-контракты по доменам
└── tests/        # pytest + фикстурная лестница client → registered → auth

frontend/src/
├── app/          # роуты Next: страницы только собирают виджеты
├── widgets/      # блоки страниц (hero, header)
├── features/     # действия юзера (логин, завершить этап)
├── entities/     # сущности (roadmap, user) — данные и отображение
└── shared/       # api-клиент, ui-кит, сгенерированные типы
```

Типы фронта генерируются из OpenAPI-схемы бэка: `npm run gen:api` — контракт один, руками не дублируется.

## Auth

JWT в httpOnly-куках: короткий access + refresh с ротацией (хеши refresh — в базе, украденный и использованный токен бесполезен). Пароли — argon2.

## Документация

Проект разрабатывается вместе с подробным справочником (на русском) — от первого эндпоинта до контейнеризации: [docs/](docs/)

Ключевые: `fastapi-testing` (тестовая инфраструктура), `fastapi-refactoring` + `backend-imports-naming` (архитектура и конвенции), `docker-devio` (контейнеры), `fsd-structure` (фронт-слои), `next-components` (серверные/клиентские компоненты).

## Автоматизация PR

CodeRabbit — описание PR (плейсхолдер в шаблоне), авто-лейблы, авторевью. Qodo — второе мнение (`/review`, `/improve`). pr-size-labeler — size:XS–XL. Плюс ruff локально и в CI.

## Статус

- [x] Бэк: auth, роадмапы, прогресс, стрик, статистика
- [x] Тесты + CI
- [x] Рефакторинг по доменам
- [x] Docker: весь проект одной командой
- [ ] Фронт: перенос ночного дизайна (в процессе)
- [ ] Деплой

---

*построено ночью, работает круглосуточно*