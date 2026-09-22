import json
import logging
from app.providers.groq_provider import GroqProvider
from app.schemas.story_schema import StorySchema
from app.schemas.refinement_schema import RefinedStoryResult, AnalysisResult

logger = logging.getLogger(__name__)

class StoryRefiner:
    def __init__(self):
        self.provider = GroqProvider()

    def _clean_json(self, response_text: str) -> str:
        # Sometimes models wrap JSON in markdown block
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        return cleaned.strip()

    async def refine(self, story: StorySchema, analysis: AnalysisResult) -> RefinedStoryResult:
        system_prompt = """
        You are an expert Agile Product Owner. Your task is to rewrite and refine a user story based on the provided analysis.
        Improve clarity, fix ambiguities, and generate comprehensive, testable acceptance criteria using Given/When/Then format.
        
        You MUST output in valid JSON format ONLY.
        
        The JSON format must be exactly:
        {
            "title": "A concise, professional title",
            "description": "As a [role], I want [feature] so that [benefit].\\n\\nDetailed context and requirements...",
            "acceptanceCriteria": [
                "Given [context] When [action] Then [result]",
                "Given [context] When [edge case] Then [handling]"
            ]
        }
        """

        prompt = f"""
        Original User Story:
        Title: {story.title}
        Description: {story.description}
        Acceptance Criteria: {story.acceptanceCriteria or 'None provided'}
        
        Analysis to address:
        Ambiguities: {json.dumps(analysis.ambiguities)}
        Missing Info: {json.dumps(analysis.missingInformation)}
        Issues: {json.dumps(analysis.issues)}
        INVEST Violations: {json.dumps(analysis.investViolations)}
        
        Please provide the refined user story addressing all these points.
        """

        try:
            response = await self.provider.generate(prompt, system_prompt)
            cleaned_response = self._clean_json(response)
            data = json.loads(cleaned_response)

            return RefinedStoryResult(
                title=data.get("title", story.title),
                description=data.get("description", story.description),
                acceptanceCriteria=data.get("acceptanceCriteria", [])
            )
        except Exception as e:
            logger.error(f"Refinement failed: {e}")
            raise Exception(f"Refinement failed: {str(e)}")
