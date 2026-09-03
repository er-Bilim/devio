from dataclasses import dataclass

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.queries import tokens as tokens_q
from app.queries import users as users_q
from app.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    verify_password,
)


@dataclass
class TokenPair:
    access: str
    refresh: str


async def _issue_tokens(db: AsyncSession, user: User) -> TokenPair:
    """Выдать пару токенов и запомнить refresh"""
    access = create_access_token(user_id=str(user.id))
    refresh = generate_refresh_token()

    await tokens_q.store(db, refresh, user.id)
    return TokenPair(access=access, refresh=refresh)


async def register(
    db: AsyncSession, username: str, display_name: str, email: str, password: str
) -> User:
    if await users_q.get_by_email(db, email) is not None:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = await users_q.create(
        db,
        username=username,
        display_name=display_name,
        email=email,
        password_hash=hash_password(password),
    )
    return user


async def login(db: AsyncSession, email: str, password: str) -> tuple[User, TokenPair]:
    user = await users_q.get_by_email(db, email)
    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    pair = await _issue_tokens(db, user)
    await db.commit()

    return user, pair
