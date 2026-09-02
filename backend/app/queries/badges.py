from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Badge


async def get_badge_by_code(db: AsyncSession, code: str):
    result = await db.execute(select(Badge).where(Badge.code == code))
    return result.scalar_one_or_none()
