from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="StoryForge AI Intelligence Service",
    description="Agentic Framework for Autonomous User Story Refinement",
    version="1.0.0"
)

# CORS is handled by Vite Proxy or Gateway, but allowing it here for direct calls if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def read_root():
    return {"message": "StoryForge AI Intelligence Service is running"}
