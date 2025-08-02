import React from "react";

interface Props {
  app: any;
  expanded: boolean;
  toggleDetails(): void;
  showAllDetails: boolean;
  resumes: any[];
  resumeSkillsMap: Record<string, string[]>;
  submitting: boolean;
  getSkillsForResume: (rid: string, token: string) => Promise<any>;
  doAnalysis: (desc: string, skills: string[]) => Promise<any>;
  handleStatusUpdate(id: string, status: string): void;
  handleDelete(id: string): void;
  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
  token: string;
  cardErrors: Record<string, string>;
}

const SavedApplicationCard: React.FC<Props> = ({
  app,
  expanded,
  toggleDetails,
  showAllDetails,
  resumes,
  resumeSkillsMap,
  submitting,
  getSkillsForResume,
  doAnalysis,
  handleStatusUpdate,
  handleDelete,
  setApplications,
  token,
  cardErrors,
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 border border-gray-100">
    {/* header */}
    <div className="space-y-3">
      {/* resume selection, status select */}
      {/* analyze/clear buttons */}
      {/* analysisResult rendering */}
      <button
        className="w-full bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg mt-2"
        disabled={submitting}
        onClick={() => handleDelete(app._id)}
      >
        Delete
      </button>
      {cardErrors[app._id] && (
        <p className="text-xs text-red-600">{cardErrors[app._id]}</p>
      )}
    </div>
  </div>
);

export default SavedApplicationCard;
