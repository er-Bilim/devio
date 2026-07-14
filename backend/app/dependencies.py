import uuid
from typing import Annotated, Tuple

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import Result, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.fake_users_db import fake_users_db
from app.models import User
from app.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
DbSession = Annotated[AsyncSession, Depends(get_db)]


def pagination(limit: int = 10, offset: int = 0) -> dict:
    return {"limit": limit, "offset": offset}


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], db: DbSession
) -> User:
    credentials_error = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
    except jwt.InvalidTokenError:
        raise credentials_error

    try:
        user_id = uuid.UUID(payload.get("sub"))
    except (ValueError, TypeError):
        raise credentials_error

    user = await db.get(User, user_id)

    if user is None:
        raise credentials_error

    return user


CurrentUser = Annotated[dict, Depends(get_current_user)]


def get_current_admin(user: CurrentUser):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return user


AdminUser = Annotated[dict, Depends(get_current_admin)]
