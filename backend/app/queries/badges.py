from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Badge, User, UserBadge


async def get_all_badges(db: AsyncSession):
    stmt = select(Badge).order_by(Badge.sort_order.desc())

    result = await db.execute(stmt)
    return result.scalars().all()


async def get_badge_by_code(db: AsyncSession, code: str):
    result = await db.execute(select(Badge).where(Badge.code == code))
    return result.scalar_one_or_none()


async def get_user_badges(db: AsyncSession, id: UUID):
    result = await db.execute(
        select(UserBadge)
        .where(UserBadge.user_id == id)
        .options(selectinload(User.badges).selectinload(UserBadge.badge))
    )

    return result.scalar_one_or_none()
