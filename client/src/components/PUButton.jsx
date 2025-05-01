import React from "react";
import "../index.css";

const DButton = ({ label, onClick, tooltip, disabled }) => {
  return (
    <div className="relative group inline-block">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-2 py-2 rounded-[4px] w-[40px] transition duration-300
          ${
            disabled
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-purple-300 cursor-pointer"
          }`}
      >
        {label}
      </button>
      {tooltip && !disabled && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default DButton;
