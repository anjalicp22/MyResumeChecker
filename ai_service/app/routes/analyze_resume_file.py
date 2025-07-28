# ai_service/app/routes/analyze_resume_file.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import fitz  # PyMuPDF
from app.services.skill_extraction import suggest_additional_skills_from_resume
from app.utils.skill_match import semantic_match_skills

router = APIRouter()

REQUIRED_SKILLS = ["react", "typescript", "css", "git"]

def extract_text_from_pdf(file: UploadFile) -> str:
    content = file.file.read()
    with fitz.open(stream=content, filetype="pdf") as doc:
        return "\n".join([page.get_text() for page in doc])

@router.post("/analyze-resume-file")
async def analyze_resume_file(file: UploadFile = File(...)):
    try:
        resume_text = extract_text_from_pdf(file)
        print("\n📄 Extracted Resume Text (First 300 chars):\n", resume_text[:300])

        resume_data = suggest_additional_skills_from_resume(resume_text)
        resume_skills = resume_data["existing_skills"]
        suggested_skills = resume_data["suggested_skills"]

        matched, missing = semantic_match_skills(REQUIRED_SKILLS, resume_skills)

        print("✅ Existing Resume Skills:", resume_skills)
        print("✨ Suggested Additional Skills:", suggested_skills)
        print("✅ Matched Required Skills:", matched)
        print("❌ Missing Required Skills:", missing)

        return {
            "existing_skills": resume_skills,
            "suggested_skills": suggested_skills,
            "required_skills": REQUIRED_SKILLS,
            "missing_skills": missing,
            "matched_skills": matched,
            "resume_skills": resume_skills
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
