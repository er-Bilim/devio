from pydantic import BaseModel, ConfigDict, EmailStr


class StageCreate(BaseModel):
    title: str
    order: int
    description: str | None = None


class StageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    position: int


class RoadmapOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    description: str | None
    stages: list[StageOut] = []

class RoadmapCreate(BaseModel):
    slug: str
    title: str
    description: str | None
    
class Roadmap(BaseModel):
    slug: str
    title: str
    description: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str
