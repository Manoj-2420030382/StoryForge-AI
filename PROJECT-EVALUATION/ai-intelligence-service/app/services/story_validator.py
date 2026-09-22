import json
import logging
from app.providers.groq_provider import GroqProvider
from app.schemas.refinement_schema import RefinedStoryResult, ValidationResult

logger = logging.getLogger(__name__)

class StoryValidator:
    def __init__(self):
        self.provider = GroqProvider()

    def _clean_json(self, response_text: str) -> str:
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        return cleaned.strip()

    async def validate(self, refined_story: RefinedStoryResult) -> ValidationResult:
        system_prompt = """
        You are a Quality Assurance Engineer. Your task is to validate a refined user story and its acceptance criteria for logical consistency, hallucinations, and completeness.
        
        You MUST output in valid JSON format ONLY.
        
        The JSON format must be exactly:
        {
            "valid": true/false,
            "issues": ["list of logical inconsistencies, hallucinations, or missing test cases"]
        }
        """

        prompt = f"""
        Refined User Story to Validate:
        Title: {refined_story.title}
        Description: {refined_story.description}
        Acceptance Criteria:
        {chr(10).join(f"- {ac}" for ac in refined_story.acceptanceCriteria)}
        """

        try:
            response = await self.provider.generate(prompt, system_prompt)
            cleaned_response = self._clean_json(response)
            data = json.loads(cleaned_response)

            return ValidationResult(
                valid=data.get("valid", False),
                issues=data.get("issues", [])
            )
        except Exception as e:
            logger.error(f"Validation failed: {e}")
            raise Exception(f"Validation failed: {str(e)}")
