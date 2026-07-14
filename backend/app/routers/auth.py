from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from app.dependencies import DbSession
from app.fake_users_db import fake_users_db
from app.models import User
from app.security import create_access_token, hash_password, verify_password
from app.shemas import Token, UserPublic, UserRegister

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic, status_code=201)
async def register(data: UserRegister, db: DbSession):
    exists = await db.execute(select(User).where(User.email == data.email))

    if exists.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(email=data.email, password=hash_password(data.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = fake_users_db.get(form.username)

    if user is None or not verify_password(form.password, user["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(user_id=user["id"])
    return Token(access_token=token, token_type="bearer")
