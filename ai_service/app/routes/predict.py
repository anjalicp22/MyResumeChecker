# ai-service\app\routes\predict.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.generate_skills import generate_skill_suggestions

router = APIRouter()

class PredictRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/predict-skills")
async def predict_skills(req: PredictRequest):
    try:
        res = generate_skill_suggestions(req.resume_text, req.job_description)
        return {"suggested_skills": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
