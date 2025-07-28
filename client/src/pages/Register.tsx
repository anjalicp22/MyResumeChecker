// src/pages/Register.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    console.log("[Register] Component mounted");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("📤 Submitting registration form…", { name, email });

    try {
      const res = await registerApi({ name, email, password });
      console.log(" Registration successful", res.data);

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      console.error("Registration error:", err);
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-300">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md transition-all duration-300">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
          Create an Account
        </h2>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="e.g. Anjali Kumar"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 ring-indigo-400 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
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

          <div className="relative">
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
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 mt-2 rounded-lg font-semibold shadow transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline"
            onClick={() => {
              console.log("[Register] Navigate to Login clicked");
              toast.info("Redirecting to login…");
            }}
          >
            Login →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
