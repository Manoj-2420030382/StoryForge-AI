import json
import logging
from app.providers.groq_provider import GroqProvider
from app.schemas.story_schema import StorySchema
from app.schemas.refinement_schema import AnalysisResult

logger = logging.getLogger(__name__)

class StoryAnalyzer:
    def __init__(self):
        self.provider = GroqProvider()

    async def analyze(self, story: StorySchema) -> AnalysisResult:
        system_prompt = """
        You are an expert Agile Business Analyst. Your task is to analyze a user story and identify weaknesses, ambiguities, and missing information. 
        You MUST output in valid JSON format ONLY.
        
        The JSON format must be exactly:
        {
            "ambiguities": ["list of ambiguous statements"],
            "missingInformation": ["list of missing details, error handling, edge cases"],
            "issues": ["list of testability issues or weak acceptance criteria"],
            "investViolations": ["list of INVEST principles violated (e.g., 'Not Independent: ...', 'Not Small: ...')"]
        }
        """

        prompt = f"""
        Analyze the following user story:
        Title: {story.title}
        Description: {story.description}
        Acceptance Criteria: {story.acceptanceCriteria or 'None provided'}
        Priority: {story.priority}
        """

        try:
            response = await self.provider.generate(prompt, system_prompt)
            data = json.loads(response)

            return AnalysisResult(
                ambiguities=data.get("ambiguities", []),
                missingInformation=data.get("missingInformation", []),
                issues=data.get("issues", []),
                investViolations=data.get("investViolations", [])
            )
        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            raise Exception(f"Analysis failed: {str(e)}")
