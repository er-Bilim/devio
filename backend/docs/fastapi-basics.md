# FastAPI: основы (для разработчика из мира JS/TS)

Справочник по базе FastAPI применительно к проекту devio. Все примеры привязаны к структуре проекта — в заголовке каждого блока кода указан файл.

---

## 0. Структура проекта

К этой структуре привязаны все примеры ниже:

```
backend/
├── .venv/                    # виртуальное окружение (в .gitignore!)
├── app/
│   ├── __init__.py           # пустой файл - помечает папку как python-пакет
│   ├── main.py               # создание приложения, подключение роутеров
│   ├── schemas.py            # Pydantic-модели (формы данных)
│   ├── data.py               # мок-данные (пока нет БД)
│   └── routers/
│       ├── __init__.py
│       └── roadmaps.py       # эндпоинты /roadmaps
└── requirements.txt
```

**Зачем `__init__.py`:** в Python папка становится импортируемым пакетом только при наличии этого файла. Без него `from app.routers import roadmaps` упадёт с `ModuleNotFoundError`. Файл может быть полностью пустым — важен сам факт его существования. В JS аналога нет: там любая папка с `index.js` или файлы сами по себе импортируемы.

**Откуда запускать:** все команды (`fastapi dev`, `pip install`) — из папки `backend/`, с активированным окружением. Импорты вида `from app.schemas import ...` работают относительно точки запуска.

---

## 1. Ментальная модель FastAPI

FastAPI — фреймворк для HTTP API, построенный на идее **«типы — источник истины»**. Ты описываешь сигнатуру функции с аннотациями типов, а фреймворк из неё выводит:

1. **Парсинг** — откуда брать данные (путь, query, тело запроса)
2. **Валидацию** — соответствие типам, автоматический 422 при ошибке
3. **Документацию** — интерактивный Swagger на `/docs`
4. **Сериализацию** — превращение возвращаемого значения в JSON

Сравнение с твоим стеком: представь Express, где `req.params`, `req.query`, `req.body` уже распарсены, провалидированы через Zod и типизированы — и всё это только из сигнатуры хендлера. Вот это FastAPI.

Три технологии под капотом:

| Компонент | Роль | Аналог из JS-мира |
|---|---|---|
| Starlette | роутинг, request/response, middleware | Express/Koa (низкий уровень) |
| Pydantic | валидация данных через типы | Zod |
| uvicorn | ASGI-сервер, принимает соединения | сам Node/`node server.js` |

---

## 2. Аннотации типов Python

Фундамент всего. Синтаксис:

```python
# просто пример, не файл проекта
def greet(name: str, age: int = 18) -> str:
    return f"Hello {name}, you are {age}"
```

Разбор:
- `name: str` — аннотация типа аргумента
- `age: int = 18` — аннотация + значение по умолчанию
- `-> str` — тип возвращаемого значения

**Критичное отличие от TypeScript:** в TS типы проверяются компилятором и стираются. В Python интерпретатор аннотации **игнорирует** — `greet(123, "abc")` запустится без ошибок. Аннотации живут в рантайме как метаданные, и именно их FastAPI читает, чтобы строить валидацию. То есть в чистом Python типы — подсказка для IDE, а в FastAPI они становятся исполняемым контрактом.

Шпаргалка соответствий:

| TypeScript | Python |
|---|---|
| `string` | `str` |
| `number` | `int` или `float` (это разные типы!) |
| `boolean` | `bool` |
| `string[]` | `list[str]` |
| `[string, number]` | `tuple[str, int]` |
| `string \| null` | `str \| None` |
| `Record<string, number>` | `dict[str, int]` |
| `interface` / `type` | класс `BaseModel` (см. раздел 6) |

---

## 3. Приложение и первый эндпоинт

