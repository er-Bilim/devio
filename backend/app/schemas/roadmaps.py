from pydantic import BaseModel, ConfigDict, computed_field

from app.enums import StatusEnum


class StageCreate(BaseModel):
    title: str
    order: int
    description: str | None = None


class StageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    position: int
    description: str | None = None
    topics: list[str] = []
    duration_weeks: int


class Roadmap(BaseModel):
    slug: str
    title: str
    description: str


class RoadmapOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    description: str | None
    stages: list[StageOut] = []
    status: StatusEnum

    @computed_field
    @property
    def duration_weeks_total(self) -> int:
        return sum(s.duration_weeks for s in self.stages)


class RoadmapCreate(BaseModel):
    slug: str
    title: str
    description: str | None = None


class RoadmapUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    description: str | None = None
