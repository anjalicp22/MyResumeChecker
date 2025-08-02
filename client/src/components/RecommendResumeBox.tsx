import React from "react";

interface Props {
  recommendResult: { rid: string; filename: string; score: number };
  resumeSkillsMap: Record<string, string[]>;
  setSelectedResumeId: (rid: string) => void;
  setResumeSkills: (skills: string[]) => void;
}

const RecommendResumeBox: React.FC<Props> = ({
  recommendResult,
  resumeSkillsMap,
  setSelectedResumeId,
  setResumeSkills,
}) => (
  <div className="mt-6 bg-white border border-indigo-300 rounded-xl p-5 shadow flex items-center space-x-6">
    <div className="flex-1">
      <p className="font-semibold text-gray-800 text-sm">Best Resume:</p>
      <p className="text-lg text-indigo-700 font-medium">{recommendResult.filename}</p>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className="bg-indigo-600 h-4 rounded-full"
          style={{ width: `${(recommendResult.score * 100).toFixed(1)}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">
        Match Score: {(recommendResult.score * 100).toFixed(1)}%
      </p>
    </div>
    <button
      onClick={() => {
        setSelectedResumeId(recommendResult.rid);
        setResumeSkills(resumeSkillsMap[recommendResult.rid] || []);
      }}
      className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 text-sm"
    >
      Select Resume
    </button>
  </div>
);

export default RecommendResumeBox;
