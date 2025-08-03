// client/src/pages/Resume.tsx
import React, { useEffect, useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getResumes } from "../services/resumeService";
import { useNavigate } from "react-router-dom";
import SkillList from "../components/SkillList";
import { saveAnalyzedSkills } from "../services/skillService";
import { toast } from "react-toastify";
import Tooltip from "../components/Tooltip";

interface Resume {
  _id: string;
  filename: string;
  uploadedAt: string;
  path: string;
}

const Resume = () => {
  const { token } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const fetchResumes = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getResumes(token);
      setResumes(res.data);
    } catch (err) {
      console.error("[Resume] Failed to load resumes:", err);
      setError("Failed to load resumes.");
      toast.error("Failed to load resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.warning("You must be logged in to view resumes.");
      navigate("/", { replace: true });
      return;
    }
    fetchResumes();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.delete(`/api/resume/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted successfully.");
    } catch (err) {
      console.error("[Resume] Failed to delete resume:", err);
      toast.error("Failed to delete resume.");
    }
  };

  const handleAnalyze = async (resumePath: string, resumeId: string) => {
    setAnalyzing((prev) => ({ ...prev, [resumeId]: true }));

    try {
      const fileName = resumePath.split("/").pop();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/uploads/resume/${fileName}`);
      const blob = await response.blob();

      if (!response.ok) {
        toast.error("Resume file could not be fetched.");
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, fileName);

      const aiRes = await fetch(`${process.env.REACT_APP_AI_URL}/analyze-resume-file`, {
        method: "POST",
        body: formData,
      });

      const result = await aiRes.json();

      if (result.existing_skills && result.suggested_skills) {
        await saveAnalyzedSkills(
          { resumeId, existing_skills: result.existing_skills, suggested_skills: result.suggested_skills },
          token!
        );

        await fetchResumes();
        toast.success("Resume analyzed and skills saved.");
      } else {
        toast.error("Unexpected AI response format.");
      }
    } catch (err) {
      console.error("[Resume] AI Resume Analysis Failed:", err);
      toast.error("AI Resume Analysis Failed.");
    } finally {
      setAnalyzing((prev) => ({ ...prev, [resumeId]: false }));
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
          Resume Manager
          <Tooltip content="Upload and manage your resumes">
            <span className="w-5 h-5 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">
              i
            </span>
          </Tooltip>
        </h2>

        {/* Upload Section */}
        <section className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <h3 className="text-2xl font-semibold text-indigo-700">📤 Upload Resume</h3>
            <Tooltip content="Upload a new resume to analyze it for skills">
              <span className="w-5 h-5 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">
                i
              </span>
            </Tooltip>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-wrap w-full">
            <ResumeUpload onUploadSuccess={fetchResumes} />
          </div>
        </section>

        {/* Uploaded Resumes */}
        <section className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <h3 className="text-2xl font-semibold text-indigo-700">📂 Your Uploaded Resumes</h3>
            <Tooltip content="View, analyze, or delete your uploaded resumes">
              <span className="w-5 h-5 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">
                i
              </span>
            </Tooltip>
          </div>

          {loading && <p className="text-indigo-500">Loading resumes...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && resumes.length === 0 && (
            <p className="text-gray-600">No resumes uploaded yet.</p>
          )}

          {!loading && resumes.length > 0 && (
            <ul className="space-y-6">
              {resumes.map(({ _id, filename, uploadedAt, path }) => (
                <li key={_id} className="p-4 bg-indigo-50 rounded-xl shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4">
                    <div>
                      <p className="font-semibold text-indigo-800 truncate max-w-[250px] sm:max-w-none">{filename}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Uploaded: {new Date(uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                      <Tooltip content="View resume in new tab">
                        <a
                          href={`${process.env.REACT_APP_API_URL}${path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-medium hover:bg-indigo-200 transition"
                        >
                          View
                        </a>
                      </Tooltip>

                      <Tooltip content="Analyze resume for skills">
                        <button
                          onClick={() => handleAnalyze(path, _id)}
                          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                            analyzing[_id]
                              ? "bg-purple-300 text-white cursor-not-allowed"
                              : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          }`}
                          disabled={analyzing[_id]}
                        >
                          {analyzing[_id] ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                              </svg>
                              Analyzing...
                            </>
                          ) : (
                            "Analyze"
                          )}
                        </button>
                      </Tooltip>

                      <Tooltip content="Delete this resume">
                        <button
                          onClick={() => handleDelete(_id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* 🔄 Using SkillList */}
                  <SkillList resumeId={_id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Resume;