```python
# app/main.py
from fastapi import FastAPI

app = FastAPI(title="devio API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

Построчно:

- `app = FastAPI()` — объект приложения. Его имя важно: команда запуска `fastapi dev app/main.py` ищет переменную `app` в указанном файле. `title` попадёт в шапку Swagger-документации.
- `@app.get("/health")` — **декоратор**. В Python это функция, которая принимает другую функцию и что-то с ней делает. Здесь: регистрирует `health_check` как обработчик `GET /health` в таблице роутов приложения. Аналог `app.get("/health", handler)` в Express — просто синтаксис «наизнанку».
- Функция возвращает dict → FastAPI автоматически сериализует его в JSON и отдаёт со статусом `200` и заголовком `Content-Type: application/json`. Никаких `res.json()` — возврат значения и есть ответ.

Методы: `@app.get`, `@app.post`, `@app.put`, `@app.patch`, `@app.delete`.

**Запуск** (из папки `backend/`):

```bash
fastapi dev app/main.py
```

Сервер на `http://127.0.0.1:8000`, hot reload включён. Обязательно открой `http://127.0.0.1:8000/docs` — там уже виден твой эндпоинт, и его можно дёрнуть прямо из браузера.

---

## 4. Path-параметры

```python
# app/routers/roadmaps.py (пока представим, что это main.py — роутеры подключим в разделе 9)
@app.get("/roadmaps/{slug}")
def get_roadmap(slug: str):
    return {"slug": slug}
```

Как это работает:

- `{slug}` в строке пути связывается с аргументом функции **по имени**. Назвал аргумент иначе — FastAPI решит, что это query-параметр, а path-параметр останется несвязанным (и упадёт при старте с ошибкой).
- Тип аргумента = правило валидации. Объяви `slug: int` — и на `GET /roadmaps/abc` клиент получит `422 Unprocessable Entity` с JSON-описанием ошибки. Твоя функция даже не вызовется.

Отличие от Express: там `req.params.slug` — всегда строка, конвертация и проверка на тебе. Здесь конвертация (`"42"` → `42`) и проверка происходят **до** входа в функцию.

---

## 5. Query-параметры

Правило: аргумент функции, которого **нет в пути**, автоматически становится query-параметром.

```python
# app/routers/roadmaps.py
@app.get("/roadmaps")
def list_roadmaps(direction: str | None = None, limit: int = 10):
    ...
```

Запрос `GET /roadmaps?direction=frontend&limit=5` разложится так:
- `direction` получит `"frontend"`
- `limit` получит `5` (уже как `int`)

Правила обязательности:
- Есть значение по умолчанию (`= None`, `= 10`) → параметр **необязательный**
- Нет значения по умолчанию → параметр **обязательный**, без него — 422

`str | None = None` — идиома для «опциональный параметр»: тип говорит «может быть строкой или отсутствовать», дефолт задаёт значение при отсутствии. Прямой аналог `direction?: string` в TS.

---

## 6. Pydantic-модели: тело запроса

Формы данных описываются классами. Все модели проекта держи в одном месте:

```python
# app/schemas.py
from pydantic import BaseModel

class StageCreate(BaseModel):
    title: str
    order: int
    description: str | None = None
```

Синтаксис класса：`class StageCreate(BaseModel)` означает «класс StageCreate, наследующий BaseModel». Наследование от `BaseModel` — это то, что даёт классу суперспособности Pydantic: валидацию, сериализацию, генерацию JSON-схемы.

Использование:

```python
# app/routers/roadmaps.py
from app.schemas import StageCreate

@app.post("/stages")
def create_stage(stage: StageCreate):
    return {"created": stage.title}
```

**Как FastAPI решает, откуда брать данные** (важно понять один раз):

| Тип аргумента | Источник данных |
|---|---|
| примитив, есть в пути (`{slug}`) | path-параметр |
| примитив, нет в пути | query-параметр |
| класс-наследник `BaseModel` | тело запроса (JSON) |

Что происходит на `POST /stages` с JSON-телом:
1. FastAPI парсит JSON
2. Прогоняет через модель: типы, обязательность полей
3. Невалидно → 422 с перечислением проблемных полей (каждое: где лежит, что не так)
4. Валидно → в функцию приходит объект: `stage.title`, `stage.order` — с автокомплитом в IDE

