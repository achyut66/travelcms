import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import Pagination from "../components/Pagination";
import SearchComponent from "../components/Search";

const Table = ({ columns, itemsPerPage = 2, renderActions }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the itineraries grouped by package name
  const fetchItineraries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/itenery-data`);
      if (!response.ok) throw new Error("Failed to fetch itinerary data");

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchResults = async (query) => {
    const trimmedQuery = query;
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

  // Helper functions for table rendering
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
    <div className="overflow-x-auto w-full pt-[70px]">
      {/* Search Component */}
      {/* <div className="mt-[1px] ml-[890px] z-[9999]">
        <SearchComponent onSearch={fetchResults} />
        {isSearching && (
          <div className="text-sm text-gray-500 mt-1">Searching...</div>
        )}
        {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      </div> */}

      {/* Table */}
      <table className="w-full bg-white border border-gray-300 table-auto">
        <thead className="bg-gray-100">
          <tr>
            {/* Render Table Headers */}
            {columns.map((col, idx) => (
              <th
                key={`header-${idx}`}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300"
              >
                {col.name}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((packageData, idx) => (
              <React.Fragment key={`package-${idx}`}>
                {/* Package Name Row */}
                <tr className="hover:bg-gray-200">
                  <td
                    colSpan={columns.length}
                    className="px-4 py-2 text-lg font-bold border-b border-gray-300"
                  >
                    {packageData._id} {/* package_name */}
                  </td>
                  <td>&nbsp;</td>
                </tr>

                {/* Itinerary Rows */}
                {packageData.itineraries.map((itinerary, i) => (
                  <tr
                    key={`itinerary-${itinerary._id}`} // use itinerary _id as key
                    className="hover:bg-gray-200"
                  >
                    <td className="px-4 py-2 border-b border-gray-300">
                      {i + 1 + "). " + itinerary.itinerary}{" "}
                      {/* <-- Use itinerary.itinerary */}
                    </td>
                    {renderActions && (
                      <td className="px-4 py-2 text-sm border-b border-gray-300">
                        {renderActions(itinerary, i, itinerary._id)}{" "}
                        {/* <-- Pass itinerary._id */}
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
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
