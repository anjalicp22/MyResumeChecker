// client/src/pages/Skills.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getSkillsForResume, getSkillFrequency } from "../services/skillService";
import { toast } from "react-toastify";
import { normalizeArray } from "../utils/skillnormalize";
import Tooltip from "../components/Tooltip";

type Resume = {
  _id: string;
  filename: string;
  path: string;
  uploadedAt: string;
};

type Application = {
  _id: string;
  company?: string;
  title?: string;
  analysisResult?: {
    required_skills: string[];
    missing_skills: string[];
  };
};

type SkillFrequency = { skill: string; count: number };

const COLORS = ["#4F46E5", "#EC4899"];

const Skills: React.FC = () => {
  const { token } = useAuth();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [existingSkills, setExistingSkills] = useState<string[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [topSkills, setTopSkills] = useState<SkillFrequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const normExisting = useMemo(() => new Set(normalizeArray(existingSkills)), [existingSkills]);
  const normRequired = useMemo(() => normalizeArray(requiredSkills), [requiredSkills]);
  const isResumeDisabled = (resumeId: string) => {
    return (
      resumeId === selectedResume &&
      existingSkills.length === 0 &&
      suggestedSkills.length === 0
    );
  };

  // Helper: App is disabled if it has no required skills
  const isAppDisabled = (app: Application) => {
    return !app.analysisResult?.required_skills?.length;
  };

  useEffect(() => {
    (async () => {
      if (!token) {
        toast.warning("You must be logged in to see skills.");
        setLoading(false);
        return;
      }

      try {
        const [res, apps] = await Promise.all([
          api.get("/api/resume", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/applications", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setResumes(res.data || []);
        setApplications(apps.data || []);

        if (res.data?.[0]?._id) setSelectedResume(res.data[0]._id);
        if (apps.data?.[0]?._id) setSelectedApp(apps.data[0]._id);

        try {
          const freqRes = await getSkillFrequency(token!);
          setTopSkills(
            (freqRes.data || []).map((d: any) => ({
              skill: d._id || d.skill,
              count: d.count || 0,
            }))
          );
        } catch {
          toast.error("Failed to load skill frequency.");
        }
      } catch {
        toast.error("Failed to load skills & applications.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!selectedResume || !token) return;
    (async () => {
      try {
        const resp = await getSkillsForResume(selectedResume, token);
        const skillEntries = resp.data || [];
        const existing = skillEntries.find((s: any) => s.source === "resume" && !s.isSuggested)?.skills || [];
        const suggested = skillEntries.find((s: any) => s.source === "resume" && s.isSuggested)?.skills || [];
        setExistingSkills(existing);
        setSuggestedSkills(suggested);
      } catch {
        toast.error("Failed to load resume skills.");
      }
    })();
  }, [selectedResume, token]);

  useEffect(() => {
    const app = applications.find((a) => a._id === selectedApp);
    if (!app?.analysisResult) {
      setMissingSkills([]);
      setRequiredSkills([]);
      return;
    }
    setMissingSkills(app.analysisResult.missing_skills || []);
    setRequiredSkills(app.analysisResult.required_skills || []);
  }, [applications, selectedApp]);

  const handleAnalyze = async () => {
    if (!selectedApp) return toast.warning("Please select an application first.");
    setAnalyzing(true);
    try {
      const app = applications.find((a) => a._id === selectedApp);
      if (!app?.analysisResult) return toast.info("No skill data for selected application.");
      const _required = normalizeArray(app.analysisResult.required_skills || []);
      const _missing = _required.filter((s) => !normExisting.has(s));
      setMissingSkills(_missing);
      toast.success("Skill gap analysis updated!");
    } catch {
      toast.error("Failed to analyze skill gaps");
    } finally {
      setAnalyzing(false);
    }
  };

  const matchStats = useMemo(() => {
    const req = normRequired.length;
    if (!req) return { matched: 0, missing: 0, pct: 0 };
    const matched = normRequired.filter((s) => normExisting.has(s)).length;
    const missing = req - matched;
    const pct = Math.round((matched / req) * 100);
    return { matched, missing, pct };
  }, [normRequired, normExisting]);

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading skills...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 space-y-8">
        <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-2">
          Skills
          <Tooltip content="Compare your resume with job skill requirements">
            <span className="w-6 h-6 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">i</span>
          </Tooltip>
        </h2>

        {/* Resume & Application Selection */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            Select Resume & Job Application
            <Tooltip content="Choose both to compare skills">
              <span className="w-5 h-5 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
            </Tooltip>
          </h3>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6">

            <div>
              <h4 className="font-medium text-gray-700 mb-2">📄 Your Resumes</h4>
              <div className="h-64 overflow-y-auto space-y-3 pr-2">
                {resumes.length === 0 ? (
                  <p className="text-gray-500 italic">📂 No resumes available.</p>
                ) : (
                  resumes.map((r) => {
                    const disabled = isResumeDisabled(r._id);
                    return (
                    <button
                      key={r._id}
                      onClick={() => {
                        if (disabled) {
                          toast.warning("Analyze resume and application first");
                          return;
                        }
                        setSelectedResume(r._id);
                      }}
                      disabled={disabled}
                      className={`w-full p-4 rounded-lg border text-left shadow-sm hover:shadow transition ${
                        selectedResume === r._id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"
                      }${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="font-medium break-words max-w-full">
                        {r.filename}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.uploadedAt).toLocaleDateString()}
                      </div>
                    </button>
                  )})
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">🏢 Job Applications</h4>
              <div className="h-64 overflow-y-auto space-y-3 pr-2">
                {applications.length === 0 ? (
                  <p className="text-gray-500 italic">📁 No applications available.</p>
                ) : (
                  applications.map((a) => {
                  const disabled = isAppDisabled(a);
                  return (
                    <button
                      key={a._id}
                      onClick={() => {
                      if (disabled) {
                        toast.warning("Analyze resume and application first");
                        return;
                      }setSelectedApp(a._id)}}
                      disabled={disabled}
                      className={`w-full p-4 rounded-lg border text-left shadow-sm hover:shadow transition ${
                        selectedApp === a._id ? "border-purple-600 bg-purple-50" : "border-gray-200 bg-white"
                      }${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="font-medium break-words max-w-full">{a.company || a.title || "Untitled Job"}</div>
                      <div className="text-xs text-gray-500">
                        Required: {a.analysisResult?.required_skills.length ?? 0}
                      </div>
                    </button>
                  )})
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {analyzing ? "Analyzing..." : "Analyze Skill Gap"}
              </button>
            
          </div>
        </section>

       {/* Resume Skills */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700">📄 Resume Skills</h3>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6">

            <div>
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                 Existing Skills
                <Tooltip content="Skills already present in your resume.">
                  <span className="w-4 h-4 text-xs bg-green-700 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
                </Tooltip>
              </h4>
              {existingSkills.length ? (
                <div className="flex flex-wrap gap-2">
                  {existingSkills.map((s, i) => (
                    <span key={i} className="px-2 py-1 text-sm rounded bg-green-50 text-green-700 border border-green-200">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">None</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                🔮 Suggested Skills
                <Tooltip content="Skills suggested to improve your resume.">
                  <span className="w-4 h-4 text-xs bg-purple-700 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
                </Tooltip>
              </h4>
              {suggestedSkills.length ? (
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((s, i) => (
                    <span key={i} className="px-2 py-1 text-sm rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">None</p>
              )}
            </div>
          </div>
        </section>

        {/* Application Skills */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700">🏢 Application Skills</h3>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6">

            <div>
              <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                📌 Required Skills
                <Tooltip content="Skills required for the job application.">
                  <span className="w-4 h-4 text-xs bg-blue-700 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
                </Tooltip>
              </h4>
              {requiredSkills.length ? (
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((s, i) => (
                    <span key={i} className="px-2 py-1 text-sm rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">None</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                Missing Skills
                <Tooltip content="Skills that are required by the job but missing in your resume.">
                  <span className="w-4 h-4 text-xs bg-red-700 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
                </Tooltip>
              </h4>
              {missingSkills.length ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((s, i) => (
                    <span key={i} className="px-2 py-1 text-sm rounded bg-red-50 text-red-700 border border-red-200">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">None</p>
              )}
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="flex flex-col md:grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center gap-2">
              🎯 Match vs Missing (%)
              <Tooltip content="Shows the percentage of required job skills your resume currently matches.">
                <span className="w-4 h-4 text-xs bg-indigo-700 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
              </Tooltip>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[
                      { name: "Matched", value: matchStats.matched },
                      { name: "Missing", value: matchStats.missing },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Overall match: <span className="font-semibold">{matchStats.pct}%</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center gap-2">
              🔝 Top Skill Frequency
              <Tooltip content="Shows the most frequently occurring skills across all your applications.">
                <span className="w-4 h-4 text-xs bg-indigo-700 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
              </Tooltip>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSkills}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" hide />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="count" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Skills;