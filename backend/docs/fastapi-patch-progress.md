# PATCH и завершение этапа: частичное обновление и идемпотентность

Десятая часть справочника. Две темы, где легко наступить на грабли: **частичное обновление** (PATCH) и **отметка этапа пройденным** — центральное действие devio, от которого зависят прогресс и стрик.

---

## Часть 1. PATCH: частичное обновление

### Чем PATCH отличается от PUT

Разница в семантике, и её стоит понять один раз:

- **PUT** — «замени ресурс целиком». Клиент присылает **все** поля. Не прислал `description` — значит, его больше нет
- **PATCH** — «измени только то, что я прислал». Остальное не трогай

Для админки devio нужен PATCH: менять заголовок роадмапа, не пересылая каждый раз описание и slug.

### Схема: все поля опциональны

```python
# app/schemas.py
from pydantic import BaseModel


class RoadmapUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    description: str | None = None
```

Каждое поле с `= None`, потому что клиент может прислать любое подмножество. Схема на создание (`RoadmapCreate`) остаётся строгой — там поля обязательны. Это две разных схемы, и это правильно: у создания и обновления разные контракты.

### Главная ловушка: «не прислали» против «прислали null»

Смотри на два запроса:

```jsonc
// запрос А — меняем только заголовок
{ "title": "Frontend 2.0" }

// запрос Б — хотим стереть описание
{ "title": "Frontend 2.0", "description": null }
```

Если внутри просто пройтись по полям схемы, оба запроса выглядят **одинаково**: в обоих `description` равен `None`. В первом случае это «поля не было», во втором — «поле есть, и оно null». Наивный код затрёт описание в обоих случаях:

```python
# ❌ так делать нельзя
for field, value in data.model_dump().items():
    setattr(roadmap, field, value)      # description=None затрёт данные в запросе А
```

Лечится параметром `exclude_unset`:

```python
data.model_dump()                        # {'slug': None, 'title': 'Frontend 2.0', 'description': None}
data.model_dump(exclude_unset=True)      # {'title': 'Frontend 2.0'}   ← только то, что реально прислали
```

- **`model_dump()`** — превратить Pydantic-объект в обычный словарь
- **`exclude_unset=True`** — выкинуть поля, которых **не было в запросе**. Pydantic помнит, какие поля клиент прислал явно, а какие получили значение по умолчанию

Именно это отличие и решает задачу: в запросе А `description` не приходил → его нет в словаре → поле не трогаем. В запросе Б приходил со значением `null` → он в словаре → запишем `None`, то есть сотрём. Ровно то поведение, которого ждёт клиент.

> Родственные параметры, чтобы не путать: `exclude_none=True` выкидывает все None-значения (и «не прислали», и «прислали null» — то есть стереть поле станет невозможно), `exclude_defaults=True` выкидывает совпадающие со значением по умолчанию. Для PATCH нужен именно `exclude_unset`.

### Реализация по слоям

```python
# app/queries/roadmaps.py
async def get_by_id(db: AsyncSession, roadmap_id: int) -> Roadmap | None:
    return await db.get(Roadmap, roadmap_id)


async def update(db: AsyncSession, roadmap: Roadmap, fields: dict) -> Roadmap:
    for name, value in fields.items():
        setattr(roadmap, name, value)     # меняем атрибуты загруженного объекта
    await db.commit()
    await db.refresh(roadmap, attribute_names=["stages"])
    return roadmap
```

**`setattr(объект, "имя", значение)`** — присвоить атрибут, имя которого известно строкой. `setattr(roadmap, "title", "X")` = `roadmap.title = "X"`, просто имя берётся из переменной. Нужен потому, что заранее неизвестно, какие поля пришлют.

Как SQLAlchemy узнаёт об изменениях: объект, полученный из базы, **отслеживается сессией**. Меняешь его атрибуты — сессия помечает объект «грязным» и при `commit()` сама сгенерирует `UPDATE` только по изменённым колонкам. Никакого явного «сохрани» звать не нужно.

```python
# app/routers/roadmaps.py
@router.patch("/{roadmap_id}", response_model=RoadmapOut,
              dependencies=[Depends(get_current_admin)])
async def update_roadmap(roadmap_id: int, data: RoadmapUpdate, db: DbSession):
    roadmap = await roadmaps_q.get_by_id(db, roadmap_id)
    if roadmap is None:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    fields = data.model_dump(exclude_unset=True)
    if not fields:
        return roadmap                    # прислали пустое тело — менять нечего

    return await roadmaps_q.update(db, roadmap, fields)
```

### Что ещё стоит предусмотреть

