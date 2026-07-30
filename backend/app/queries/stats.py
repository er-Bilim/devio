from datetime import datetime, timedelta, timezone

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


async def top_stages(db: AsyncSession, day: int = 30, limit=5):
    since = datetime.now(timezone.utc) - timedelta(day)

    stmt = (
        select(Roadmap.slug, Stage.title, func.count().label("completions"))
        .join(Stage, StageProgress.stage_id == Stage.id)
        .join(Roadmap, Stage.roadmap_id == Roadmap.id)
        .where(StageProgress.completed_at <= since)
        .group_by(Roadmap.slug, Stage.title)
        .order_by(func.count().desc())
        .limit(limit)
    )

    result = await db.execute(stmt)
    return result.all()
