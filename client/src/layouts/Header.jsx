import React from "react";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import "../index.css";
// import Clock from "../components/Clock.jsx";

const Header = () => {
  const handleLogout = async () => {
    const res = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      window.location.href = "/";
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-red-400 p-4 flex justify-end items-center z-50 shadow-md">
      <div className="grid grid-cols-2 items-center">
        {/* <div className="justify-self-start mr-[500px]">
          <Clock />
        </div> */}
        <div className="flex justify-end relative mr-[-80px]">
          <div className="relative group">
            <div className="bg-white text-gray-800 rounded-[4px] p-0 flex items-center cursor-pointer">
              <Button label={"Profile"} />
            </div>

            {/* Dropdown menu */}
            <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                See Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
