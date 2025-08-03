//client\src\components\ResumeUpload.tsx
import React, { useRef, useState } from "react";
import { uploadResume } from "../services/resumeService";
import { toast } from "react-toastify";

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploading(true);
      const res = await uploadResume(formData);
      onUploadSuccess?.();
      console.log("Upload success:", res.data);
      toast.success("Resume uploaded successfully!");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center sm:items-stretch gap-3 sm:gap-4 w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="w-full sm:w-auto flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded disabled:opacity-50 transition"
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;
