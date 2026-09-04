import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.schemas.badges import UserBadgeOut


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    username: str
    display_name: str
    created_at: datetime


class UserPrivate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    username: str
    display_name: str
    created_at: datetime


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    username: str
    display_name: str
    created_at: datetime
    badges: list[UserBadgeOut]
