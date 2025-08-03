// src/components/PrivateNavbar.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateNavbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const profileUrl = user?.profilePicture
    ? `${process.env.REACT_APP_API_URL}${user.profilePicture}?t=${Date.now()}`
    : "/default-avatar.jpg";

  return (
    <nav className="bg-white shadow-md py-4 px-4 sm:px-6 rounded-xl w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          MyResumeChecker
        </Link>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center sm:justify-end">
          {["Home", "Dashboard", "Resume", "Skills", "Applications"].map((label, idx) => (
            <Link key={idx} to={`/${label.toLowerCase()}`} className="hover:text-indigo-500 transition">
              {label}
            </Link>
          ))}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition focus:outline-none"
            >
              <img src={profileUrl} alt="Profile" className="w-8 h-8 rounded-full border-gray-300 border" />
              <span>Hello, {user?.name || "User"}</span>
              <svg className={`w-4 h-4 transform transition-transform ${open ? "rotate-180" : ""}`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-indigo-100">
                  Profile
                </Link>
                <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PrivateNavbar;
