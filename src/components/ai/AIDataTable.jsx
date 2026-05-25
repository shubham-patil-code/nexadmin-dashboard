import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import AIStatusBadge from "../common/AIStatusBadge";

const statusMap = {
  completed: "active",
  processing: "processing",
  pending: "idle",
  warning: "warning",
};

const AIDataTable = ({ rows = [], showHospitalLink = true }) => {
  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="ai-table min-w-[640px]">
        <thead>
          <tr>
            <th>Patient / Record</th>
            <th>Detail</th>
            <th>Status</th>
            <th>Confidence</th>
            {showHospitalLink && <th>Hospital</th>}
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="ai-table-primary">{row.patient}</td>
              <td>{row.detail}</td>
              <td>
                <AIStatusBadge status={statusMap[row.status] || "idle"} label={row.status} />
              </td>
              <td>
                <span className="text-brand-600 font-semibold">{row.confidence}%</span>
              </td>
              {showHospitalLink && (
                <td>
                  <Link
                    to={row.linkedModule}
                    className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-xs font-medium"
                  >
                    Open <ExternalLink size={12} />
                  </Link>
                </td>
              )}
              <td className="text-slate-400 text-xs">{row.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AIDataTable;