Тот же контракт в Zod для сравнения:

```typescript
const StageCreate = z.object({
  title: z.string(),
  order: z.number().int(),
  description: z.string().nullable().default(null),
});
```

---

## 7. Модель ответа: `response_model`

```python
# app/schemas.py
class Roadmap(BaseModel):
    slug: str
    title: str
    description: str
```

```python
# app/routers/roadmaps.py
from app.schemas import Roadmap
from app.data import ROADMAPS

@app.get("/roadmaps", response_model=list[Roadmap])
def list_roadmaps():
    return ROADMAPS
```

Зачем указывать, если можно просто вернуть данные:

1. **Фильтрация полей.** Из ответа автоматически вырезается всё, чего нет в модели. Классический сценарий: внутренняя модель пользователя содержит `password_hash`, наружу отдаёшь `UserPublic` без этого поля. Утечка становится невозможной архитектурно, а не «если не забыл удалить».
2. **Контракт в документации.** В `/docs` виден точный формат ответа — когда будешь писать фронт devio, сам себе скажешь спасибо.
3. **Гарантия формы.** Вернёшь данные не той структуры — получишь ошибку сервера сразу, при разработке, а не загадочный `undefined` на фронте через неделю.

Мок-данные, на которые ссылается пример:

```python
# app/data.py
ROADMAPS = [
    {"slug": "frontend", "title": "Frontend", "description": "Путь фронтенд-разработчика"},
    {"slug": "backend", "title": "Backend", "description": "Путь бэкенд-разработчика"},
]
```

Обрати внимание: возвращаются обычные dict'ы, а `response_model` сам провалидирует и приведёт их к форме `Roadmap`.

---

## 8. Ошибки: HTTPException

```python
# app/routers/roadmaps.py
from fastapi import HTTPException

@app.get("/roadmaps/{slug}", response_model=Roadmap)
def get_roadmap(slug: str):
    roadmap = next((r for r in ROADMAPS if r["slug"] == slug), None)
    if roadmap is None:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap
```

Разбор:

- `raise` — это `throw` из JS. Исключение прерывает выполнение функции.
- FastAPI перехватывает `HTTPException` и превращает в HTTP-ответ: статус из `status_code`, тело `{"detail": "Roadmap not found"}`.
- `next((r for r in ... if ...), None)` — идиома «найти первый подходящий или None», аналог `roadmaps.find(r => r.slug === slug)` в JS. Синтаксис внутри — генераторное выражение, познакомишься с ним быстро.

**Как не надо:** возвращать `{"error": "not found"}` со статусом 200. HTTP-статус — часть контракта: TanStack Query на фронте определяет успех/ошибку именно по статусу, и «ошибка внутри успешного ответа» ломает всю обработку ошибок.

---

## 9. Роутеры: раскладываем по файлам

`APIRouter` — «мини-приложение», которое потом подключается к основному. Аналог `express.Router()`.

```python
# app/routers/roadmaps.py — полная версия файла
from fastapi import APIRouter, HTTPException
from app.schemas import Roadmap
from app.data import ROADMAPS

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])

@router.get("/", response_model=list[Roadmap])
def list_roadmaps():
    return ROADMAPS

@router.get("/{slug}", response_model=Roadmap)
def get_roadmap(slug: str):
    roadmap = next((r for r in ROADMAPS if r["slug"] == slug), None)
    if roadmap is None:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap
```

- `prefix="/roadmaps"` — все пути роутера получают префикс: `@router.get("/")` = `GET /roadmaps`, `@router.get("/{slug}")` = `GET /roadmaps/{slug}`
- `tags=["roadmaps"]` — группировка в Swagger: эндпоинты лягут в отдельную секцию
- Декораторы вешаются на `@router`, не на `@app`

Подключение:

