import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import Pagination from "../components/Pagination";
import SearchComponent from "../components/Search";

const Table = ({ columns, data, actions, itemsPerPage = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // console.log(data);
  const fetchResults = async (query) => {
    const trimmedQuery = query;
    // console.log(trimmedQuery);
    if (!trimmedQuery) {
      setSearchResults(data);
      setIsSearching(false);
      setError(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/booking-search?q=${encodeURIComponent(
          trimmedQuery
        )}`
      );

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      const resultData = await response.json();
      setSearchResults(Array.isArray(resultData) ? resultData : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to perform search");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Helper functions
  const isImage = (value) => {
    if (typeof value !== "string") return false;
    const imageExtensions = [".jpg", ".png", ".jpeg", ".gif"];
    return imageExtensions.some((ext) => value.toLowerCase().endsWith(ext));
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
      return value; // Return original value if date parsing fails
    }
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return "";

    const statusMap = {
      Settled: "bg-green-100 text-green-800",
      Received: "bg-green-100 text-yellow-800",
      "Sent For Settle": "bg-yellow-100 text-red-800",
    };

    return statusMap[status] || "bg-red-300 text-gray-800";
  };

  // Data processing
  const displayedData = searchResults !== null ? searchResults : data;
  const totalItems = displayedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentData = displayedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  return (
    <div className="overflow-x-auto w-full">
      {/* Search Component */}
      <div className="mt-[1px] ml-[890px] z-[9999]">
        <SearchComponent onSearch={fetchResults} />
        {isSearching && (
          <div className="text-sm text-gray-500 mt-1">Searching...</div>
        )}
        {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      </div>

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
                Actions
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
                {/* {console.log(row.flag)} */}
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
                    } else if (col.key === "itinerary") {
                      // Custom rendering for itinerary
                      displayValue = row.itinerary.join(", ");
                    } else if (cellValue) {
                      displayValue = cellValue;
                    }
                  }

                  return (
                    <td
                      key={`${col.key}-${idx}`}
                      className={`px-4 py-2 border-[1px] border-gray-200 text-sm ${
                        col.key === "payment_status"
                          ? getPaymentStatusColor(row[col.key])
                          : ""
                      }`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
                {actions && (
                  <td className="flex px-4 py-2 border-[1px] border-gray-200 text-sm">
                    <div className="flex items-center">{actions(row)}</div>
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
                {isSearching ? "Searching..." : "No data found"}
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
