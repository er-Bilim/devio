from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import StageProgress


async def get_progress(
    db: AsyncSession, user_id, stage_id: int
) -> StageProgress | None:
    stmt = select(StageProgress).where(
        StageProgress.user_id == user_id, StageProgress.stage_id == stage_id
    )

    result = await db.execute(stmt)
    return result.scalar_one_or_none()