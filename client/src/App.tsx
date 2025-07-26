// src/App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.tsx';

import Navbar from './components/Navbar.tsx';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import ErrorBoundary from './routes/ErrorBoundary.tsx';

import Home from './pages/Home.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Resume from './pages/Resume.tsx';
import Skills from './pages/Skills.tsx';
import Applications from './pages/ApplicationForm.tsx';
import Profile from './pages/Profile.tsx';
import TodoPage from './pages/Todo.tsx';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const { loading } = useAuth();
  const location = useLocation(); // 👈 detect current route

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading...</div>;
  }

  const isFullWidth = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-indigo-50 to-purple-100 text-gray-800">
      <Navbar />
      
      {/* Main content container */}
      <main
        className={`pt-24 pb-12 transition-all duration-300 ${
          isFullWidth ? 'w-full px-0' : 'max-w-5xl mx-auto px-4'
        }`}
      >
        <ErrorBoundary>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
