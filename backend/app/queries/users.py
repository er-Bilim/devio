import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_by_username(db: AsyncSession, username: str) -> User | None:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    return await db.get(User, user_id)


async def create(
    db: AsyncSession, username: str, display_name: str, email: str, password_hash: str
) -> User:
    user = User(
        username=username,
        display_name=display_name,
        email=email,
        password_hash=password_hash,
    )
    db.add(user)

    await db.commit()
    await db.refresh(user)
    return user
