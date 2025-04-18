import React from "react";
import "../index.css";

const Button = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-[4px] w-[160px] transition duration-300
        ${
          disabled
            ? "bg-red-600 cursor-not-allowed"
            : "bg-blue-500 cursor-pointer"
        }
      `}
    >
      {label}
    </button>
  );
};

export default Button;
