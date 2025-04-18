import React from "react";
import logo from "../assets/react.svg";

export default function Stomach() {
  return (
    <div className="flex flex-col items-center justify-center min-w-[1200px] h-full">
      <div>
        <img src={logo} width={100} height={100} alt="Logo" />
      </div>
      <h1 className="text-3xl font-bold mb-4">ABC Travel And Tourism</h1>
      <p className="text-lg">Thamel, 16 Kathmandu</p>
      <p className="text-lg">
        Managing director <span className="text-red-500">Achyut Neupane</span>
      </p>
    </div>
  );
}
