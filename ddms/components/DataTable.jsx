"use client";

export default function DataTable({ columns = [], data = [], actions = [] }) {

  // Normalize columns so both string and object formats work
  const normalizedColumns = columns.map((col) => {
    if (typeof col === "string") {
      return {
        header: col,
        accessor: col.toLowerCase().replace(/ /g, ""),
      };
    }
    return col;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-sm">

        {/* HEADER */}
        <thead className="bg-gray-100">
          <tr>
            {normalizedColumns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={row._id || idx} className="hover:bg-gray-50 transition-colors">
              
              {normalizedColumns.map((col, cIdx) => {
                let value;

                // If accessor is a function
                if (typeof col.accessor === "function") {
                  value = col.accessor(row);
                }

                // If accessor is a key string
                else if (typeof col.accessor === "string") {
                  value = row[col.accessor];
                }

                return (
                  <td key={cIdx} className="px-6 py-4 text-sm text-gray-700">
                    {value !== null && value !== undefined ? value : ""}
                  </td>
                );
              })}

              {/* Actions column */}
              {actions.length > 0 && (
                <td className="px-6 py-4 text-sm text-gray-700 flex gap-2">
                  {actions.map((action, aIdx) => {
                    let bgColor = "bg-blue-600 hover:bg-blue-700"; // default
                    if (action.label.toLowerCase() === "edit") bgColor = "bg-yellow-500 hover:bg-yellow-600";
                    if (action.label.toLowerCase() === "delete") bgColor = "bg-red-600 hover:bg-red-700";

                    return (
                      <button
                        key={aIdx}
                        onClick={() => action.onClick(row)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg text-white ${bgColor} transition`}
                      >
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
