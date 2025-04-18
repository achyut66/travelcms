import React from "react";
import { API_BASE_URL } from "../config";

const Table = ({ columns, data, actions }) => {
  const isImage = (value) => {
    return (
      value &&
      (value.endsWith(".jpg") ||
        value.endsWith(".png") ||
        value.endsWith(".jpeg") ||
        value.endsWith(".gif"))
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 border-[2px] border-gray-200 text-left bg-gray-100 font-medium text-sm text-gray-700"
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-2 border-[2px] border-gray-200 text-left bg-gray-100 text-sm">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-200 border-gray-200 border-[1px]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 border-[1px] border-gray-200 text-sm"
                  >
                    {col.key === "index" ? (
                      idx + 1
                    ) : isImage(row[col.key]) ? ( // Check if the value is an image URL
                      <img
                        src={`${API_BASE_URL}/uploads/${row[col.key]}`}
                        alt={col.label}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      row[col.key] || "--" // Fallback for missing data
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-2 border-[1px] border-gray-200 text-sm">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-4 text-center text-gray-400"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
