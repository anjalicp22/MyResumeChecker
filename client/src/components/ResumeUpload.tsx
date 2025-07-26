import React, { useRef, useState } from "react";
import { uploadResume } from "../services/resumeService.ts";
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
      // alert("Upload successful");
      
      toast.success("Resume uploaded successfully!");
      // Reset file input
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload resume.");
      // alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="border rounded px-3 py-2 w-full sm:w-auto"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;
