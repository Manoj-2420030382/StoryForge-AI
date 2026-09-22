import asyncio
import logging
import time
from google import genai
from google.genai import types
from app.providers.base_provider import BaseProvider
from app.config import settings

logger = logging.getLogger(__name__)

# Primary model, with a fallback if it's overloaded
MODELS = ["gemini-3.5-flash-lite", "gemini-flash-latest"]
MAX_RETRIES = 1
BASE_DELAY = 1  # seconds


class GeminiProvider(BaseProvider):
    def __init__(self):
        self.api_key = settings.gemini_api_key
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set")
        self.client = genai.Client(
            api_key=self.api_key, 
            http_options={"timeout": 30000}
        ) if self.api_key else None

    def _sync_generate(self, prompt: str, system_prompt: str = "", model: str = MODELS[0]) -> str:
        """Synchronous call to Gemini — run via asyncio.to_thread."""
        config = types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
        )
        if system_prompt:
            config.system_instruction = system_prompt

        response = self.client.models.generate_content(
            model=model,
            contents=prompt,
            config=config,
        )
        return response.text

    async def generate(self, prompt: str, system_prompt: str = "") -> str:
        if not self.client:
            raise Exception("GEMINI_API_KEY is not set — cannot call Gemini")

        last_error = None

        for model in MODELS:
            for attempt in range(1, MAX_RETRIES + 1):
                try:
                    result = await asyncio.to_thread(
                        self._sync_generate, prompt, system_prompt, model
                    )
                    return result
                except Exception as e:
                    last_error = e
                    error_str = str(e)

                    # Retry on 503 (overloaded), 429 (rate limit), or 504 (timeout)
                    if any(err in error_str for err in ["503", "429", "UNAVAILABLE", "504", "DEADLINE_EXCEEDED"]):
                        delay = BASE_DELAY * (2 ** (attempt - 1))
                        logger.warning(
                            f"Gemini {model} attempt {attempt}/{MAX_RETRIES} failed (transient): {e}. "
                            f"Retrying in {delay}s..."
                        )
                        await asyncio.sleep(delay)
                    else:
                        # Non-transient error — don't retry, break to try the NEXT model
                        logger.error(f"Gemini {model} failed (non-transient): {e}")
                        break

            logger.warning(f"All {MAX_RETRIES} retries exhausted for model {model}, trying next model...")

        # All models and retries exhausted
        logger.error(f"Gemini generation failed after all retries and models: {last_error}")
        raise Exception(f"Gemini provider failed: {str(last_error)}")

