// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../services/authService.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { toast } from "react-toastify";
import Tooltip from "../components/Tooltip.tsx";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    console.log("[Login] Component mounted");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("📤 Submitting login form…", { emailMasked: email.replace(/(.{2}).+(@.+)/, "$1***$2") });

    try {
      const res = await loginApi({ email, password });
      const { token, ...userData } = res.data;

      login(userData, token);
      toast.success(`Welcome, ${userData.name || "User"}!`);
      navigate("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-300">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md transition-all duration-300">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 cursor-help">
            Sign In
        </h2>
        

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center cursor-help animate-shake">
              {error}
          </div>
          
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
            <div className="cursor-help">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="e.g. anjali@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 ring-indigo-400 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          

          
            <div className="relative cursor-help">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 ring-indigo-400">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex-grow px-4 py-2 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-gray-500 px-3 hover:text-indigo-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

          

          
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 mt-4 rounded-lg font-semibold shadow transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          
            <span className="cursor-help">
              No account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:underline"
                onClick={() => toast.info("Redirecting to registration…")}
              >
                Register →
              </Link>
            </span>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
