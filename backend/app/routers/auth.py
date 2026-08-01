from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from app.config import settings
from app.dependencies import DbSession
from app.models import RefreshToken, User
from app.schemas import UserPublic, UserRegister
from app.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=60 * settings.access_token_expire_minutes,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=60 * settings.refresh_token_expire_days,
        path="/auth",
    )


@router.post("/register", response_model=UserPublic, status_code=201)
async def register(data: UserRegister, db: DbSession):
    exists = await db.execute(select(User).where(User.email == data.email))

    if exists.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(email=data.email, password_hash=hash_password(data.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=UserPublic)
async def login(
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    db: DbSession,
):

    result = await db.execute(select(User).where(User.email == form.username))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
        )

    access = create_access_token(user_id=str(user.id))
    refresh = generate_refresh_token()
    db.add(
        RefreshToken(
            token_hash=hash_refresh_token(refresh),
            user_id=user.id,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.refresh_token_expire_days),
        )
    )
    await db.commit()
    set_auth_cookies(response, access, refresh)
    return user


@router.post("/logout", status_code=204)
async def logout(
    response: Response, db: DbSession, refresh_token: Annotated[str | None, Cookie()]
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
    response.delete_cookie(key="refresh_token", path="/auth/")


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
        return credentials_error

    user = await db.get(User, stored.user_id)
    if user is None:
        return credentials_error

    stored.revoked = True
    new_refresh = generate_refresh_token()
    db.add(
        RefreshToken(
            token_hash=hash_refresh_token(new_refresh),
            user_id=user.id,
            expires_at=now + timedelta(days=settings.refresh_token_expire_days),
        )
    )
    await db.commit()

    set_auth_cookies(response, create_access_token(user_id=str(user.id)), new_refresh)
    return user
