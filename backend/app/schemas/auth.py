import re

from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    email: EmailStr
    username: str
    display_name: str
    password: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        username = value.lstrip("@").strip().lower()

        if not re.match(r"^[a-zA-Z0-9_]+$", value):
            raise ValueError(
                "Username can only contain Latin letters, numbers, and underscores"
            )

        if len(value) < 5 or len(value) > 30:
            raise ValueError("Username must be between 5 and 30 characters")

        return username

    @field_validator("display_name")
    @classmethod
    def validate_display_name(cls, value: str) -> str:
        display_name = value.strip().lower()

        if not re.match(r"^[a-zA-Z0-9]+$", value):
            raise ValueError("Display name can only contain Latin letters and numbers")

        if len(value) < 3 or len(value) > 25:
            raise ValueError("Display name must be between 3 and 25 characters")

        return display_name

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str
