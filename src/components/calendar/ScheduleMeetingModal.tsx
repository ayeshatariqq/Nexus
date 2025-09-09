import React, { useState } from "react";
import { Button } from "../../components/ui/Button";

interface ScheduleMeetingModalProps {
  entrepreneur: {
    id: string; 
    entrepreneurId: string;
    entrepreneurName: string;
  };
  onClose: () => void;
  onSchedule: (meeting: {
    id: string;
    title: string;
    start: string;
    entrepreneurId: string;
    entrepreneurName: string;
  }) => void;
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  entrepreneur,
  onClose,
  onSchedule,
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = () => {
    if (!date || !time) return;

    const start = new Date(`${date}T${time}`);
    const meeting = {
      id: Date.now().toString(),
      title: `Meeting with ${entrepreneur.entrepreneurName}`,
      start: start.toISOString(), // ISO!
      entrepreneurId: entrepreneur.entrepreneurId,
      entrepreneurName: entrepreneur.entrepreneurName,
    };

    onSchedule(meeting);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">Schedule Meeting</h2>

        <label className="block mb-2 text-sm">
          Date
          <input
            type="date"
            className="w-full border p-2 rounded mt-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="block mb-4 text-sm">
          Time
          <input
            type="time"
            className="w-full border p-2 rounded mt-1"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;
