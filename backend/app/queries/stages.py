from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Stage


async def all_stages(db: AsyncSession):
    result = await db.execute(select(Stage))
    stages = result.scalars().all()
    return stages


async def single_stage(db: AsyncSession, id: int):
    result = await db.execute(select(Stage).where(Stage.id == id))

    stage = result.scalar_one_or_none()
    return stage
