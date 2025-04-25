import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import Pagination from "../../components/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Table = ({ columns, data, actions, itemsPerPage = 20, filterData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);

  const [selectedColumn, setSelectedColumn] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // for booking status filter

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = async () => {
    const params = new URLSearchParams();

    if (selectedStatus) params.append("status", selectedStatus);
    if (selectedColumn) params.append("column", selectedColumn);
    if (fromDate) params.append("from", fromDate.toISOString().split("T")[0]);
    if (toDate) params.append("to", toDate.toISOString().split("T")[0]);

    const response = await fetch(
      `${API_BASE_URL}/api/filter-by-date?${params}`
    );
    const result = await response.json();

    setFilteredData(result);
    setCurrentPage(1);
  };

  const isImage = (value) => {
    if (typeof value !== "string") return false;
    return [".jpg", ".png", ".jpeg", ".gif"].some((ext) =>
      value.toLowerCase().endsWith(ext)
    );
  };

  const isDateTime = (value) => {
    return (
      typeof value === "string" &&
      !isNaN(Date.parse(value)) &&
      value.includes("T")
    );
  };

  const formatDate = (value) => {
    try {
      return new Date(value).toISOString().split("T")[0];
    } catch {
      return value;
    }
  };

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  return (
    <div className="overflow-x-auto w-full">
      {/* Filter Section */}
      <form
        onSubmit={handleSearch}
        className="mb-4 flex flex-wrap gap-4 items-end"
      >
        <div>
          <label className="block text-sm mb-1">Filter Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border px-2 py-1 text-sm rounded"
          >
            <option value="">-- Select Status --</option>
            {filterData.map((status) => (
              <option key={status.key} value={status.key}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border px-2 py-1 text-sm rounded"
            placeholderText="Select start date"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border px-2 py-1 text-sm rounded"
            placeholderText="Select end date"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer text-sm"
        >
          Search
        </button>
      </form>

      {/* Table */}
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
                ### {/* For actions */}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, idx) => (
              <tr
                key={`row-${idx}`}
                className="hover:bg-gray-200 border-gray-200 border-[1px]"
              >
                {columns.map((col) => {
                  let displayValue = "--";

                  if (col.key === "index") {
                    displayValue = (currentPage - 1) * itemsPerPage + idx + 1;
                  } else if (col.render) {
                    displayValue = col.render(row);
                  } else {
                    const cellValue = row[col.key];
                    if (isImage(cellValue)) {
                      displayValue = (
                        <img
                          src={`${API_BASE_URL}/uploads/${cellValue}`}
                          alt={col.label}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "";
                          }}
                        />
                      );
                    } else if (isDateTime(cellValue)) {
                      displayValue = formatDate(cellValue);
                    } else if (cellValue) {
                      displayValue = cellValue;
                    }
                  }

                  return (
                    <td
                      key={`${col.key}-${idx}`}
                      className="px-4 py-2 border-[1px] border-gray-200 text-sm"
                    >
                      {displayValue}
                    </td>
                  );
                })}

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
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-4 text-center text-gray-400"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
