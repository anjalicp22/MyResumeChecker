# ai_service/app/tests/test_skill_matching.py

from app.utils.skill_match import semantic_match_skills

required = ["react", "typescript", "css", "git"]
resume = ["React.js", "version control using GitHub", "HTML", "Python", "Agile"]

matched, missing = semantic_match_skills(required, resume)

print("Matched Skills ✅:", matched)
print("Missing Skills ❌:", missing)
