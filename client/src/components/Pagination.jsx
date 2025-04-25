import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg disabled:bg-gray-300 ${
          currentPage === 1 ? "cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 ${
            currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-blue-100"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg disabled:bg-gray-300 ${
          currentPage === totalPages
            ? "cursor-not-allowed"
            : "hover:bg-blue-600"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
