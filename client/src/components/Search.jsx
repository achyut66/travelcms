import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchComponent({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    onSearch(input.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center border border-gray-300 min-h-12 mt-[10px] mb-[10px] rounded p-2">
      <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full outline-none"
        value={input}
        onChange={(e) => {
          const value = e.target.value;
          setInput(value);
          if (value.trim() === "") {
            onSearch(""); // trigger reset when input is cleared
          }
        }}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSearch}
        className="ml-2 bg-blue-500 cursor-pointer rounded text-white px-4 py-2"
      >
        Search
      </button>
    </div>
  );
}

export default SearchComponent;
