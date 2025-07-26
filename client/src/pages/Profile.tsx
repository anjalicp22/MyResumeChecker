// client/src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../services/api.ts';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
  const { login, token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const response = await api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          password: '',
        });

        setPreviewUrl(
          user.profilePicture
            ? `http://localhost:5000${user.profilePicture}`
            : null
        );
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Failed to load profile.');
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);
      if (profilePicture) data.append('profilePicture', profilePicture);

      const response = await api.put('/api/user/profile', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Profile updated successfully.');
      const updatedUser = response.data;

      if (token) {
        login(updatedUser, token);
      }

      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        password: '',
      });

      setPreviewUrl(
        updatedUser.profilePicture
          ? `http://localhost:5000${updatedUser.profilePicture}`
          : null
      );
    } catch (err) {
      console.error('Profile update failed:', err);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center p-6 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6  min-h-screen">
      <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">My Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold mb-2 text-gray-700">
              Profile Picture
            </label>
            <div className="relative w-28 h-28">
              <img
                src={previewUrl || '/default-avatar.jpg'}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow-md transition hover:scale-105 hover:brightness-110"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-3 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password w/ toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="mt-1 w-full border border-gray-300 px-3 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-9 right-3 text-sm text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