**Конфликт уникальности.** `slug` у роадмапов уникален. Если админ переименует slug в уже занятый, база бросит `IntegrityError` и клиент получит 500. Правильнее — проверить заранее и вернуть 409:

```python
if "slug" in fields:
    existing = await roadmaps_q.get_by_slug(db, fields["slug"])
    if existing is not None and existing.id != roadmap.id:
        raise HTTPException(status_code=409, detail="Slug already taken")
```

Условие `existing.id != roadmap.id` важно: если админ «меняет» slug на тот же самый, это не конфликт.

**Пустое тело.** `PATCH` с `{}` — не ошибка, просто нечего делать. Вернуть объект как есть (как в примере) — нормальное поведение.

---

## Часть 2. POST /stages/{id}/complete

Центральное действие продукта: юзер отмечает этап пройденным. Отсюда растут прогресс, «текущая станция» и стрик.

### Почему это не обычный POST

Задача выглядит на три строки — добавить запись в `stage_progress`. Но есть вопросы, которые надо решить осознанно:

1. Что если этапа с таким id не существует?
2. Что если юзер нажал кнопку дважды?
3. Что вернуть фронту?
4. Что если два запроса прилетели одновременно?

### Идемпотентность: повторное завершение

**Идемпотентность** — свойство операции давать одинаковый результат при повторе. Нажал «завершить» пять раз — состояние такое же, как после одного нажатия.

Для devio это обязательно: дабл-клик, повторная отправка при плохой сети, кнопка «назад» в браузере. Без защиты в `stage_progress` появятся дубли, и статистика поедет — тот же `count(*)` в топе этапов начнёт считать один этап несколько раз у одного юзера.

Решение — проверить перед вставкой:

```python
# app/queries/progress.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import StageProgress


async def get_progress(db: AsyncSession, user_id, stage_id: int) -> StageProgress | None:
    result = await db.execute(
        select(StageProgress).where(
            StageProgress.user_id == user_id,
            StageProgress.stage_id == stage_id,
        )
    )
    return result.scalar_one_or_none()
```

Обрати внимание: два условия перечислены **через запятую** — это то же самое, что `AND` в SQL. Можно и `.where(...).where(...)` — эквивалентно.

### Защита на уровне базы — важнее проверки в коде

Проверка `if уже есть` оставляет узкое окно: два одновременных запроса могут оба её пройти и оба вставить запись. Настоящая гарантия — **ограничение уникальности** в самой базе:

```python
# app/models.py
from sqlalchemy import UniqueConstraint


class StageProgress(Base):
    __tablename__ = "stage_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "stage_id", name="uq_user_stage"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    stage_id: Mapped[int] = mapped_column(ForeignKey("stages.id"))
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
```

- **`__table_args__`** — кортеж дополнительных настроек таблицы (ограничения, индексы). Обрати внимание на запятую в конце: `(UniqueConstraint(...),)` — без неё это не кортеж, а просто скобки, и SQLAlchemy ругнётся
- **`UniqueConstraint("user_id", "stage_id")`** — составная уникальность: пара значений не может повториться. Один юзер — один этап — одна запись. Физически

Нужна миграция: `alembic revision --autogenerate -m "unique user stage progress"` → прочитать глазами → `upgrade head`. Если в базе уже есть дубли (а они могли появиться при ручных INSERT-ах для тестов), миграция упадёт — сначала почисти:

```sql
DELETE FROM stage_progress a USING stage_progress b
WHERE a.id > b.id AND a.user_id = b.user_id AND a.stage_id = b.stage_id;
```

Это тот же приём, что с `unique=True` на email: проверка в коде даёт понятную ошибку в 99.9% случаев, а constraint страхует оставшуюся долю. **Дисциплина в коде, гарантия в базе.**

### Сервис: сценарий целиком

```python
# app/services/progress.py
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import StageProgress, User
from app.queries import progress as progress_q
from app.queries import stages as stages_q


async def complete_stage(db: AsyncSession, user: User, stage_id: int) -> StageProgress:
    stage = await stages_q.get_by_id(db, stage_id)
    if stage is None:
        raise HTTPException(status_code=404, detail="Stage not found")

    existing = await progress_q.get_progress(db, user.id, stage_id)
    if existing is not None:
        return existing                    # уже пройден — просто отдаём как есть

    entry = StageProgress(user_id=user.id, stage_id=stage_id)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry
```

Разбор решений:

**Этап не найден → 404.** Проверять обязательно: без этого `FOREIGN KEY` бросит `IntegrityError` и клиент получит невнятный 500 вместо понятного «такого этапа нет».

