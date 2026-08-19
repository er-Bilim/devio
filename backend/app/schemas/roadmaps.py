from pydantic import BaseModel, ConfigDict


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


class RoadmapCreate(BaseModel):
    slug: str
    title: str
    description: str | None = None


class RoadmapUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    description: str | None = None
