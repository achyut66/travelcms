import React from "react";
import "../index.css";

const Button = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer px-6 py-2 rounded-[4px] w-[160px] transition duration-300"
    >
      {label}
    </button>
  );
};

export default Button;
