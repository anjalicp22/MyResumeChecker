// src/components/PublicNavbar.tsx
import { Link } from 'react-router-dom';

const PublicNavbar = () => (
  <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center rounded-xl">
    <h1 className="font-bold text-2xl text-indigo-600 cursor-pointer pr-6">
      <Link to="/">JobTracker</Link>
    </h1>

    <div className="flex items-center space-x-6 text-gray-700 font-semibold">
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
        className="text-indigo-600 hover:text-indigo-800 transition font-semibold"
      >
        Register
      </Link>
    </div>
  </nav>
);

export default PublicNavbar;
