# SQL для фич devio: агрегации, JOIN, стрик

Восьмая часть справочника — и первая, где мы не подключаем инструмент, а решаем задачи продукта: **статистика популярности** для главной страницы и **стрик** для профиля. По пути — главные концепции SQL, ради которых выбирался Postgres.

Данные, с которыми работаем (всё уже в базе):

```
roadmaps (id, slug, title)
stages (id, roadmap_id → roadmaps, title, position)
stage_progress (id, user_id → users, stage_id → stages, completed_at)
```

Решение зафиксировано: **день активности = день, когда завершён хотя бы один этап** — то есть стрик целиком считается из `stage_progress.completed_at`.

---

## 0. Структура: слой запросов

Статистические запросы длинные. Класть их в роутеры — значит утопить HTTP-логику в SQL. Заводим слой:

```
backend/
├── app/
│   ├── queries/
│   │   ├── __init__.py
│   │   └── stats.py          # ← НОВЫЙ: функции-запросы статистики
│   ├── routers/
│   │   └── stats.py          # ← НОВЫЙ: тонкие эндпоинты, зовущие queries
│   └── schemas.py            # + схемы ответов статистики
```

Правило разделения: **`queries/` знает про SQL и ничего про HTTP; `routers/` знает про HTTP и ничего про SQL.** Роутер вызывает функцию, отдаёт результат в response_model — всё. Выгоды почувствуешь быстро: запрос переиспользуется (тот же подсчёт учеников нужен и карточкам направлений, и админке), тестируется без HTTP, а роутеры остаются читаемыми.

---

## 1. Смена мышления: строки → множества

Всё, что ты писал до сих пор, было **строчным** мышлением: «дай мне эти строки» (`select(User).where(...)` → объекты). Статистика требует **множественного**: «посчитай ПО строкам и дай мне итог».

Ключевой принцип: **считает база, к тебе едет только ответ.**

```python
# ❌ строчное мышление, натянутое на задачу подсчёта:
result = await db.execute(select(StageProgress))
count = len(result.scalars().all())        # приехали ВСЕ строки, посчитал Python

# ✅ множественное мышление:
result = await db.execute(select(func.count()).select_from(StageProgress))
count = result.scalar_one()                # приехало ОДНО число
```

Разница не стилистическая. В первом варианте при 100 000 прохождений по сети едет 100 000 строк, Python строит 100 000 объектов — чтобы выбросить их после `len()`. Во втором Postgres пробегает индекс и присылает восемь байт. База — это движок обработки данных, а не склад; всё, что можно посчитать в ней, считается в ней.

Что уезжает в базу во втором случае:

```sql
SELECT count(*) FROM stage_progress;
```

```
 count
-------
   137
(1 row)
```

Одна строка, одно число — вот и весь трафик.

- `func.count()` — SQL-функция `COUNT(*)`: «сколько строк». `func.имя` — общий механизм вызова любых SQL-функций (ты уже видел `func.now()`)
- `.select_from(...)` — из какой таблицы, когда в `select()` нет колонок, по которым это можно понять
- `.scalar_one()` — распаковка «ровно одно скалярное значение» (родня знакомого `scalar_one_or_none`)

## 2. GROUP BY: корзины

`COUNT` по всей таблице — «сколько всего». Продукту нужно «сколько **у каждого**»: учеников у каждого направления, прохождений у каждого этапа. Это `GROUP BY`.

Ментальная модель: `GROUP BY x` раскладывает строки по корзинам с одинаковым `x`, затем **каждая корзина схлопывается в одну строку**, а агрегатные функции (`count`, `max`, `min`, `sum`, `avg`) вычисляются внутри корзины.

```python
# сколько прохождений у каждого этапа
stmt = (
    select(StageProgress.stage_id, func.count().label("completions"))
    .group_by(StageProgress.stage_id)
)
```

Порождаемый SQL (включи `echo=True` и сверься глазами — лучший способ учить SQL через SQLAlchemy):

```sql
SELECT stage_id, count(*) AS completions
FROM stage_progress
GROUP BY stage_id
```

Два новых элемента:

