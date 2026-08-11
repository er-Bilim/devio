from datetime import datetime, timedelta, timezone

from sqlalchemy import INTEGER, func, select
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


async def top_stages(db: AsyncSession, day: int = 30, limit=5):
    since = datetime.now(timezone.utc) - timedelta(days=day)

    stmt = (
        select(Roadmap.slug, Stage.title, func.count().label("completions"))
        .select_from(StageProgress)
        .join(Stage, StageProgress.stage_id == Stage.id)
        .join(Roadmap, Stage.roadmap_id == Roadmap.id)
        .where(StageProgress.completed_at >= since)
        .group_by(Roadmap.slug, Stage.title)
        .order_by(func.count().desc())
        .limit(limit)
    )

    result = await db.execute(stmt)
    return result.all()


async def current_streak(db: AsyncSession, user_id):
    day = func.date(StageProgress.completed_at).label("day")
    stmt = (
        select(day)
        .where(StageProgress.user_id == user_id)
        .group_by(func.date(StageProgress.completed_at))
        .order_by(day.desc())
    )
    result = await db.execute(stmt)
    days = [row.day for row in result.all()]

    if not days:
        return 0

    today = datetime.now(timezone.utc).date()

    if days[0] not in (today, today - timedelta(days=1)):
        return 0

    streak = 1
    for prev, cur in zip(days, days[1:]):  # noqa:B905 - пары соседей, длины различаются намеренно
        if prev - cur == timedelta(days=1):
            streak += 1
        else:
            break
    return streak


async def longest_streak(db: AsyncSession, user_id) -> int:
    day = func.date(StageProgress.completed_at).label("day")
    days_cte = (
        select(day).where(StageProgress.user_id == user_id).group_by(day).cte("days")
    )
    rn = func.row_number().over(order_by=days_cte.c.day).label("rn")
    numbered = select(days_cte.c.day, rn).cte("numbered")

    group_key = (numbered.c.day - func.cast(numbered.c.rn, INTEGER)).label("grp")
    lengths = (
        select(func.count().label("length"))
        .select_from(numbered)
        .group_by(group_key)
        .cte("length")
    )
    stmt = select(func.max(lengths.c.length))
    result = await db.execute(stmt)

    return result.scalar() or 0
