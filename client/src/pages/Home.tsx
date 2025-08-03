// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="pt-20 min-h-[85vh] px-6 w-full bg-gradient-to-b from-indigo-100 to-purple-100">
      <div className="max-w-6xl mx-auto text-center flex flex-col items-center">

        {/* Hero Section */}
        <motion.h1
          className="text-5xl sm:text-6xl font-black text-indigo-900 mb-4 tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to <span className="text-purple-700">AI Job Tracker</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-800 max-w-2xl mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Effortlessly manage your job hunt, enhance your resume with AI, and organize interviews like a pro.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-medium px-8 py-3 rounded-lg text-lg shadow-lg transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white border-2 border-indigo-700 text-indigo-700 hover:bg-indigo-50 font-medium px-8 py-3 rounded-lg text-lg shadow-lg transition"
            >
              Create an Account
            </Link>
          )}
        </motion.div>

        {/* Features */}
        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-6">🚀 Core Features</h2>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl text-left"
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <FeatureCard
            title="📊 Track Applications"
            description="Centralize your job applications, follow up deadlines, and never miss an interview again."
          />
          <FeatureCard
            title="🤖 AI-Powered Resume"
            description="Get intelligent resume feedback, optimize your skills, and boost your interview chances."
          />
          <FeatureCard
            title="🗓️ Smart Calendar"
            description="Visualize interviews, tasks and deadlines in a user-friendly and intuitive calendar."
          />
        </motion.div>

        {/* About Section */}
        <section className="mt-24 w-full max-w-6xl bg-white rounded-2xl shadow-xl px-6 py-12 sm:px-10 sm:py-16 text-left border border-gray-100">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            📖 About <span className="text-purple-700">AI Job Tracker</span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 max-w-4xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
          >
            <strong className="font-semibold text-indigo-800">AI Job Tracker</strong> is your all-in-one job search companion — built to help you stay focused, organized, and competitive in today’s fast-moving career landscape.
          </motion.p>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AboutCard
              icon="📁"
              title="Multiple Resumes"
              desc="Upload, manage, and compare different versions of your resume tailored for each job."
            />
            <AboutCard
              icon="🧠"
              title="AI Skill Analyzer"
              desc="Identify skill gaps and strengths using intelligent AI-powered insights."
            />
            <AboutCard
              icon="📅"
              title="Deadline & Interview Tracker"
              desc="Keep tabs on interviews, follow-ups, and application due dates with ease."
            />
            <AboutCard
              icon="📝"
              title="Personal To-Do"
              desc="Plan and prioritize your job search tasks with a built-in productivity system."
            />
            <AboutCard
              icon="📌"
              title="Job Description Matching"
              desc="Receive smart skill recommendations based on job listings you upload or bookmark."
            />
            <AboutCard
              icon="📊"
              title="Progress Insights"
              desc="Visualize your job search performance and identify improvement areas."
            />
          </motion.div>
        </section>
        <div className="h-20 sm:h-32" />
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
    <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{description}</p>
  </div>
);

const AboutCard = ({
      icon,
      title,
      desc,
    }: {
      icon: string;
      title: string;
      desc: string;
    }) => (
      <div className="bg-indigo-50 hover:bg-indigo-100 transition p-6 rounded-xl border border-indigo-100 shadow-md">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-xl font-semibold text-indigo-800 mb-1">{title}</h3>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{desc}</p>
      </div>
    );


export default Home;
