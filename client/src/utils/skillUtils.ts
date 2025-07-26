//client\src\utils\skillUtils.ts

import stringSimilarity from "string-similarity";

export const normalizeSkill = (skill: string): string =>
  skill.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();

export const getMissingSkillsFuzzy = (
  requiredSkills: string[],
  resumeSkills: string[],
  threshold = 0.8
): string[] => {
  if (!resumeSkills || resumeSkills.length === 0) return requiredSkills;
  const normalizedResume = resumeSkills.map(normalizeSkill);
  return requiredSkills.filter((reqSkill) => {
    const normReq = normalizeSkill(reqSkill);
    const { bestMatch } = stringSimilarity.findBestMatch(normReq, normalizedResume);
    return bestMatch.rating < threshold;
  });
};

export const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export function scoreResumeSkills(required: string[], resumeSkills: string[]): number {
  return stringSimilarity.compareTwoStrings(
    required.join(" ").toLowerCase(),
    resumeSkills.join(" ").toLowerCase()
  );
}
