import logging
from groq import AsyncGroq
from app.providers.base_provider import BaseProvider
from app.config import settings

logger = logging.getLogger(__name__)

class GroqProvider(BaseProvider):
    def __init__(self):
        self.api_key = settings.groq_api_key
        if not self.api_key:
            logger.warning("GROQ_API_KEY is not set")
        self.client = AsyncGroq(api_key=self.api_key, timeout=15.0) if self.api_key else None
        self.model = "qwen/qwen3.8-27b"

    async def generate(self, prompt: str, system_prompt: str = "") -> str:
        if not self.client:
            raise Exception("GROQ_API_KEY is not set — cannot call Groq")

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        try:
            response = await self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq generation failed: {e}")
            raise Exception(f"Groq provider failed: {str(e)}")
