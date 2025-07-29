// client/src/pages/ApplicationForm.tsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getSkillsForResume } from "../services/skillService";
import { getMissingSkillsFuzzy, capitalize, scoreResumeSkills } from "../utils/skillUtils";
import stringSimilarity from "string-similarity";
import { toast } from "react-toastify";
import Tooltip from "../components/Tooltip";

// Utility for consistent error logging
const logError = (context: string, err: unknown) =>
  console.error(`🚨 [${context}]`, err);

interface AnalysisResult {
  required_skills: string[];
  missing_skills: string[];
}

interface Application {
  _id: string;
  title: string;
  location: string;
  experience?: string;
  lastDate?: string;
  jobDescription?: string;
  portal?: string;
  interviewProcess?: string;
  interviewDate: string;
  status: string;
  resumeUsed?: string;
  analysisResult?: AnalysisResult | null;
}

interface Resume {
  _id: string;
  filename: string;
  existing_skills: string[];
}

const defaultForm = {
  title: "",
  experience: "",
  location: "",
  jobDescription: "",
  lastDate: "",
  portal: "",
  interviewProcess: "",
  interviewDate: "",
  status: "Applied",
};

const ApplicationForm: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // State definitions
  const [formData, setFormData] = useState(defaultForm);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("None");
  const [statusFilter, setStatusFilter] = useState("All");
  const [resumeSkillsMap, setResumeSkillsMap] = useState<Record<string, string[]>>({});
  const [recommending, setRecommending] = useState(false);
  const [recommendResult, setRecommendResult] = useState<{ rid: string; filename: string; score: number } | null>(null);
  const [expandedApps, setExpandedApps] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [showAllDetailsMap, setShowAllDetailsMap] = useState<Record<string, boolean>>({});

  // Loading & validation states
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = ["Applied", "Interview Scheduled", "Rejected", "Offer Received"];

  // Spinner SVG component
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 inline-block mr-2 text-white" /* ... */>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
  );

  // Initial data fetch
  useEffect(() => {
    if (!token) {
      logError("Auth", "Missing token — redirecting");
      toast.error("Authentication failed. Redirecting...");
      navigate("/", { replace: true });
      return;
    }

    (async function fetchData() {
      console.log("🔄 Fetching applications and resumes...");
      try {
        const [appsRes, resumesRes] = await Promise.all([
          api.get("/api/applications", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/resume", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        console.log(" Applications fetched:", appsRes.data);
        console.log(" Resumes fetched:", resumesRes.data);
        setApplications(appsRes.data);
        setResumes(resumesRes.data);
        if (resumesRes.data.length) {
          setSelectedResumeId(resumesRes.data[resumesRes.data.length - 1]._id);
        }
      } catch (err) {
        logError("fetchInitialData", err);
        toast.error("Failed to load initial data.");
        setErrors(prev => ({ ...prev, global: "Failed to load data. See console." }));
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [token, navigate]);

  // Load skills for the selected resume
  useEffect(() => {
    (async () => {
      console.log(`🔄 Loading skills for resume: ${selectedResumeId}`);
      setLoadingSkills(true);
      setResumeSkills([]);
      try {
        if (selectedResumeId !== "None") {
          const resp = await getSkillsForResume(selectedResumeId, token!);
          console.log(` Skills for resume ${selectedResumeId}:`, resp.data);
          setResumeSkills(resp.data?.[0]?.skills || []);
        }
      } catch (err) {
        logError("loadSkills", err);
        toast.error("Failed to load resume skills.");
      } finally {
        setLoadingSkills(false);
      }
    })();
  }, [selectedResumeId, token]);

  // Generic form field change
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    console.log(`✏️ Field changed: ${name} = ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "", global: "" }));
  };

  // Validate required fields
  const validateForm = () => {
    console.log(" Validating form...");
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = "Job title is required.";
    if (!formData.jobDescription.trim()) errs.jobDescription = "Job description is required.";
    const lastDate = formData.lastDate ? new Date(formData.lastDate) : null;
    const interviewDate = formData.interviewDate ? new Date(formData.interviewDate) : null;

    if (lastDate && interviewDate && lastDate > interviewDate) {
      errs.lastDate = "Application deadline must be before interview date.";
      errs.interviewDate = "Interview date must be after application deadline.";
    }

    if (Object.keys(errs).length) {
      console.warn("⚠️ Validation errors:", errs);
      toast.warn("Please fix the highlighted errors.");
    } else {
      console.log(" Validation passed.");
    }

    return errs;
  };

  // Analyze job description
  const doAnalysis = async (desc: string, skills: string[]): Promise<AnalysisResult> => {
    console.log("Running job description analysis...");
    const resp = await fetch(`${process.env.REACT_APP_AI_URL}/analyze_job_description`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_description: desc }),
    });

    const json = await resp.json();
    console.log("AI JD Analysis response:", json);

    if (!json.required_skills) throw new Error("No skills extracted");

    const missing = getMissingSkillsFuzzy(json.required_skills, skills);
    return {
      required_skills: json.required_skills.map(capitalize),
      missing_skills: missing.map(capitalize),
    };
  };


  // Handle analyze click
  const handleAnalyze = async () => {
    console.log(" Analyze button clicked.");
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      setSubmitting(true);
      const result = await doAnalysis(formData.jobDescription, resumeSkills);
      console.log(" Analysis completed:", result);
      toast.success("Analysis completed successfully.");
      setAnalysis(result);
    } catch (err) {
      logError("handleAnalyze", err);
      toast.error("Analysis failed. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    console.log("💾 Submitting application...");
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        analysisResult: analysis,
        resumeUsed: selectedResumeId !== "None" ? selectedResumeId : undefined,
      };
      console.log("📦 Payload:", payload);
      await api.post("/api/applications", payload, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Application saved.");
      console.log(" Application saved.");
      setFormData(defaultForm);
      setAnalysis(null);
      const res = await api.get("/api/applications", { headers: { Authorization: `Bearer ${token}` } });
      setApplications(res.data);
    } catch (err) {
      logError("handleSubmit", err);
      toast.error("Failed to save application.");
      setErrors(prev => ({ ...prev, global: "Save failed. Check console." }));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle deletion & status update
  const handleDelete = async (id: string) => {
    console.log(`🗑 Attempting to delete application: ${id}`);
    if (!confirm("Delete this application?")) return;
    try {
      await api.delete(`/api/applications/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Application deleted.");
      setApplications(prev => prev.filter(a => a._id !== id));
      console.log(` Application ${id} deleted.`);
    } catch (err) {
      logError("handleDelete", err);
      toast.error("Delete failed.");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    console.log(`🔄 Updating status for ${id} to ${newStatus}`);
    try {
      await api.put(`/api/applications/${id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Status updated to ${newStatus}`);
      setApplications(prev => prev.map(a => (a._id === id ? { ...a, status: newStatus } : a)));
      console.log(` Status for ${id} updated to ${newStatus}`);
    } catch (err) {
      logError("handleStatusUpdate", err);
      toast.error("Failed to update status.");
      setCardErrors(prev => ({ ...prev, [id]: "Status update failed." }));
    }
  };

  //  Recommend best resume
  const handleRecommend = async () => {
    if (!analysis) return;
    console.log(" Recommending best resume...");
    setRecommending(true);
    setRecommendResult(null);

    let best = { rid: "None", score: 0 };

    for (const r of resumes) {
      try {
        const resp = await getSkillsForResume(r._id, token!);
        const skills = resp.data?.[0]?.skills || [];
        console.log(`📄 Resume ${r.filename} skills:`, skills);

        // Save for analysis display
        setResumeSkillsMap(prev => ({ ...prev, [r._id]: skills }));

        const score = scoreResumeSkills(analysis.required_skills, skills);
        console.log(`Score for ${r.filename}: ${score}`);
        if (score > best.score) {
          best = { rid: r._id, score };
        }
      } catch (err) {
        logError("handleRecommend > resume loop", err);
      }
    }

    if (best.rid !== "None") {
      const bestResume = resumes.find(r => r._id === best.rid);
      const filename = bestResume?.filename || "Unknown";
      console.log(`🏆 Best resume: ${filename} with score ${best.score}`);
      toast.success(`Best resume: ${filename} (score ${best.score})`);

      setSelectedResumeId(best.rid);
      setResumeSkills(resumeSkillsMap[best.rid] || []);
      setRecommendResult({ rid: best.rid, filename, score: best.score });
    } else {
      setRecommendResult(null);
      toast.error("No suitable resume found.");
      console.warn("⚠️ No suitable resume found.");
    }
    setRecommending(false);
  };

  // ⏰ Calendar sync via googleCalendarLink
  const handleSetReminder = () => {
    console.log("⏰ Setting Google Calendar reminder...");
    const dateStr = formData.interviewDate || formData.lastDate;
    if (!dateStr) {
      toast.error("No reminder date available.");
      console.warn("⚠️ No reminder date available.");
      return;
    }
    const dt = new Date(dateStr).toISOString().replace(/[-:]|\.\d{3}/g, "");
    const title = encodeURIComponent(formData.title || "Job Application Reminder");
    const details = encodeURIComponent("Follow up on job application.");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dt}/${dt}&details=${details}`;
    console.log(`🔗 Opening calendar link: ${url}`);
    window.open(url, "_blank");
  };

  // Apply filter:
  const filteredApps = applications
    .filter(app => statusFilter === "All" || app.status === statusFilter)
    .filter(app =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.experience?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );

  const toggleMoreDetails = (id: string) => {
    console.log(` Toggling details for application ${id}`);
    setShowAllDetailsMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }


  return (
    
    <div className="min-h-screen py-10 px-4">
      
      <section className="bg-white p-8 rounded-xl shadow-lg space-y-6">
        {errors.global && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.global}
          </div>
        )}
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-3xl font-bold text-indigo-800">📋 Add Job Application</h2>
          <Tooltip content="Fill in job details, choose a resume, and run skill analysis">
            <span className="w-6 h-6 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">i</span>
          </Tooltip>
        </div>
       {/* 📄 Application Form Fields */}
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
                  {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  name={name}
                  type={type}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className={`mt-1 w-full px-4 py-2 rounded-lg border text-sm focus:outline-none transition focus:ring-2 ring-indigo-400 ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors[name] && (
                  <p className="text-xs text-red-600 mt-1">{errors[name]}</p>
                )}
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
            {errors.jobDescription && (
              <p className="text-xs text-red-600 mt-1">{errors.jobDescription}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Resume
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
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

        

        {/* Action buttons */}

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {[
            {
              label: recommending ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  Recommending…
                </>
              ) : (
                "Recommend Best Resume"
              ),
              onClick: handleRecommend,
              disabled: !analysis || submitting || recommending,
              color: "bg-indigo-600 hover:bg-indigo-700",
            },
            {
              label: "Set Reminder in Google Calendar",
              onClick: handleSetReminder,
              disabled: submitting,
              color: "bg-orange-500 hover:bg-orange-600",
            },
            {
              label: "Analyze",
              onClick: handleAnalyze,
              disabled: submitting || loadingSkills,
              color: "bg-purple-600 hover:bg-purple-700",
            },
            {
              label: "Clear Analyze",
              onClick: () => setAnalysis(null),
              disabled: submitting,
              color: "bg-yellow-500 hover:bg-yellow-600",
            },
            {
              label: submitting ? "Saving…" : "Save",
              onClick: handleSubmit,
              disabled: submitting,
              color: "bg-green-600 hover:bg-green-700",
            },
            {
              label: "Reset Form",
              onClick: () => {
                setFormData(defaultForm);
                setAnalysis(null);
              },
              disabled: submitting,
              color: "bg-blue-600 hover:bg-blue-700",
            },
          ].map(({ label, onClick, disabled, color }, i) => (
            <button
              key={i}
              onClick={onClick}
              disabled={disabled}
              className={`px-4 py-2 rounded-full text-white text-sm shadow transition ${color} disabled:opacity-50 flex items-center gap-1`}
            >
              {label}
            </button>
          ))}
        </div>


        {analysis && (
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
        )}



        {recommendResult && (
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
        )}



      </section>

      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {["All", ...statusOptions].map((status) => (
          <button
            key={status}
            className={`px-4 py-1.5 text-sm rounded-full border font-medium transition ${
              statusFilter === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>


      {/* Search input */}
      <input
        type="text"
        placeholder=" Search saved applications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 ring-indigo-400 text-sm shadow"
      />


        {/* ... Saved Applications ... */}
        
        <section className="space-y-8">
          <br />
          <h2 className="text-2xl font-semibold text-center text-indigo-800">📂 Saved Applications</h2>

          {filteredApps.length === 0 ? (
            <p className="text-center text-gray-500 italic">No applications found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => (
                <div key={app._id} className="bg-white p-6 rounded-2xl shadow-md space-y-4 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-700">{app.title}</h3>
                      <p className="text-sm text-gray-600">📍 {app.location}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-500">{app.status}</p>
                  </div>

                  <button
                    onClick={() => setExpandedApps(prev => ({ ...prev, [app._id]: !prev[app._id] }))}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    {expandedApps[app._id] ? "Hide Details ▲" : "Show Details ▼"}
                  </button>

                  {expandedApps[app._id] && (
                    <div className="space-y-3 text-sm text-gray-700">
                      {app.experience && <p>💼 {app.experience}</p>}

                      {app.jobDescription ? (
                        showAllDetailsMap[app._id] ? (
                          <p className="whitespace-pre-wrap">{app.jobDescription}</p>
                        ) : (
                          <p className="line-clamp-3">{app.jobDescription}</p>
                        )
                      ) : (
                        <p className="italic text-gray-400">No description</p>
                      )}

                      <button
                        onClick={() => toggleMoreDetails(app._id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {showAllDetailsMap[app._id] ? "Less..." : "More..."}
                      </button>

                      {showAllDetailsMap[app._id] && (
                        <div className="border-t pt-2 space-y-1">
                          {app.portal && (
                            <p>
                              🌐 <strong>Portal:</strong>{" "}
                              <a href={app.portal} target="_blank" rel="noopener noreferrer"
                                className="text-blue-600 underline">
                                {app.portal}
                              </a>
                            </p>
                          )}
                          {app.interviewProcess && <p>🧪 <strong>Interview Process:</strong> {app.interviewProcess}</p>}
                          {app.lastDate && (
                            <p>📅 <strong>Deadline:</strong> {new Date(app.lastDate).toLocaleDateString()}</p>
                          )}
                          {app.interviewDate && (
                            <p>🗓️ <strong>Interview:</strong> {new Date(app.interviewDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <select
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 ring-indigo-400"
                      value={app.resumeUsed || "None"}
                      disabled={submitting}
                      onChange={async (e) => {
                        const rid = e.target.value;
                        const skills = rid === "None"
                          ? []
                          : (await getSkillsForResume(rid, token!)).data?.[0]?.skills || [];
                        setResumeSkillsMap(prev => ({ ...prev, [rid]: skills }));
                        const result = app.jobDescription && skills.length
                          ? await doAnalysis(app.jobDescription, skills).catch(() => null)
                          : null;
                        const updated = { ...app, resumeUsed: rid, analysisResult: result };
                        await api.put(`/api/applications/${app._id}`, updated, { headers: { Authorization: `Bearer ${token}` } });
                        setApplications(prev => prev.map(a => a._id === app._id ? updated : a));
                      }}
                    >
                      <option value="None">None</option>
                      {resumes.map((r) => (
                        <option key={r._id} value={r._id}>{r.filename}</option>
                      ))}
                    </select>

                    <select
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 ring-indigo-400"
                      value={app.status}
                      disabled={submitting}
                      onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-purple-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-purple-700"
                        disabled={submitting}
                        onClick={async () => {
                          const skills = app.resumeUsed === "None"
                            ? []
                            : (await getSkillsForResume(app.resumeUsed!, token!)).data?.[0]?.skills || [];
                          setResumeSkillsMap(prev => ({ ...prev, [app.resumeUsed!]: skills }));
                          const result = app.jobDescription
                            ? await doAnalysis(app.jobDescription, skills).catch(() => null)
                            : null;
                          const updated = { ...app, analysisResult: result };
                          await api.put(`/api/applications/${app._id}`, updated, { headers: { Authorization: `Bearer ${token}` } });
                          setApplications(prev => prev.map(a => a._id === app._id ? updated : a));
                        }}
                      >
                        Analyze
                      </button>
                      <button
                        className="flex-1 bg-yellow-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-yellow-600"
                        disabled={submitting}
                        onClick={async () => {
                          const updated = { ...app, analysisResult: null };
                          await api.put(`/api/applications/${app._id}`, updated, { headers: { Authorization: `Bearer ${token}` } });
                          setApplications(prev => prev.map(a => a._id === app._id ? updated : a));
                        }}
                      >
                        Clear
                      </button>
                    </div>

                    {cardErrors[app._id] && (
                      <p className="text-xs text-red-600">{cardErrors[app._id]}</p>
                    )}

                    {app.analysisResult ? (
                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 space-y-1 text-sm">
                        <p><strong>Required:</strong> {app.analysisResult.required_skills.join(", ")}</p>
                        <p><strong className="text-red-600">Missing:</strong> {app.analysisResult.missing_skills.join(", ") || "None"}</p>
                        <div>
                          <strong className="text-green-700">Resume Skills:</strong>
                          {resumeSkillsMap[app.resumeUsed || ""]?.length ? (
                            <ul className="list-disc list-inside text-sm text-gray-700">
                              {resumeSkillsMap[app.resumeUsed!].map((skill, i) => {
                                const norm = skill.trim().toLowerCase();
                                const reqs = app.analysisResult?.required_skills.map(s => s.trim().toLowerCase()) || [];
                                const matched = reqs.includes(norm);
                                return <li key={i} className={matched ? "line-through text-gray-500" : ""}>{skill}</li>;
                              })}
                            </ul>
                          ) : (
                            <p className="italic text-gray-400">None</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No analysis data</p>
                    )}

                    <button
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg mt-2"
                      disabled={submitting}
                      onClick={() => handleDelete(app._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        </div>
  );
};

export default ApplicationForm;