- **`.label("completions")`** — имя вычисляемой колонки (SQL `AS`). По нему значение достаётся из результата
- **Железное правило GROUP BY**: в `select()` могут стоять только (а) колонки из `group_by` и (б) агрегаты. Попросишь «негруппировочную» колонку — Postgres откажет: у корзины со 100 строками нет одного `completed_at`, их сто. JS-параллель для интуиции: это `Object.groupBy(rows, r => r.stage_id)` + `map` по группам с редьюсом — только исполняется в базе за один проход

Посмотри на живых данных, что происходит. Было в таблице:

```
 id | user_id | stage_id |     completed_at
----+---------+----------+---------------------
  1 | donk    |        1 | 2026-07-10 09:00
  2 | monesy  |        1 | 2026-07-10 11:00
  3 | donk    |        2 | 2026-07-11 09:00
  4 | monesy  |        1 | 2026-07-12 20:00
  5 | donk    |        3 | 2026-07-12 21:00
```

Стало после `GROUP BY stage_id`:

```
 stage_id | completions
----------+-------------
        1 |           3     ← корзина из строк 1, 2, 4
        2 |           1     ← корзина из строки 3
        3 |           1     ← корзина из строки 5
```

Пять строк схлопнулись в три — по числу уникальных `stage_id`. Вот почему `completed_at` в select нельзя: какой из трёх таймстампов первой корзины должен там оказаться? Вопрос без ответа — поэтому база и запрещает. А спросить агрегат от него можно: `func.max(StageProgress.completed_at)` → `MAX(completed_at)` вернёт «последнее прохождение в корзине», это уже однозначно.

Результат такого запроса — не ORM-объекты, а **строки-кортежи** с атрибутами по именам:

```python
result = await db.execute(stmt)
for row in result.all():
    row.stage_id, row.completions      # доступ по имени колонки/label
```

## 3. JOIN: склеиваем таблицы

`stage_id` в результате — это id, а продукту нужны названия и разбивка по направлениям. Названия живут в других таблицах — их подключает `JOIN`: «совмести строки двух таблиц по условию».

```python
stmt = (
    select(Roadmap.slug, Stage.title, func.count().label("completions"))
    .join(Stage, Stage.roadmap_id == Roadmap.id)
    .join(StageProgress, StageProgress.stage_id == Stage.id)
    .group_by(Roadmap.slug, Stage.title)
)
```

```sql
SELECT roadmaps.slug, stages.title, count(*) AS completions
FROM roadmaps
JOIN stages ON stages.roadmap_id = roadmaps.id
JOIN stage_progress ON stage_progress.stage_id = stages.id
GROUP BY roadmaps.slug, stages.title
```

Как это читать: возьми роадмапы → к каждому пристыкуй его этапы (условие — FK) → к каждому этапу пристыкуй его прохождения → получившуюся «широкую» таблицу разложи по корзинам (slug, title) → посчитай корзины. Твои `ForeignKey` из моделей — это и есть рельсы, по которым ездят JOIN'ы.

Что значит «широкая таблица» — посмотри на промежуточный результат **до** группировки (выполни тот же запрос без `group_by` и с `select(Roadmap.slug, Stage.title, StageProgress.completed_at)`):

```
  slug    |  title  |   completed_at
----------+---------+------------------
 frontend | HTML    | 2026-07-10 09:00     ┐
 frontend | HTML    | 2026-07-10 11:00     ├ склеенные строки: данные из ТРЁХ таблиц
 frontend | HTML    | 2026-07-12 20:00     ┘ рядом в одной строке
 frontend | CSS     | 2026-07-11 09:00
 backend  | Python  | 2026-07-12 21:00
```

JOIN не «добавляет колонки к таблице» — он порождает новые строки: каждое прохождение вытянуло к себе данные своего этапа и своего направления. Дальше `GROUP BY slug, title` схлопывает это в:

```
  slug    |  title  | completions
----------+---------+-------------
 frontend | HTML    |           3
 frontend | CSS     |           1
 backend  | Python  |           1
```

**Важное свойство обычного (INNER) JOIN: строки без пары исчезают.** Этап, который никто не прошёл, не имеет пары в `stage_progress` — и выпадает из результата целиком. Для «топа этапов» это нормально. Для карточек направлений — баг: новое направление с нулём учеников должно показывать 0, а не исчезать с главной. Решение — LEFT JOIN, сейчас увидишь его в бою.