```python
# app/main.py — полная версия файла
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import roadmaps

app = FastAPI(title="devio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roadmaps.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

**Про CORS:** без этого middleware браузер заблокирует запросы с `localhost:3000` (Next) на `localhost:8000` (FastAPI) — это защита самого браузера, а не фреймворка. `allow_origins` — белый список источников; на проде добавишь сюда домен devio.

---

## 10. `def` vs `async def`

FastAPI принимает оба варианта хендлеров, но обрабатывает по-разному:

```python
@router.get("/a")
def sync_handler(): ...          # выполняется в пуле потоков

@router.get("/b")
async def async_handler(): ...   # выполняется в event loop
```

- `async def` — работает в общем event loop, как всё в Node. Правило то же, что в Node, но жёстче: **нельзя звать блокирующий код** (`time.sleep`, библиотеку `requests`, синхронные драйверы БД). В Node блокирующий код в хендлере — редкость, в Python — сплошь и рядом, поэтому наступить на это легко.
- `def` — FastAPI прогоняет такие хендлеры в отдельном пуле потоков, блокирующие вызовы безопасны.

**Правило для старта:** пиши обычный `def`, переходи на `async def` только когда появится реальный `await` (async-драйвер БД, httpx-запросы). Худший вариант — `async def` с блокирующим кодом внутри: локально работает идеально, под нагрузкой сервер встаёт колом, потому что один медленный запрос блокирует event loop для всех.

---

## 11. Как не надо: типичные грабли

### Мутабельное значение по умолчанию

```python
def add_stage(stages: list = []):   # ❌
    stages.append("x")
    return stages
```

Дефолт создаётся **один раз** — в момент определения функции — и один и тот же список шарится между всеми вызовами. Первый вызов вернёт `["x"]`, второй — `["x", "x"]`. В JS дефолты вычисляются на каждый вызов, поэтому эта ловушка для тебя новая. Правильно:

```python
def add_stage(stages: list | None = None):   # ✅
    if stages is None:
        stages = []
    ...
```

Важно: в Pydantic-моделях (`stages: list[str] = []`) это **безопасно** — Pydantic создаёт новый список для каждого экземпляра. Ловушка касается только обычных функций.

### Ручная валидация того, что умеет фреймворк

```python
@router.get("/{item_id}")
def get_item(item_id: str):                     # ❌
    if not item_id.isdigit():
        raise HTTPException(400, "must be int")

@router.get("/{item_id}")
def get_item(item_id: int): ...                 # ✅ то же самое, одной аннотацией
```

Если пишешь `if`-проверку типа или формата — остановись и спроси: «а не выражается ли это типом?». В 90% случаев выражается.

### Возврат ошибок со статусом 200

Уже разбирали в разделе 8: ошибка — это `raise HTTPException(...)`, а не `return {"error": ...}`.

### .venv в git

Окружение весит сотни мегабайт и специфично для машины. В `.gitignore` первым делом:

```
.venv/
__pycache__/
```

`requirements.txt` — вот что коммитится; по нему окружение восстанавливается на любой машине.

### Игнорировать /docs

Swagger — главный инструмент обратной связи. Цикл разработки: написал эндпоинт → открыл `/docs` → потыкал → посмотрел схемы. Если схема выглядит не так, как ожидал — типы описаны криво. Это твой «TypeScript compiler error», только визуальный.

---

## Резюме

Эндпоинт FastAPI = функция, где **сигнатура является контрактом**:

- path-параметры → аргументы, чьи имена есть в пути
- query-параметры → остальные аргументы-примитивы
- тело запроса → аргумент типа Pydantic-модели
- форма ответа → `response_model`
- ошибки → `raise HTTPException`

Фреймворк по контракту делает парсинг, валидацию, ошибки 422 и документацию. Твой код — только логика.

**Следующие темы** (в порядке надобности для devio):
1. `Depends` — внедрение зависимостей (фундамент для БД-сессий и авторизации)
2. Подключение базы данных
3. Настройки через переменные окружения (`pydantic-settings`)
4. Тесты через `TestClient`
