// client/src/pages/Dashboard.tsx

import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import useTasks, { Task } from "../services/useTasks";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { toast } from "react-toastify";
import Tooltip from "../components/Tooltip";

interface Application {
  _id: string;
  company: string;
  title?: string;
  status: string;
  lastDate: string;
  interviewDate?: string;
}

interface Resume {
  _id: string;
  filename: string;
  uploadedAt: string;
  path: string;
}

interface AnalysisResult {
  existing_skills: string[];
  suggested_skills: string[];
}

const suggestedTasks = [
  "Update your resume",
  "Practice common interview questions",
  "Research companies you're applying to",
];

const Dashboard: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    toast.warn("Please log in to access the dashboard.");
    return <Navigate to="/" replace />;
  }

  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const { tasks, addTask, toggleTask } = useTasks();
  const [newTask, setNewTask] = useState("");
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});

  useEffect(() => {
    let ignore = false;
    const fetchApps = async () => {
      try {
        const res = await api.get("/api/applications");
        if (!ignore) setApplications(res.data);
      } catch {
        toast.error("Failed to load applications.");
      }
    };
    const fetchResumes = async () => {
      try {
        const res = await api.get("/api/resume", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!ignore) setResumes(res.data);
      } catch {
        toast.error("Failed to load resumes.");
      }
    };
    fetchApps();
    fetchResumes();
    return () => { ignore = true; };
  }, [token]);

  const calendarEvents: EventInput[] = applications.flatMap((app) => {
    const events: EventInput[] = [];
    if (app.lastDate) {
      events.push({
        id: `${app._id}-deadline`,
        title: `📅 Deadline: ${app.company || app.title}`,
        start: app.lastDate,
      });
    }
    if (app.interviewDate) {
      events.push({
        id: `${app._id}-interview`,
        title: `🎙️ Interview: ${app.company || app.title}`,
        start: app.interviewDate,
      });
    }
    return events;
  });

  const handleAddTask = () => {
    const t = newTask.trim();
    if (!t) return;
    addTask(t);
    toast.success(`Task added: "${t}"`);
    setNewTask("");
  };
  // `${process.env.REACT_APP_API_URL}${path}`

  const handleAnalyze = async (resumePath: string, resumeId: string) => {
    toast.info("Analyzing resume…");
    try {
      const fname = resumePath.split("/").pop()!;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/uploads/resume/${fname}`);
      const blob = await res.blob();
      const fd = new FormData();
      fd.append("file", blob, fname);

      const ai = await fetch(`${process.env.REACT_APP_AI_URL}/analyze-resume-file`, {
        method: "POST",
        body: fd,
      });

      const result = await ai.json();
      if (result.existing_skills && result.suggested_skills) {
        setAnalysisResults(prev => ({ ...prev, [resumeId]: result }));
        toast.success("Analysis complete!");
      } else {
        throw new Error("Invalid AI response");
      }
    } catch {
      toast.error("Failed to analyze resume.");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-[1100px] mx-auto w-full">

      <h2 className="text-3xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
        Dashboard
        <Tooltip content="Your central hub for job-tracking">
          <span className="w-6 h-6 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">i</span>
        </Tooltip>
      </h2>

      {/* Calendar */}
      <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700">📅 Calendar Overview</h3>
          <Tooltip content="Shows deadlines and interview dates">
            <span className="w-6 h-6 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
          </Tooltip>
        </div>
        <div className="overflow-x-auto">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            height="auto"
            contentHeight={350}
            aspectRatio={1.8}
            eventClick={(info) => {
              const app = applications.find(a => info.event.id?.startsWith(a._id));
              if (app) {
                toast.info(
                  <>
                    <strong>{app.company || app.title}</strong><br />
                    Deadline: {app.lastDate || "N/A"}<br />
                    Interview: {app.interviewDate || "N/A"}
                  </>
                );
              }
            }}
            eventDidMount={(info) => info.el.setAttribute("title", info.event.title || "")}
            dayMaxEventRows={2}
          />
        </div>
      </section>

      {/* To-Do List */}
       <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700">📝 To-Do List</h3>
          <Tooltip content="Track tasks easily">
            <span className="w-6 h-6 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
          </Tooltip>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-grow border border-indigo-300 px-4 py-2 rounded-lg focus:ring-2 ring-indigo-400 transition"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
          <Tooltip content="Add this task">
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
              Add
            </button>
          </Tooltip>
        </div>
        <ul className="space-y-2 max-h-48 overflow-auto">
          {tasks.length === 0 ? (
            <p className="text-gray-600">No tasks yet</p>
          ) : (
            tasks.map((t: Task) => (
              <li
                key={t._id}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  toggleTask(t._id);
                  toast.info(`Task "${t.text}" ${t.done ? "marked incomplete" : "complete"}`);
                }}
              >
                <input type="checkbox" checked={t.done} readOnly className="accent-indigo-600" />
                <span className={`${t.done ? "line-through text-gray-400" : "text-indigo-800"}`}>
                  {t.text}
                </span>
              </li>
            ))
          )}
        </ul>
        <div className="mt-4 flex justify-end">
          <Tooltip content="Go to full To‑Do page">
            <Link to="/todo" className="text-indigo-600 hover:underline font-medium">
              Manage All Tasks →
            </Link>
          </Tooltip>
        </div>
      </section>

      {/* Resumes */}
       <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700">📂 Resumes</h3>
          <Tooltip content="Upload, view, or analyze resumes">
            <span className="w-6 h-6 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
          </Tooltip>
        </div>
        {resumes.length === 0 ? (
          <p className="text-gray-600">No resumes uploaded yet.</p>
        ) : (
          <ul className="space-y-6">
            {resumes.slice(0, 2).map(({ _id, filename, uploadedAt, path }) => (
              <li key={_id} className="p-4 bg-indigo-50 rounded-xl shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="font-semibold text-indigo-800">{filename}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Uploaded: {new Date(uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Tooltip content="View resume in new tab">
                      <a href={`${process.env.REACT_APP_API_URL}${path}`} target="_blank" rel="noreferrer"
                         className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-medium hover:bg-indigo-200 transition">
                        View
                      </a>
                    </Tooltip>
                    <Tooltip content="Analyze resume for skills">
                      <button
                        onClick={() => handleAnalyze(path, _id)}
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 transition"
                      >
                        Analyze
                      </button>
                    </Tooltip>
                  </div>
                </div>
                {analysisResults[_id] && (
                  <div className="mt-3 p-4 bg-white rounded-lg border text-sm">
                    <p className="font-semibold text-indigo-800">Skills Found:</p>
                    <p className="text-gray-700 mb-2">{analysisResults[_id].existing_skills.join(", ")}</p>
                    <p className="font-semibold text-indigo-800">🔮 Suggested Skills:</p>
                    <p className="text-gray-700">{analysisResults[_id].suggested_skills.join(", ")}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <Tooltip content="Go to full Resume Manager">
            <Link to="/resume" className="text-indigo-600 hover:underline font-medium">
              Manage All Resumes →
            </Link>
          </Tooltip>
        </div>
      </section>

      {/* Skill Suggestions */}
       <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700">💻 Skill Suggestions</h3>
          <Tooltip content="Get personalized recommendations">
            <span className="w-6 h-6 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
          </Tooltip>
        </div>
        <Tooltip content="Visit Skill Suggestions page">
          <Link to="/skills" className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
            View Suggestions
          </Link>
        </Tooltip>
      </section>

      {/* Quick Links */}
       <section className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700">🔗 Quick Links</h3>
          <Tooltip content="Navigate quickly">
            <span className="w-6 h-6 text-xs bg-indigo-800 text-white rounded-full inline-flex justify-center items-center cursor-default">?</span>
          </Tooltip>
        </div>
        <ul className="list-disc list-inside text-indigo-600 space-y-2">
          <li><Link to="/applications" className="hover:underline">Application Tracker</Link></li>
          <li><Link to="/profile" className="hover:underline">Profile</Link></li>
          <li><Link to="/calendar" className="hover:underline">Interview Calendar (Full)</Link></li>
          <li><Link to="/todo" className="hover:underline">To‑Do List (Full)</Link></li>
        </ul>
      </section>
      
      </div>
    </div>
  );
};

export default Dashboard;