> `JOIN` из этого раздела и `selectinload` из доки по БД — разные инструменты: `selectinload` грузит **объекты** со связями (для отдачи в response_model), `join` строит **плоскую таблицу для вычислений**. Статистика — всегда второй случай.

## 4. Фича: популярность направлений

Задача с главной страницы: «сколько людей изучают каждое направление», по убыванию. «Изучает» = завершил хотя бы один этап направления.

```python
# app/queries/stats.py
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Roadmap, Stage, StageProgress

async def directions_popularity(db: AsyncSession):
    learners = func.count(func.distinct(StageProgress.user_id)).label("learners")
    stmt = (
        select(Roadmap.slug, Roadmap.title, learners)
        .join(Stage, Stage.roadmap_id == Roadmap.id, isouter=True)
        .join(StageProgress, StageProgress.stage_id == Stage.id, isouter=True)
        .group_by(Roadmap.id, Roadmap.slug, Roadmap.title)
        .order_by(learners.desc())
    )
    result = await db.execute(stmt)
    return result.all()
```

Порождаемый SQL:

```sql
SELECT roadmaps.slug,
       roadmaps.title,
       count(DISTINCT stage_progress.user_id) AS learners
FROM roadmaps
LEFT OUTER JOIN stages ON stages.roadmap_id = roadmaps.id
LEFT OUTER JOIN stage_progress ON stage_progress.stage_id = stages.id
GROUP BY roadmaps.id, roadmaps.slug, roadmaps.title
ORDER BY learners DESC;
```

```
   slug   |  title   | learners
----------+----------+----------
 frontend | Frontend |        2
 backend  | Backend  |        1
 devops   | DevOps   |        0     ← остался в выдаче благодаря LEFT JOIN
```

Три решения, каждое — ответ на конкретный подводный камень:

**`func.distinct(user_id)` — считаем людей, а не прохождения.** Юзер, завершивший 5 этапов Frontend, — это один ученик Frontend, а `count()` без distinct насчитал бы его пять раз. `COUNT(DISTINCT user_id)` считает уникальных.

**`isouter=True` — это LEFT JOIN, лекарство из раздела 3.** Направление без единого прохождения не выпадает: LEFT JOIN сохраняет строку левой таблицы, заполняя «пару» NULL-ами.

**И тонкость, ради которой count берётся именно от `user_id`, а не `count()`:** у направления без учеников после LEFT JOIN есть одна строка с NULL-ами. `COUNT(*)` посчитал бы её как 1 (считает строки!), а `COUNT(user_id)` NULL-ы пропускает → честный 0. Правило: **`COUNT(*)` — «сколько строк», `COUNT(колонка)` — «сколько не-NULL значений»**; с LEFT JOIN почти всегда нужен второй.

Обвязка — схема и тонкий роутер:

```python
# app/schemas.py — добавить
class DirectionStat(BaseModel):
    model_config = ConfigDict(from_attributes=True)   # строки Row тоже читаются по атрибутам

    slug: str
    title: str
    learners: int
```

```python
# app/routers/stats.py
from fastapi import APIRouter

from app.dependencies import DbSession
from app.queries import stats
from app.schemas import DirectionStat

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/directions", response_model=list[DirectionStat])
async def get_directions_popularity(db: DbSession):
    return await stats.directions_popularity(db)
```

Не забудь `app.include_router(stats.router)` в `main.py`. Эндпоинт публичный — статистика видна и незалогиненным, это витрина.

**Проверка руками:** прогони через psql сырой SQL из echo, поменяй руками данные (`INSERT INTO stage_progress ...` за второго юзера), посмотри, как меняется счёт. Двадцать минут такой игры дадут больше интуиции про GROUP BY, чем любой текст.

## 5. Фича: топ этапов

«Какие этапы проходят чаще всего за последние 30 дней» — тот же конструктор, новая деталь — фильтр по времени:

```python
# app/queries/stats.py — добавить
from datetime import datetime, timedelta, timezone

async def top_stages(db: AsyncSession, days: int = 30, limit: int = 5):
    since = datetime.now(timezone.utc) - timedelta(days=days)
    stmt = (
        select(Roadmap.slug, Stage.title, func.count().label("completions"))
        .join(Stage, StageProgress.stage_id == Stage.id)
        .join(Roadmap, Stage.roadmap_id == Roadmap.id)
        .where(StageProgress.completed_at >= since)
        .group_by(Roadmap.slug, Stage.title)
        .order_by(func.count().desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.all()
```

