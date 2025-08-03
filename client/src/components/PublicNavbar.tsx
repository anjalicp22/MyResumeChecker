// src/components/PublicNavbar.tsx
import { Link } from 'react-router-dom';

const PublicNavbar = () => (
  <nav className="bg-white shadow-md py-4 px-4 sm:px-6 rounded-xl w-full">
    <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
      {/* Logo */}
      <h1 className="font-bold text-2xl text-indigo-600">
        <Link to="/">MyResumeChecker</Link>
      </h1>

      {/* Nav Links */}
      <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 sm:gap-6 text-gray-700 font-medium w-full sm:w-auto">
        <Link to="/" className="hover:text-indigo-500 transition">
          Home
        </Link>
        <Link
          to="/login"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-indigo-600 hover:text-indigo-800 transition"
        >
          Register
        </Link>
      </div>
    </div>
  </nav>
);

export default PublicNavbar;
