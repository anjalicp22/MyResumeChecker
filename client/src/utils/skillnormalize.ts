// client/src/utils/skillnormalize.ts
// Small utility to make skill comparisons robust (MongoDB vs mongodb vs mongo db, etc.)

/**
 * Normalize a single skill to a canonical form (lowercased, trimmed, stripped punctuation etc.)
 */
export const normalizeSkill = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9.+#]/g, " ") // keep things like c++, .net
    .replace(/\s+/g, " ")
    .trim();

const ALIASES: Record<string, string[]> = {
  mongodb: ["mongo db", "mongo-db", "mongo", "mongo dbms"],
  node: ["nodejs", "node.js", "node js"],
  "c#": ["c sharp"],
  "c++": ["cpp"],
  react: ["reactjs", "react.js"],
  fastapi: ["fast api"],
  "sql": ["postgresql", "mysql"] // if you want to consider them same, else remove
  // extend this dictionary as you wish…
};

export const canonicalize = (skill: string) => {
  const norm = normalizeSkill(skill);
  for (const [canon, variants] of Object.entries(ALIASES)) {
    if (canon === norm || variants.includes(norm)) return canon;
  }
  return norm;
};

export const normalizeArray = (arr: string[]) =>
  Array.from(new Set(arr.map(canonicalize)));
