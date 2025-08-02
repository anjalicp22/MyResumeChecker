import React from "react";

interface Props {
  formData: any;
  errors: any;
  resumes: any[];
  selectedResumeId: string;
  submitting: boolean;
  loadingSkills: boolean;
  statusOptions: string[];
  handleChange: (e: React.ChangeEvent<any>) => void;
  setSelectedResumeId: (id: string) => void;
}

const ApplicationFormFields: React.FC<Props> = ({
  formData,
  errors,
  resumes,
  selectedResumeId,
  submitting,
  loadingSkills,
  statusOptions,
  handleChange,
  setSelectedResumeId,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { name: "title", label: "Job Title", type: "text", required: true },
          { name: "experience", label: "Experience", type: "text" },
          { name: "location", label: "Location", type: "text" },
          { name: "lastDate", label: "Application Deadline", type: "date" },
          { name: "portal", label: "Portal Link", type: "url" },
          { name: "interviewProcess", label: "Interview Process", type: "text" },
          { name: "interviewDate", label: "Interview Date", type: "date" },
        ].map(({ name, label, type, required }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              disabled={submitting}
              placeholder={`Enter ${label.toLowerCase()}`}
              className={`mt-1 w-full px-4 py-2 rounded-lg border text-sm focus:outline-none transition focus:ring-2 ring-indigo-400 ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Job Description<span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          name="jobDescription"
          rows={5}
          value={formData.jobDescription}
          onChange={handleChange}
          disabled={submitting}
          placeholder="Paste the job description here..."
          className={`mt-1 w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition focus:ring-2 ring-indigo-400 ${
            errors.jobDescription ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.jobDescription && <p className="text-xs text-red-600 mt-1">{errors.jobDescription}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Resume</label>
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            disabled={submitting || loadingSkills}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 ring-indigo-400"
          >
            <option value="None">None</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.filename}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={submitting}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 ring-indigo-400"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormFields;
