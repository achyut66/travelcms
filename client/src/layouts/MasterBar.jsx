import React, { useState } from "react";
import logo from "../assets/react.svg";
import Stomach from "../components/Stomach";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <>
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-black text-white p-4 hidden md:block z-999">
        <img src={logo} width={100} height={100} alt="Logo" />
        <ul className="space-y-4 mt-[100px] pl-4">
          <li className="hover:text-gray-400 cursor-pointer">Home</li>

          {/* Dropdown Item */}
          <div>
            <li
              onClick={() => setIsOpen(!isOpen)}
              className="hover:text-gray-400 cursor-pointer flex justify-between items-center"
            >
              Page
              <span>{isOpen ? "▲" : "▼"}</span>
            </li>
            {isOpen && (
              <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
                <li className="hover:text-blue-600 cursor-pointer">A</li>
                <li className="hover:text-blue-600 cursor-pointer">B</li>
                <li className="hover:text-blue-600 cursor-pointer">C</li>
              </ul>
            )}
          </div>
          <li className="hover:text-gray-400 cursor-pointer">Blog</li>
          <li className="hover:text-gray-400 cursor-pointer">Report</li>
          <div>
            <li
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="hover:text-gray-400 cursor-pointer flex justify-between items-center"
            >
              Profile Setting
              <span>{isProfileOpen ? "▲" : "▼"}</span>
            </li>
            {isProfileOpen && (
              <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
                <Link to="/company-profile">
                  <li className="hover:text-blue-600 cursor-pointer">
                    Company Profile
                  </li>
                </Link>
              </ul>
            )}
          </div>
        </ul>
        <hr className="b-2px w-full mt-[220px] mb-[0px]" />
        <ul className="space-y-4 mt-[10px] pl-4 text-center pl-[0px]">
          <p>Pokalde Travel And Tours</p>
          <p>Email:pokalde@gmail.com</p>
          <p>Phone: 9861023479</p>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
