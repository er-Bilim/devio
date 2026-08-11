from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Cookie, HTTPException, Response
from sqlalchemy import select

from app.cookies import set_auth_cookies
from app.dependencies import DbSession
from app.models import RefreshToken, User
from app.queries import tokens as tokens_q
from app.schemas import UserLogin, UserPublic, UserRegister
from app.security import (
    create_access_token,
    generate_refresh_token,
    hash_refresh_token,
)
from app.services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic, status_code=201)
async def register(data: UserRegister, db: DbSession):
    user = await auth_service.register(db, email=data.email, password=data.password)
    return user


@router.post("/login", response_model=UserPublic)
async def login(
    data: UserLogin,
    response: Response,
    db: DbSession,
):
    user, pair = await auth_service.login(db, email=data.email, password=data.password)
    set_auth_cookies(response, pair.access, pair.refresh)
    return user


@router.post("/logout", status_code=204)
async def logout(
    response: Response,
    db: DbSession,
    refresh_token: Annotated[str | None, Cookie()] = None,
):
    if refresh_token is not None:
        result = await db.execute(
            select(RefreshToken).where(
                RefreshToken.token_hash == hash_refresh_token(refresh_token)
            )
        )

        stored = result.scalar_one_or_none()

        if stored is not None:
            stored.revoked = True
            await db.commit()

    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/auth")


@router.post("/refresh", response_model=UserPublic)
async def refresh_tokens(
    response: Response,
    db: DbSession,
    refresh_token: Annotated[str | None, Cookie()] = None,
):
    credentials_error = HTTPException(
        status_code=401, detail="Could not validate credentials"
    )
    if refresh_token is None:
        raise credentials_error

    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == hash_refresh_token(refresh_token)
        )
    )

    stored = result.scalar_one_or_none()

    now = datetime.now(timezone.utc)

    if stored is None or stored.revoked or stored.expires_at < now:
        raise credentials_error

    user = await db.get(User, stored.user_id)
    if user is None:
        raise credentials_error

    stored.revoked = True
    new_refresh = generate_refresh_token()

    await tokens_q.store(db, new_refresh, user.id)
    await db.commit()

    set_auth_cookies(response, create_access_token(user_id=str(user.id)), new_refresh)
    return user
