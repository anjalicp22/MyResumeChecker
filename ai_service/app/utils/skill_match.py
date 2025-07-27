# ai_service/app/utils/skill_match.py

from sentence_transformers import SentenceTransformer, util

# Load the model once (avoid reloading every function call)
model = SentenceTransformer("all-MiniLM-L6-v2")

def semantic_match_skills(required_skills: list, resume_skills: list, threshold: float = 0.7) -> tuple[list, list]:
    """
    Perform semantic matching of required skills against resume skills.

    :param required_skills: List of required skill strings.
    :param resume_skills: List of resume skill strings.
    :param threshold: Similarity threshold (default 0.7).
    :return: Tuple of (matched_skills, missing_skills).
    """
    if not required_skills or not resume_skills:
        return [], required_skills

    # Encode skills into embeddings
    required_embeddings = model.encode(required_skills, convert_to_tensor=True, normalize_embeddings=True)
    resume_embeddings = model.encode(resume_skills, convert_to_tensor=True, normalize_embeddings=True)

    matched = []
    missing = []

    # Compare each required skill with resume skills
    for i, req_emb in enumerate(required_embeddings):
        # Calculate cosine similarities
        sims = util.pytorch_cos_sim(req_emb, resume_embeddings).cpu()
        if sims.max() >= threshold:
            matched.append(required_skills[i])
        else:
            missing.append(required_skills[i])

    return matched, missing
