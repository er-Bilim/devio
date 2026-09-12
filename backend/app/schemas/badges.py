from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.badges import BadgeTier


class BadgeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    code: str
    title: str
    tier: BadgeTier
    icon: str


class UserBadgeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    earned_at: datetime
    badge: BadgeOut