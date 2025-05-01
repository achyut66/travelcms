import React from "react";
import "../index.css";

const RButton = ({ label, onClick, tooltip }) => {
  return (
    <div className="relative group inline-block">
      <button
        onClick={onClick}
        className="cursor-pointer bg-blue-300 px-2 py-2 rounded-[4px] w-[85px] transition duration-300"
      >
        {label}
      </button>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default RButton;