**Повтор → возвращаем существующую запись, а не ошибку.** Могло бы быть и 409 «уже пройден», но для UI это неудобно: юзер нажал кнопку, получил ошибку — а этап-то пройден, всё в порядке. Тихо вернуть текущее состояние честнее и приятнее. Это и есть идемпотентность на практике.

**Дату не передаём** — `completed_at` заполнит база через `server_default=func.now()`.

### Роутер

```python
# app/routers/stages.py
@router.post("/{stage_id}/complete", response_model=ProgressOut, status_code=201)
async def complete_stage(stage_id: int, db: DbSession, current_user: CurrentUser):
    return await progress_service.complete_stage(db, current_user, stage_id)
```

```python
# app/schemas.py
class ProgressOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    stage_id: int
    completed_at: datetime
```

**Про 201 при повторе.** Формально при возврате существующей записи правильнее 200 («ничего не создано»), а при первой отметке — 201. Если хочется точности, роутер может решать это сам:

```python
@router.post("/{stage_id}/complete", response_model=ProgressOut)
async def complete_stage(stage_id: int, response: Response, db: DbSession,
                         current_user: CurrentUser):
    entry, created = await progress_service.complete_stage(db, current_user, stage_id)
    response.status_code = 201 if created else 200
    return entry
```

Тогда сервис возвращает пару `(запись, создана_ли)`. Для devio сойдёт и простой вариант с фиксированным 201 — выбирай сам, но осознанно.

### Что полезно вернуть фронту

Голая запись прогресса — минимум. Но подумай, что реально нужно интерфейсу после нажатия кнопки: обновить прогресс-бар направления, подсветить следующую станцию, показать «стрик 8 дней 🔥». Каждое из этих значений — отдельный запрос с фронта, если не вернуть их сразу.

Вариант побогаче:

```python
class CompleteStageOut(BaseModel):
    stage_id: int
    completed_at: datetime
    roadmap_progress: str      # "5/6"
    streak: int                # текущий стрик — уже посчитан в queries/stats.py
    next_stage_id: int | None  # следующая станция или None, если ветка пройдена
```

Это экономит фронту два-три запроса на каждое нажатие. Не обязательно делать сразу — но заложи в голову, когда дойдёшь до стыковки с фронтом.

### Обратное действие

Логично добавить парный эндпоинт — «снять отметку»:

```python
@router.delete("/{stage_id}/complete", status_code=204)
```

Тот же принцип идемпотентности: записи нет — всё равно 204, цель достигнута. Нужен ли он в devio — продуктовое решение (может, пройденный этап не должен отменяться), но если делаешь UI с чекбоксами, без него не обойтись.

---

## Как не надо

### PATCH без exclude_unset

Главная ошибка этой доки: `model_dump()` без параметра затрёт неприсланные поля в `null`. Симптом: админ поменял заголовок — исчезло описание.

### Одна схема на create и update

Соблазн переиспользовать `RoadmapCreate` для PATCH велик, но контракты разные: при создании поля обязательны, при обновлении — нет. Две схемы, `RoadmapCreate` и `RoadmapUpdate`.

### Идемпотентность «на честном слове»

Проверка `if existing` без `UniqueConstraint` — защита от повторов, но не от гонки. Оба механизма нужны вместе.

### Ловить дубли постфактум

Чистить дубликаты скриптом раз в неделю — лечение симптома. Ограничение в базе делает их невозможными.

### Позволять отмечать чужой прогресс

`user_id` берётся **только** из `CurrentUser`, никогда из тела запроса или query-параметра. Иначе любой сможет накрутить прогресс другому юзеру. То же правило, что «не доверяй фронту» из auth-доки.

---

## Резюме

**PATCH:**
- отдельная схема, все поля `| None = None`
- `model_dump(exclude_unset=True)` — единственный способ отличить «не прислали» от «прислали null»
- `setattr` в цикле + `commit`; SQLAlchemy сама сгенерирует UPDATE по изменённым полям
- проверка уникальности перед сохранением → 409 вместо 500

**Завершение этапа:**
- проверить существование этапа → 404
- повтор возвращает существующую запись, а не ошибку (идемпотентность)
- `UniqueConstraint("user_id", "stage_id")` + миграция — гарантия против гонки
- `user_id` только из токена
- подумать, что вернуть фронту: прогресс, стрик, следующая станция

Порядок сборки: схема `RoadmapUpdate` → PATCH-эндпоинт → `UniqueConstraint` + миграция → `queries/progress.py` → `services/progress.py` → эндпоинт complete → проверить двойным нажатием в `/docs`, что дубля не появилось.