```sql
SELECT roadmaps.slug, stages.title, count(*) AS completions
FROM stage_progress
JOIN stages ON stage_progress.stage_id = stages.id
JOIN roadmaps ON stages.roadmap_id = roadmaps.id
WHERE stage_progress.completed_at >= $1        -- since, параметр (не подстановка строкой!)
GROUP BY roadmaps.slug, stages.title
ORDER BY count(*) DESC
LIMIT 5;
```

```
   slug   | title  | completions
----------+--------+-------------
 frontend | HTML   |          42
 frontend | CSS    |          31
 backend  | Python |          19
```

Порядок частей запроса, который стоит запомнить как скелет любой аналитики: **что выбрать → как склеить (join) → что отфильтровать (where) → как сгруппировать → как отсортировать → сколько отдать.** Заметь, `where` фильтрует строки *до* группировки — отсечь старые прохождения нужно раньше, чем считать корзины. (Есть ещё `HAVING` — фильтр *после* группировки, «покажи только этапы с 10+ прохождениями»: `.having(func.count() >= 10)` → SQL `HAVING count(*) >= 10`. Пока не нужен, но знай, что он существует и чем отличается.)

Сравнение с `since` работает благодаря твоей миграции timezone-aware колонок — та ошибка asyncpg стрельнула бы ровно здесь.

## 6. Фича: стрик

Самая интересная задача. Дано: моменты `completed_at` юзера. Найти: сколько **дней подряд**, заканчивая сегодня (или вчера), у юзера есть активность.

### Шаг 1: моменты → дни

Стрик считается по дням, а в базе — таймстампы. Схлопываем: несколько прохождений в один день = один день активности:

```python
day = func.date(StageProgress.completed_at).label("day")
stmt = (
    select(day)
    .where(StageProgress.user_id == user_id)
    .group_by(day)                # несколько прохождений в день → одна строка
    .order_by(day.desc())
)
```

```sql
SELECT date(completed_at) AS day
FROM stage_progress
WHERE user_id = $1
GROUP BY date(completed_at)
ORDER BY day DESC;
```

Что делает на данных — те же пять прохождений юзера donk, где 10 и 12 июля по два:

```
   completed_at            →        day
---------------------              ------------
 2026-07-10 09:00  ┐               2026-07-13
 2026-07-10 21:00  ┘ →             2026-07-12
 2026-07-11 09:00    →             2026-07-11
 2026-07-12 20:00  ┐               2026-07-10
 2026-07-12 23:00  ┘ →
```

Семь таймстампов схлопнулись в четыре дня активности — дальше стрик считается уже по ним.

**Timezone-решение, прими его осознанно:** `func.date` от timestamptz режет сутки по таймзоне сервера БД (у нас UTC). То есть «день» в стрике — календарный день UTC. Для старта это правильный компромисс: просто и предсказуемо. Честные «сутки юзера» требуют хранить его таймзону и резать через `func.timezone('Asia/Bishkek', ...)` — оставь TODO на пост-MVP, но реши это *сознательно*, а не по умолчанию: жалоба «я занимался в 23:50, а стрик сгорел» — это ровно отсюда.

### Шаг 2: дни → текущий стрик (Python, и это осознанно)

```python
# app/queries/stats.py — добавить
from datetime import date, timedelta

async def current_streak(db: AsyncSession, user_id) -> int:
    day = func.date(StageProgress.completed_at).label("day")
    stmt = (
        select(day)
        .where(StageProgress.user_id == user_id)
        .group_by(day)
        .order_by(day.desc())
    )
    result = await db.execute(stmt)
    days = [row.day for row in result.all()]

    if not days:
        return 0

    today = datetime.now(timezone.utc).date()
    # стрик жив, если последняя активность сегодня или вчера
    # (вчерашняя активность = стрик ещё не сгорел, юзер может продлить его сегодня)
    if days[0] not in (today, today - timedelta(days=1)):
        return 0

    streak = 1
    for prev, cur in zip(days, days[1:]):     # пары соседних дней: (d0,d1), (d1,d2)...
        if prev - cur == timedelta(days=1):   # день ровно на 1 раньше → цепь продолжается
            streak += 1
        else:
            break                             # разрыв → стрик закончился
    return streak
```

