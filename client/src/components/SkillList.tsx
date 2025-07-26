//client\src\components\SkillList.tsx

import React, { useEffect, useState } from 'react';
import { getSkillsForResume } from '../services/skillService.ts';
import { useAuth } from "../context/AuthContext.tsx";

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
        const response = await getSkillsForResume(resumeId,token!);
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
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <div className="mb-4">
          <span className="font-semibold text-green-700 dark:text-green-400">Skills Found:</span>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
            {existingSkills.length > 0
              ? existingSkills.map((skill, i) => <li key={i}>{skill}</li>)
              : <li className="text-gray-400 italic">None</li>}
          </ul>
        </div>
        <div>
          <span className="font-semibold text-purple-700 dark:text-purple-400">🔮 Suggested Skills:</span>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
            {suggestedSkills.length > 0
              ? suggestedSkills.map((skill, i) => <li key={i}>{skill}</li>)
              : <li className="text-gray-400 italic">None</li>}
          </ul>
        </div>
      </div>

  );
};

export default SkillList;
