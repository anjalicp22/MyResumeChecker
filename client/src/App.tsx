// client/src/App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import ErrorBoundary from './routes/ErrorBoundary';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Resume from './pages/Resume';
import Skills from './pages/Skills';
import Applications from './pages/ApplicationForm';
import Profile from './pages/Profile';
import TodoPage from './pages/Todo';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg text-gray-600 animate-pulse">
        Loading your workspace...
      </div>
    );
  }

  const isFullWidth = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-white via-indigo-50 to-purple-100 text-gray-800">
    <Navbar />

      {/* Main page content wrapper */}
      <main
          className={`pt-24 pb-12 flex-grow transition-all duration-300 ${
            isFullWidth
              ? 'w-full px-4 sm:px-6'
              : 'max-w-7xl mx-auto w-full px-4 sm:px-6'
          }`}
        >
        <ErrorBoundary>
          {/* Global toaster */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="text-sm sm:text-base"
          />

          {/* Route definitions */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute children={undefined} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/todo" element={<TodoPage />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