Прогон на данных (сегодня 13 июля), чтобы цикл стал очевидным:

```
days (уже отсортированы по убыванию):
  [13 июл, 12 июл, 11 июл, 10 июл, 7 июл, 6 июл]

days[0] = 13 июл = сегодня  → стрик жив, идём считать. streak = 1
  13 - 12 = 1 день → цепь                          streak = 2
  12 - 11 = 1 день → цепь                          streak = 3
  11 - 10 = 1 день → цепь                          streak = 4
  10 -  7 = 3 дня  → РАЗРЫВ, break

результат: 4
```

Про 6 и 7 июля цикл даже не узнает — они за разрывом, это уже прошлая серия (её длину найдёт `longest_streak` из шага 3).

Стоп — а как же «считает база, а не Python» из раздела 1? Здесь принцип **не нарушен**, и важно понять почему: тяжёлую работу (схлопывание тысяч прохождений в дни) сделала база через GROUP BY; в Python приехал уже агрегат — максимум 365 значений за год активности. Цикл по сотне дат — микросекунды. Правило из раздела 1 точнее формулируется так: *в Python нельзя тащить сырые строки; тащить маленький агрегат и доделать логику — нормальная инженерия*. Стрик-логика с её «сегодня или вчера» в Python банально читаемее.

### Шаг 3: рекордный стрик — выход оконных функций

Для «Мои рекорды» в профиле нужен **самый длинный** стрик за всю историю. В Python это цикл по всем дням; в SQL — классическая задача «gaps and islands», и решается она красиво:

```python
async def longest_streak(db: AsyncSession, user_id) -> int:
    day = func.date(StageProgress.completed_at).label("day")
    days_cte = (
        select(day)
        .where(StageProgress.user_id == user_id)
        .group_by(day)
        .cte("days")                                   # подзапрос с именем (SQL WITH)
    )
    rn = func.row_number().over(order_by=days_cte.c.day).label("rn")
    numbered = select(days_cte.c.day, rn).cte("numbered")

    # магия: день минус его номер = константа внутри непрерывной серии
    group_key = (numbered.c.day - func.cast(numbered.c.rn, INTEGER)).label("grp")
    stmt = (
        select(func.count().label("length"))
        .select_from(numbered)
        .group_by(group_key)
        .order_by(func.count().desc())
        .limit(1)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none() or 0
```

Полный SQL, который порождает этот код — прочитай его сверху вниз, слои читаются как шаги:

```sql
WITH days AS (
    SELECT date(completed_at) AS day
    FROM stage_progress
    WHERE user_id = $1
    GROUP BY date(completed_at)
),
numbered AS (
    SELECT day, row_number() OVER (ORDER BY day) AS rn
    FROM days
)
SELECT count(*) AS length
FROM numbered
GROUP BY day - CAST(rn AS INTEGER)
ORDER BY count(*) DESC
LIMIT 1;
```

Разбор магии на числах — почему «день минус номер» находит серии:

```
день        номер(rn)   день - rn
июл 1       1           июн 30  ┐
июл 2       2           июн 30  ├ серия из 3: у всех одна разность!
июл 3       3           июн 30  ┘
июл 7       4           июл 3   ┐
июл 8       5           июл 3   ┘ серия из 2
```

Внутри непрерывной серии и день, и номер растут на 1 за шаг — их разность **не меняется**. Разрыв в днях при непрерывной нумерации сдвигает разность — начинается новая группа. Дальше знакомое: GROUP BY по разности, count = длина серии, максимум — рекорд:

```
    grp    | length
-----------+--------
 июн 30    |      3     ← серия 1–3 июля
 июл 3     |      2     ← серия 7–8 июля
              ↓
        LIMIT 1 после ORDER BY length DESC → 3
```

Новые конструкции:
- **`func.row_number().over(order_by=...)`** — оконная функция: нумерует строки, **не схлопывая** их (в отличие от GROUP BY). `over()` и есть маркер «оконности» — вычисление «поверх» набора строк с сохранением каждой
- **`.cte("...")`** — именованный подзапрос (SQL `WITH ... AS`): собираем запрос слоями — дни → нумерация → группировка, каждый слой читается отдельно

