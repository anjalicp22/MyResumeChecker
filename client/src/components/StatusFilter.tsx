import React from "react";

interface Props {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  statusOptions: string[];
}

const StatusFilter: React.FC<Props> = ({ statusFilter, setStatusFilter, statusOptions }) => (
  <div className="flex flex-wrap justify-center gap-3 mt-10">
    {["All", ...statusOptions].map((status) => (
      <button
        key={status}
        className={`px-4 py-1.5 text-sm rounded-full border font-medium transition ${
          statusFilter === status
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
        onClick={() => setStatusFilter(status)}
      >
        {status}
      </button>
    ))}
  </div>
);

export default StatusFilter;
