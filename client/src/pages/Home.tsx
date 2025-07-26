// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.tsx";

const Home = () => {
  const { isAuthenticated, loading } = useAuth();  // <-- Must be inside component

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]  w-full px-6 text-center bg-gradient-to-b from-indigo-100 to-purple-100">
      {/* Hero Section */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-4 leading-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to <span className="text-purple-700">AI Job Tracker</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-700 max-w-xl mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Track your job applications, improve your resume with AI, and stay organized with a smart job search assistant.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/register"
            className="bg-white text-indigo-700 border border-indigo-600 px-6 py-3 rounded-lg text-lg shadow-md hover:bg-indigo-50 transition"
          >
            Create an Account
          </Link>
        )}
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        className="mt-16 grid gap-6 md:grid-cols-3 w-full max-w-none px-6 md:px-12 text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <FeatureCard
          title="📊 Track Applications"
          description="Keep all your job applications in one place and never miss deadlines or interviews."
        />
        <FeatureCard
          title="🤖 AI-Powered Resume"
          description="Analyze your resume and get AI-based suggestions to improve your chances of success."
        />
        <FeatureCard
          title="🗓️ Smart Calendar"
          description="Visualize your job hunt with an interactive calendar for interviews and deadlines."
        />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100">
    <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default Home;
