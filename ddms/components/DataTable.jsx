"use client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function DataTable({ columns = [], data = [], actions = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
            {actions.length > 0 && <th className="px-6 py-3"></th>}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr
              key={row._id || idx}
              className="hover:bg-gray-50 transition-colors"
            >
              {columns.map((col, cIdx) => {
                const key = col.toLowerCase();
                const value = row[key];

                return (
                  <td key={cIdx} className="px-6 py-4 text-sm text-gray-700">
                    {/* Handle Object Values (like product object) */}
                    {typeof value === "object" && value !== null
                      ? value.name || value._id || "Unknown"
                      : value || ""}
                  </td>
                );
              })}

              {actions.length > 0 && (
                <td className="px-6 py-4 flex gap-2">
                  {actions.map((action, aIdx) => {
                    const isEdit = action.label.toLowerCase() === "edit";
                    return (
                      <button
                        key={aIdx}
                        onClick={() => action.onClick(row)}
                        className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                          isEdit
                            ? "bg-yellow-400 text-white hover:bg-yellow-500"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                        title={action.label}
                      >
                        {isEdit ? (
                          <PencilIcon className="w-4 h-4" />
                        ) : (
                          <TrashIcon className="w-4 h-4" />
                        )}
                        {action.label}
                      </button>
                    );
                  })}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
