//client\src\components\SkillAnalysisBox.tsx

import React from "react";

interface Props {
  analysis: { required_skills: string[]; missing_skills: string[] };
  resumeSkills: string[];
}

const SkillAnalysisBox: React.FC<Props> = ({ analysis, resumeSkills }) => (
  <div className="mt-6 w-full bg-indigo-50 border border-indigo-200 rounded-xl p-4 sm:p-5 space-y-4 shadow overflow-x-auto">
    <h3 className="text-base sm:text-lg font-semibold text-indigo-700 flex items-center gap-2">
      Skill Gap Analysis
    </h3>

    {/* Required Skills Breakdown */}
    <div className="flex flex-wrap gap-2">
      {analysis.required_skills.map((skill, idx) => {
        const isMissing = analysis.missing_skills.includes(skill);
        return (
          <span
            key={idx}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border break-words ${
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

    {/* Resume Skills */}
    <div className="text-sm text-gray-600 overflow-x-auto">
      <strong className="block mb-1">Resume Skills:</strong>
      <div className="flex flex-wrap gap-2">
        {resumeSkills.length > 0 ? (
          resumeSkills.map((s, i) => (
            <span
              key={i}
              className="inline-block px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs sm:text-sm"
            >
              {s}
            </span>
          ))
        ) : (
          <span className="italic text-gray-400">None</span>
        )}
      </div>
    </div>
  </div>
);

export default SkillAnalysisBox;
