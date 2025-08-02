from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router as predict_router
from app.routes.analyze_resume_file import router as analyze_resume_file_router
from app.routes.extract_skills import router as extract_skills_router
from app.services.analyze_job_description import router as analyze_jd_router

app = FastAPI(title="AI Resume Skill Predictor")

origins = [
    "http://localhost:3000",
    "https://myresumechecker.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],             
)


app.include_router(predict_router)
app.include_router(analyze_resume_file_router)
app.include_router(extract_skills_router)
app.include_router(analyze_jd_router)
