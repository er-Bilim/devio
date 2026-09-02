import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
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
