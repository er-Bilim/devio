import uuid
from typing import Annotated

import jwt
from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import User
from app.security import decode_access_token

DbSession = Annotated[AsyncSession, Depends(get_db)]


def pagination(limit: int = 10, offset: int = 0) -> dict:
    return {"limit": limit, "offset": offset}


async def get_current_user(
    db: DbSession,
    access_token: Annotated[str | None, Cookie()] = None,
) -> User:
    credentials_error = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )

    if access_token is None:
        raise credentials_error
    try:
        payload = decode_access_token(access_token)
    except jwt.InvalidTokenError as err:
        raise credentials_error from err

    try:
        user_id = uuid.UUID(payload.get("sub"))
    except (ValueError, TypeError) as err:
        raise credentials_error from err

    user = await db.get(User, user_id)

    if user is None:
        raise credentials_error

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_admin(user: CurrentUser):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return user


AdminUser = Annotated[dict, Depends(get_current_admin)]
