from pydantic import BaseModel
from typing import List, Optional, Dict
from app.schemas.story_schema import StorySchema

class AnalysisResult(BaseModel):
    ambiguities: List[str] = []
    missingInformation: List[str] = []
    issues: List[str] = []
    investViolations: List[str] = []

class RefinedStoryResult(BaseModel):
    title: str = ""
    description: str = ""
    acceptanceCriteria: List[str] = []

class ValidationResult(BaseModel):
    valid: bool = False
    issues: List[str] = []

class QualityBreakdown(BaseModel):
    clarity: int = 0
    specificity: int = 0
    testability: int = 0
    completeness: int = 0
    invest: int = 0

class QualityResult(BaseModel):
    score: int = 0
    level: str = "POOR"  # POOR, NEEDS_IMPROVEMENT, GOOD, EXCELLENT
    breakdown: QualityBreakdown = QualityBreakdown()

class ProviderStatus(BaseModel):
    analysis: str = "PENDING"
    refinement: str = "PENDING"
    validation: str = "PENDING"

class ProviderInfo(BaseModel):
    analysis: str = "groq"
    refinement: str = "gemini"
    validation: str = "gemini"

class PipelineResponse(BaseModel):
    storyId: int
    originalStory: StorySchema
    analysis: AnalysisResult = AnalysisResult()
    refinedStory: RefinedStoryResult = RefinedStoryResult()
    validation: ValidationResult = ValidationResult()
    quality: QualityResult = QualityResult()
    providers: ProviderInfo = ProviderInfo()
    providerStatus: ProviderStatus = ProviderStatus()
