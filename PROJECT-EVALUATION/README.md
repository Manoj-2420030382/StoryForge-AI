# StoryForge AI

An Agentic and Service-Oriented Framework for Autonomous User Story Refinement.

StoryForge AI is a final-year project designed to solve a major problem in Agile software development: poorly written user stories. It uses a Multi-Agent AI system to autonomously analyze, refine, and validate raw user requirements, generating high-quality Behavior-Driven Development (BDD) acceptance criteria.

## Architecture Overview

The system consists of three distinct components:

1. **Java Microservices Backend** (`/backend-java`)
   - Read-only Spring Boot microservices ecosystem.
   - Includes Eureka Server, API Gateway (8080), Auth Service (8081), Project Service (8082), Story Service (8083), and an AI Orchestration stub.
   - Provides JWT-based authentication and core CRUD operations.

2. **Python AI Intelligence Service** (`/ai-intelligence-service`)
   - FastAPI-based orchestration layer for the multi-agent AI pipeline.
   - Utilizes `Groq` (LLaMA 3 70B) for Analysis.
   - Utilizes `Gemini 1.5 Pro` for Refinement and Acceptance Criteria generation.
   - Utilizes `Ollama` (LLaMA 3.1) for Validation and Hallucination checking.
   - Implements a deterministic quality scoring heuristic algorithm.

3. **React Frontend** (`/frontend`)
   - Modern React SPA built with Vite, TypeScript, and TailwindCSS.
   - Implements a Vite Proxy to seamlessly route `/api/ai/*` traffic to the Python service and `/api/*` traffic to the Java Gateway, bypassing CORS limitations.
   - Features a professional, dynamic Dashboard and a dedicated side-by-side AI Refinement Workspace.

## Getting Started

### 1. Start the Java Backend
Ensure you have Java 17+ and Maven installed. Start the services in the following order:
1. `eureka-server` (Port 8761)
2. `api-gateway` (Port 8080)
3. `auth-service` (Port 8081)
4. `project-service` (Port 8082)
5. `story-service` (Port 8083)

*(Do not start `ai-orchestration` as it is a stub replaced by our Python service)*

### 2. Start the Python AI Service
Navigate to `ai-intelligence-service`.
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Edit .env with your GROQ and GEMINI API keys
fastapi dev app/main.py
```
*(Runs on Port 8000)*

### 3. Start the Frontend
Navigate to `frontend`.
```bash
npm install
npm run dev
```
*(Runs on Port 5173)*

Navigate to `http://localhost:5173` in your browser.
