from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.enums import StatusEnum


class StreakOut(BaseModel):
    current: int
    longest: int


class CompleteStageOut(BaseModel):
    stage_id: int
    completed_at: datetime
    roadmap_progress: str
    streak: int
    next_stage_id: int | None


class DirectionStat(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str
    learners: int
    status: StatusEnum