Окна — целый мир (`lag`/`lead` — соседние строки, `rank`, скользящие суммы), и это самый мощный инструмент аналитики в SQL, которого в Mongo-мире нет в таком виде. Пока достаточно уметь читать `row_number().over()` — остальное доучится по мере задач.

### Обвязка

```python
# app/schemas.py — добавить
class StreakOut(BaseModel):
    current: int
    longest: int
```

```python
# app/routers/users.py — добавить
@router.get("/me/streak", response_model=StreakOut)
async def my_streak(current_user: CurrentUser, db: DbSession):
    return StreakOut(
        current=await stats.current_streak(db, current_user.id),
        longest=await stats.longest_streak(db, current_user.id),
    )
```

Защищённый эндпоинт — стрик личный. Заметь, роутер снова тонкий: две строки логики.

## 7. Как не надо

### Тащить строки ради подсчёта

```python
all_progress = (await db.execute(select(StageProgress))).scalars().all()   # ❌
learners = len({p.user_id for p in all_progress})
```

Раздел 1: сеть, память и время потрачены на то, что база делает одной строкой `COUNT(DISTINCT ...)`. Маркер проблемы: `len()`, `sum()`, сет-компрехеншены поверх результатов `select` без агрегатов.

### N+1 в статистике

```python
for roadmap in roadmaps:                                                   # ❌
    count = await db.execute(select(func.count())...where(roadmap_id == roadmap.id))
```

Запрос в цикле: 10 направлений — 11 запросов. В логах echo это выглядит так:

```sql
SELECT count(*) FROM stage_progress ... WHERE roadmap_id = 1;   -- ❌ и так 10 раз
SELECT count(*) FROM stage_progress ... WHERE roadmap_id = 2;
...
```

Один GROUP BY делает то же за один запрос. Маркер проблемы: `await db.execute` внутри `for`.

### COUNT(*) с LEFT JOIN

Разобрано в разделе 4, но повторю с числами — ошибка тихая и обидная:

```sql
-- ❌ с COUNT(*)                        -- ✅ с COUNT(user_id)
   slug   | learners                       slug   | learners
----------+----------                    ----------+----------
 devops   |        1   ← врёт!            devops   |        0
```

У направления без учеников после LEFT JOIN остаётся одна строка с NULL-ами: `COUNT(*)` считает строки и видит единицу, `COUNT(user_id)` считает не-NULL значения и честно даёт ноль. С LEFT JOIN — всегда считай конкретную колонку.

### Дни без учёта таймзоны «по умолчанию»

`func.date` режет сутки по таймзоне сервера. Мы выбрали UTC осознанно (раздел 6, шаг 1) — но выбор должен быть решением, а не случайностью.

### SQL строками с f-string

```python
await db.execute(text(f"... WHERE user_id = '{user_id}'"))                 # ❌ инъекция
```

Уже знакомо из доки по БД, но в аналитике соблазн «написать сырой SQL» выше — правило то же: конструктор `select()`, а сырой `text()` — только с параметрами.

---

## Резюме

- **Мышление**: строчное («дай строки») для CRUD, множественное («посчитай по строкам») для статистики. Считает база, к тебе едет агрегат
- **Скелет аналитического запроса**: select(колонки+агрегаты) → join → where → group_by → order_by → limit
- **GROUP BY** — корзины; в select только группировочное и агрегаты. **JOIN** — склейка по FK; INNER теряет строки без пары, LEFT (isouter=True) сохраняет. С LEFT JOIN — `COUNT(колонка)`, не `COUNT(*)`, и `DISTINCT` когда считаешь людей, а не события
- **Стрик**: моменты → дни (GROUP BY по `func.date`), текущий — коротким циклом в Python по агрегату (это законно), рекордный — gaps-and-islands через `row_number().over()`
- **Слой `queries/`**: SQL живёт отдельно от HTTP; роутеры тонкие

Порядок сборки: `queries/stats.py` с `directions_popularity` → роутер `/stats/directions` → проверить в psql на руками наполненных данных → `top_stages` → стрик (шаги 1–2–3) → `/users/me/streak`.

Когда заработает — у главной страницы и профиля есть настоящие данные, и следующий разговор — CRUD/сиды контента, чтобы статистике было что считать по-настоящему.
