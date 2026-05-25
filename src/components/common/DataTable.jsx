import { Trash2 } from "lucide-react";

export default function DataTable({ columns, rows, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-gray-50 text-gray-500 uppercase text-sm font-semibold">
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left px-4 py-3 font-semibold">
                {col}
              </th>
            ))}
            <th className="text-left px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50/70">
              {columns.map((col) => (
                <td key={`${row.id}-${col}`} className="px-4 py-3 text-gray-700">
                  {String(row[col] ?? "")}
                </td>
              ))}
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                  onClick={() => onDelete(row.id)}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
