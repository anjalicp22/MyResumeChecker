//client\src\components\SkillList.tsx
import React, { useEffect, useState } from 'react';
import { getSkillsForResume } from '../services/skillService';
import { useAuth } from "../context/AuthContext";

interface SkillListProps {
  resumeId: string;
}

const SkillList: React.FC<SkillListProps> = ({ resumeId }) => {
  const { token } = useAuth();
  const [existingSkills, setExistingSkills] = useState<string[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkillsForResume(resumeId, token!);
        const skillEntries = response.data;

        const existing = skillEntries.find((s: any) => !s.isSuggested)?.skills || [];
        const suggested = skillEntries.find((s: any) => s.isSuggested)?.skills || [];

        setExistingSkills(existing);
        setSuggestedSkills(suggested);

      } catch (error) {
        console.error("Error loading skills:", error);
      }
    };

    fetchSkills();
  }, [resumeId]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 sm:p-6 mb-6 w-full max-w-full overflow-x-auto">
      {/* Existing Skills */}
      <div className="mb-4">
        <span className="block text-base sm:text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
          Skills Found:
        </span>
        <ul className="list-disc pl-5 sm:pl-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base space-y-1">
          {existingSkills.length > 0
            ? existingSkills.map((skill, i) => <li key={i}>{skill}</li>)
            : <li className="text-gray-400 italic">None</li>}
        </ul>
      </div>

      {/* Suggested Skills */}
      <div>
        <span className="block text-base sm:text-lg font-semibold text-purple-700 dark:text-purple-400 mb-2">
          🔮 Suggested Skills:
        </span>
        <ul className="list-disc pl-5 sm:pl-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base space-y-1">
          {suggestedSkills.length > 0
            ? suggestedSkills.map((skill, i) => <li key={i}>{skill}</li>)
            : <li className="text-gray-400 italic">None</li>}
        </ul>
      </div>
    </div>
  );
};

export default SkillList;
