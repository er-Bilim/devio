from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import RefreshToken
from app.security import hash_refresh_token


async def get_by_token(db: AsyncSession, raw_token: str) -> RefreshToken | None:
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == hash_refresh_token(raw_token)
        )
    )

    return result.scalar_one_or_none()


async def store(db: AsyncSession, raw_token: str, user_id) -> None:
    db.add(
        RefreshToken(
            token_hash=hash_refresh_token(raw_token),
            user_id=user_id,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.refresh_token_expire_days),
        )
    )
