from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router as predict_router
from app.routes.analyze_resume_file import router as analyze_resume_file_router
from app.routes.extract_skills import router as extract_skills_router

app = FastAPI(title="AI Resume Skill Predictor")

# Allow frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routes
app.include_router(predict_router)
app.include_router(analyze_resume_file_router)
app.include_router(extract_skills_router)
