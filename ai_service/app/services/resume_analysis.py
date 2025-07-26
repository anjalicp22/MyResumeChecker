# ai-service/app/services/resume_analysis.py

from app.services.embedding import get_embedding
from app.rag.retriever import retrieve_relevant_chunks
from app.services.skill_extraction import extract_skills_from_context
from app.rag.document_loader import chunk_text

def analyze_resume_against_jd(resume: str, jd: str) -> list:
    """
    Analyze resume against job description:
    1. Chunk JD
    2. Get embedding for resume
    3. Retrieve relevant chunks using Pinecone
    4. Generate missing skill suggestions
    """
    jd_chunks = chunk_text(jd)
    resume_emb = get_embedding(resume, model="embed-english-v3.0")

    relevant_chunks = retrieve_relevant_chunks(resume_emb, jd_chunks)
    context = "\n".join(relevant_chunks)

    return extract_skills_from_context(resume, context)

def test_resume_analysis():
    dummy_resume = "Experienced Python developer with knowledge of Django, REST APIs, and SQL."
    dummy_jd = "Looking for a backend engineer skilled in Python, Django, PostgreSQL, and Docker."
    
    result = analyze_resume_against_jd(dummy_resume, dummy_jd)
    print("🔍 Suggested Skills:")
    for skill in result:
        print("•", skill)

# Run only if this script is executed directly (not when imported)
if __name__ == "__main__":
    test_resume_analysis()