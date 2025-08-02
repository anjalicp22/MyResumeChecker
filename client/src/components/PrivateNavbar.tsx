// src/components/PrivateNavbar.tsx

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateNavbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug user data when component mounts or user changes
  useEffect(() => {
    console.log("👤 [PrivateNavbar] User object:", user);
    if (user?.profilePicture) {
      console.log("🖼️ [PrivateNavbar] Profile picture path from context:", user.profilePicture);
      console.log("🌐 [PrivateNavbar] Full image URL:", `${process.env.REACT_APP_API_URL}${user.profilePicture}?t=${Date.now()}`);
    } else {
      console.log("🧍 [PrivateNavbar] No profile picture, default avatar used.");
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const profileImageUrl = user?.profilePicture
    ? `${process.env.REACT_APP_API_URL}${user.profilePicture}?t=${Date.now()}`
    : '/default-avatar.jpg'; 

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center rounded-xl">
      <h1 className="font-bold text-2xl text-indigo-600 cursor-pointer pr-6">
        <Link to="/">MyResumeChecker</Link>
      </h1>

      <div className="flex items-center space-x-6 text-gray-700 font-semibold">
        <Link to="/" className="hover:text-indigo-500 transition">Home</Link>
        <Link to="/dashboard" className="hover:text-indigo-500 transition">Dashboard</Link>
        <Link to="/resume" className="hover:text-indigo-500 transition">Resume</Link>
        <Link to="/skills" className="hover:text-indigo-500 transition">Skills</Link>
        <Link to="/applications" className="hover:text-indigo-500 transition">Applications</Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition focus:outline-none"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
              onError={() => console.warn("Image failed to load:", profileImageUrl)}
              onLoad={() => console.log("Image loaded:", profileImageUrl)}
            />
            <span>Hello, {user?.name || 'User'}</span>
            <svg
              className={`w-4 h-4 transform transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-20">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PrivateNavbar;
