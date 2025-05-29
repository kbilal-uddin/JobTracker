import React, { useState } from "react";

export function StatusDropdown({ currentStatus, onChange }) {
    const [status, setStatus] = useState(currentStatus);

    const statuses = [
        "Applied",
        "Phone Screen",
        "Interview Scheduled",
        "Technical Interview",
        "Onsite Interview",
        "Offer Received",
        "Resume Rejected",
        "Rejected",
        "Accepted",
        "Withdrawn",
        "Hired"
    ];

    const handleChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        onChange?.(newStatus);
    };

    return (
        <select
            className="border px-2 py-1 rounded text-sm"
            value={status}
            onChange={handleChange}
        >
            {statuses.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                    {statusOption}
                </option>
            ))}
        </select>
    );
}


