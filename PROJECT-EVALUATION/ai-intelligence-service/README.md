# StoryForge AI Intelligence Service

The AI Intelligence Service is a Python FastAPI microservice that acts as an orchestration layer for multi-agent autonomous user story refinement.

## Architecture

This service implements a pipeline of distinct AI agents to process raw user requirements:

1. **Analyst Agent (Groq / LLaMA 3 70B)**: Analyzes the raw user story for ambiguities, missing information, and INVEST principle violations.
2. **Refiner Agent (Gemini 1.5 Pro)**: Rewrites the user story and generates detailed, testable Behavior-Driven Development (BDD) Given-When-Then acceptance criteria.
3. **Validator Agent (Ollama / LLaMA 3.1)**: Acts as a Quality Assurance check to ensure logical consistency and prevent AI hallucinations.
4. **Deterministic Scorer**: An algorithmic evaluator that grades the AI output for Clarity, Specificity, Testability, and Completeness.

## Setup Instructions

1. Install Python 3.11+
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your API keys for Groq and Gemini.

## Running the Service

```bash
fastapi dev app/main.py
```
By default, it will run on `http://localhost:8000`.

## API Documentation
Once running, navigate to `http://localhost:8000/docs` to view the interactive OpenAPI documentation.
