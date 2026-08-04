import uuid
from datetime import datetime

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


class RoadmapUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    description: str | None = None


class Roadmap(BaseModel):
    slug: str
    title: str
    description: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr


class DirectionStat(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str
    learners: int


class StreakOut(BaseModel):
    current: int
    longest: int


class ProgressOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    stage_id: int
    completed_at: datetime


class CompleteStageOut(BaseModel):
    stage_id: int
    completed_at: datetime
    roadmap_progress: str
    streak: int
    next_stage_id: int | None
