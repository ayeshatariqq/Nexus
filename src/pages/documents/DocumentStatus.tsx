import React, { useState } from "react";

type Status = "Draft" | "In Review" | "Signed";

interface DocumentStatusProps {
  initialStatus?: Status;
  onStatusChange?: (status: Status) => void;
}

const statusColors: Record<Status, string> = {
  Draft: "bg-gray-200 text-gray-700",
  "In Review": "bg-yellow-200 text-yellow-800",
  Signed: "bg-green-200 text-green-800",
};

const DocumentStatus: React.FC<DocumentStatusProps> = ({ initialStatus = "Draft", onStatusChange }) => {
  const [status, setStatus] = useState<Status>(initialStatus);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    setStatus(newStatus);
    if (onStatusChange) onStatusChange(newStatus);
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {status}
      </span>

      <select
        value={status}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="Draft">Draft</option>
        <option value="In Review">In Review</option>
        <option value="Signed">Signed</option>
      </select>
    </div>
  );
};

export default DocumentStatus;
