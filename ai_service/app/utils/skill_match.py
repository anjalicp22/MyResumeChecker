# ai_service/app/utils/skill_match.py

from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def semantic_match_skills(required_skills: list, resume_skills: list, threshold: float = 0.7) -> tuple:
    """Semantic match using Sentence Transformers."""
    if not required_skills or not resume_skills:
        return [], required_skills

    required_embeddings = model.encode(required_skills, convert_to_tensor=True)
    resume_embeddings = model.encode(resume_skills, convert_to_tensor=True)

    matched = []
    missing = []

    for i, req_emb in enumerate(required_embeddings):
        sims = util.pytorch_cos_sim(req_emb, resume_embeddings)[0]
        if max(sims) >= threshold:
            matched.append(required_skills[i])
        else:
            missing.append(required_skills[i])

    return matched, missing
