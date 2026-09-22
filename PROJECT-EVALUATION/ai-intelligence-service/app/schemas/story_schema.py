from pydantic import BaseModel, Field
from typing import Optional

class StorySchema(BaseModel):
    storyId: int
    title: str = Field(..., max_length=200)
    description: str = Field(..., max_length=5000)
    acceptanceCriteria: Optional[str] = Field(None, max_length=10000)
    priority: Optional[str] = "MEDIUM"
    storyPoints: Optional[int] = Field(None, ge=0, le=100)
