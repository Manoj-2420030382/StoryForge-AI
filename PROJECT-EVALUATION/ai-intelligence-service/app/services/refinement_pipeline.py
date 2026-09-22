import logging
from app.schemas.story_schema import StorySchema
from app.schemas.refinement_schema import (
    PipelineResponse, ProviderStatus, ProviderInfo,
    AnalysisResult, RefinedStoryResult, ValidationResult, QualityResult
)
from app.services.story_analyzer import StoryAnalyzer
from app.services.story_refiner import StoryRefiner
from app.services.story_validator import StoryValidator
from app.services.quality_scorer import QualityScorer

logger = logging.getLogger(__name__)

async def process_pipeline(story: StorySchema) -> PipelineResponse:
    analyzer = StoryAnalyzer()
    refiner = StoryRefiner()
    validator = StoryValidator()
    scorer = QualityScorer()

    provider_status = ProviderStatus()
    analysis_result = AnalysisResult()
    refined_result = RefinedStoryResult()
    validation_result = ValidationResult()
    quality_result = QualityResult()

    # 1. Analyze (Groq)
    try:
        logger.info(f"[Pipeline] Stage 1: Analyzing story {story.storyId} with Groq...")
        analysis_result = await analyzer.analyze(story)
        provider_status.analysis = "SUCCESS"
        logger.info(f"[Pipeline] Stage 1: Analysis complete — found {len(analysis_result.ambiguities)} ambiguities, {len(analysis_result.issues)} issues")
    except Exception as e:
        logger.error(f"[Pipeline] Stage 1 FAILED: {str(e)}")
        provider_status.analysis = "FAILED"

    # 2. Refine (Gemini) — runs even if analysis failed (uses empty analysis)
    try:
        logger.info(f"[Pipeline] Stage 2: Refining story {story.storyId} with Gemini...")
        refined_result = await refiner.refine(story, analysis_result)
        provider_status.refinement = "SUCCESS"
        logger.info(f"[Pipeline] Stage 2: Refinement complete — title: '{refined_result.title}', {len(refined_result.acceptanceCriteria)} acceptance criteria")
    except Exception as e:
        logger.error(f"[Pipeline] Stage 2 FAILED: {str(e)}")
        provider_status.refinement = "FAILED"
        # Fallback to original story content
        refined_result.title = story.title
        refined_result.description = story.description

    # 3. Validate (Gemini) — runs if refinement succeeded
    if provider_status.refinement == "SUCCESS":
        try:
            logger.info(f"[Pipeline] Stage 3: Validating story {story.storyId} with Gemini...")
            validation_result = await validator.validate(refined_result)
            provider_status.validation = "SUCCESS"
            logger.info(f"[Pipeline] Stage 3: Validation complete — valid: {validation_result.valid}, {len(validation_result.issues)} issues")
        except Exception as e:
            logger.error(f"[Pipeline] Stage 3 FAILED: {str(e)}")
            provider_status.validation = "FAILED"

    # 4. Score Quality — runs if refinement succeeded
    if provider_status.refinement == "SUCCESS":
        quality_result = scorer.score_story(refined_result)
        logger.info(f"[Pipeline] Quality Score: {quality_result.score}/100 ({quality_result.level})")

    return PipelineResponse(
        storyId=story.storyId,
        originalStory=story,
        analysis=analysis_result,
        refinedStory=refined_result,
        validation=validation_result,
        quality=quality_result,
        providers=ProviderInfo(analysis="groq", refinement="groq", validation="groq"),
        providerStatus=provider_status
    )
