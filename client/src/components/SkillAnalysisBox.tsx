import React from "react";

interface Props {
  analysis: { required_skills: string[]; missing_skills: string[] };
  resumeSkills: string[];
}

const SkillAnalysisBox: React.FC<Props> = ({ analysis, resumeSkills }) => (
  <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3 shadow">
    <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
      Skill Gap Analysis
    </h3>
    <div className="flex flex-wrap gap-2">
      {analysis.required_skills.map((skill, idx) => {
        const isMissing = analysis.missing_skills.includes(skill);
        return (
          <span
            key={idx}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              isMissing
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-green-100 text-green-700 border-green-300"
            }`}
          >
            {isMissing ? skill : `✔️ ${skill}`}
          </span>
        );
      })}
    </div>
    <div className="text-sm text-gray-600">
      <strong>Resume Skills:</strong>{" "}
      {resumeSkills.length ? (
        resumeSkills.map((s, i) => (
          <span key={i} className="inline-block px-2 py-1 bg-gray-100 border rounded mr-2 text-xs">
            {s}
          </span>
        ))
      ) : (
        <span className="italic text-gray-400">None</span>
      )}
    </div>
  </div>
);

export default SkillAnalysisBox;
