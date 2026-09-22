from fastapi import APIRouter, HTTPException
from app.schemas.story_schema import StorySchema
from app.schemas.refinement_schema import PipelineResponse
from app.services.refinement_pipeline import process_pipeline
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/health")
async def health_check():
    return {"status": "UP"}

@router.post("/pipeline", response_model=PipelineResponse)
async def run_pipeline(story: StorySchema):
    try:
        logger.info(f"Starting pipeline for storyId: {story.storyId}")
        result = await process_pipeline(story)
        return result
    except Exception as e:
        logger.error(f"Pipeline failed for storyId {story.storyId}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# The Java orchestrator calls /pipeline, but keep /refine as an alias
@router.post("/refine", response_model=PipelineResponse)
async def refine_story(story: StorySchema):
    """Alias for /pipeline — called by the Java AI orchestration service."""
    return await run_pipeline(story)
