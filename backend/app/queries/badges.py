from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Badge, UserBadge


async def get_all_badges(db: AsyncSession):
    stmt = select(Badge).order_by(Badge.sort_order.desc())

    result = await db.execute(stmt)
    return result.scalars().all()


async def get_badge_by_code(db: AsyncSession, code: str):
    result = await db.execute(select(Badge).where(Badge.code == code))
    return result.scalar_one_or_none()


async def get_user_badges(db: AsyncSession, id: UUID):
    result = await db.execute(
        select(Badge.code, UserBadge.earned_at)
        .join(UserBadge, Badge.id == UserBadge.badge_id)
        .where(UserBadge.user_id == id)
    )

    return result.all()
