from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProgressOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    stage_id: int
    completed_at: datetime
