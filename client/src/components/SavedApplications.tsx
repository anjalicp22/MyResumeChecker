import React from "react";
import SavedApplicationCard from "../components/SavedApplicationCard";

interface Props {
  filteredApps: any[];
  expandedApps: Record<string, boolean>;
  toggleMoreDetails: (id: string) => void;
  showAllDetailsMap: Record<string, boolean>;
  resumes: any[];
  resumeSkillsMap: Record<string, string[]>;
  submitting: boolean;
  getSkillsForResume: (rid: string, token: string) => Promise<any>;
  doAnalysis: (desc: string, skills: string[]) => Promise<any>;
  handleStatusUpdate: (id: string, status: string) => void;
  handleDelete: (id: string) => void;
  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
  token: string;
  cardErrors: Record<string, string>;
}

const SavedApplications: React.FC<Props> = ({
  filteredApps,
  expandedApps,
  toggleMoreDetails,
  showAllDetailsMap,
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
  <section className="space-y-8">
    <br />
    <h2 className="text-2xl font-semibold text-center text-indigo-800">📂 Saved Applications</h2>

    {filteredApps.length === 0 ? (
      <p className="text-center text-gray-500 italic">No applications found.</p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => (
          <SavedApplicationCard
            key={app._id}
            app={app}
            expanded={expandedApps[app._id]}
            toggleDetails={() => toggleMoreDetails(app._id)}
            showAllDetails={showAllDetailsMap[app._id]}
            resumes={resumes}
            resumeSkillsMap={resumeSkillsMap}
            submitting={submitting}
            getSkillsForResume={getSkillsForResume}
            doAnalysis={doAnalysis}
            handleStatusUpdate={handleStatusUpdate}
            handleDelete={handleDelete}
            setApplications={setApplications}
            token={token}
            cardErrors={cardErrors}
          />
        ))}
      </div>
    )}
  </section>
);

export default SavedApplications;
