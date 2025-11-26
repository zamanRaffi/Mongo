"use client";

export default function DataTable({ columns = [], data = [], actions = [] }) {
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
    <div className="overflow-x-auto rounded-2xl shadow-md bg-white/30 backdrop-blur-md">
      <table className="min-w-full divide-y divide-white/30 rounded-2xl overflow-hidden">
        {/* HEADER */}
        <thead className="bg-white/40 backdrop-blur-md">
          <tr>
            {normalizedColumns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-black/30">
          {data.map((row, idx) => (
            <tr
              key={row._id || idx}
              className={`transition-colors ${
                idx % 2 === 0 ? "bg-white/20" : "bg-white/10"
              } hover:bg-white/30 rounded-lg`}
            >
              {normalizedColumns.map((col, cIdx) => {
                let value;
                if (typeof col.accessor === "function") value = col.accessor(row);
                else if (typeof col.accessor === "string") value = row[col.accessor];

                return (
                  <td key={cIdx} className="px-6 py-4 text-sm text-gray-800">
                    {value !== null && value !== undefined ? value : ""}
                  </td>
                );
              })}

              {/* Actions */}
              {actions.length > 0 && (
                <td className="px-6 py-4 text-sm flex gap-2">
                  {actions.map((action, aIdx) => {
                    let bgColor = "bg-blue-500 hover:bg-blue-600"; // default
                    if (action.label.toLowerCase() === "edit")
                      bgColor = "bg-yellow-500 hover:bg-yellow-600";
                    if (action.label.toLowerCase() === "delete")
                      bgColor = "bg-red-500 hover:bg-red-600";

                    return (
                      <button
                        key={aIdx}
                        onClick={() => action.onClick(row)}
                        className={`px-3 py-1 text-sm font-medium rounded-xl text-white ${bgColor} transition`}
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
