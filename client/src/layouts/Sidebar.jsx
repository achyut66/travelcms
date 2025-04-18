import React, { useState } from "react";
import logo from "../assets/react.svg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faCog,
  faBuilding,
  faClipboardList,
  faRoute,
  faUsers,
  faLocationArrow,
  faBus,
  faDollarSign,
  faPlane,
  faStopCircle,
} from "@fortawesome/free-solid-svg-icons";
import Clock from "../components/Clock.jsx";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-black text-white p-4 z-[1000] transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64" : "w-24"} overflow-hidden`}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleSidebar}
            className="text-white bg-gray-800 p-2 rounded"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {isSidebarOpen && (
          <img
            src={logo}
            width={100}
            height={100}
            alt="Logo"
            className="ml-[50px] mt-[40px]"
          />
        )}

        <ul className="space-y-4 mt-[70px] p-[15px]">
          <Link to="/dashboard">
            <li className="hover:text-gray-400 cursor-pointer mb-[13px] flex items-center">
              <div
                className={`flex items-center transition-all duration-300 ${
                  isSidebarOpen ? "justify-start" : "justify-center pr-5"
                }`}
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className={`transition-all duration-300 ${
                    isSidebarOpen
                      ? "text-xl"
                      : "text-[30px] mt-[100px] ml-[0px]"
                  }`}
                />
              </div>

              {isSidebarOpen && <span className="ml-2">Home</span>}
            </li>
          </Link>

          <li
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hover:text-gray-400 cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center transition-all duration-300 ${
                  isSidebarOpen ? "justify-start" : "justify-center pr-5"
                }`}
              >
                <FontAwesomeIcon
                  icon={faCog}
                  className={`transition-all duration-300 ${
                    isSidebarOpen ? "text-xl" : "text-[30px]"
                  }`}
                />
              </div>
              {isSidebarOpen && <span>Classifications</span>}
            </div>
            {isSidebarOpen && <span>{isDropdownOpen ? "▲" : "▼"}</span>}
          </li>

          {isDropdownOpen && isSidebarOpen && (
            <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
              <li className="hover:text-blue-600 cursor-pointer">
                <FontAwesomeIcon icon={faClipboardList} /> &nbsp;&nbsp;Booking
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <FontAwesomeIcon icon={faUsers} /> &nbsp;&nbsp;Customer
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <FontAwesomeIcon icon={faLocationArrow} />{" "}
                &nbsp;&nbsp;Destination
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <FontAwesomeIcon icon={faBus} /> &nbsp;&nbsp;Transportation
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <FontAwesomeIcon icon={faDollarSign} /> &nbsp;&nbsp;Expenses
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <FontAwesomeIcon icon={faPlane} /> &nbsp;&nbsp;Flights
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <FontAwesomeIcon icon={faRoute} /> &nbsp;&nbsp;Itinerary
              </li>
            </ul>
          )}

          <li className="hover:text-gray-400 cursor-pointer flex items-center">
            <div
              className={`flex items-center transition-all duration-300 ${
                isSidebarOpen ? "justify-start" : "justify-center pr-5"
              }`}
            >
              <FontAwesomeIcon
                icon={faHome}
                className={`transition-all duration-300 ${
                  isSidebarOpen ? "text-xl" : "text-[30px]"
                }`}
              />
            </div>

            {isSidebarOpen && <span className="ml-2">Blog</span>}
          </li>

          <li className="hover:text-gray-400 cursor-pointer flex items-center">
            <div
              className={`flex items-center transition-all duration-300 ${
                isSidebarOpen ? "justify-start" : "justify-center pr-5"
              }`}
            >
              <FontAwesomeIcon
                icon={faHome}
                className={`transition-all duration-300 ${
                  isSidebarOpen ? "text-xl" : "text-[30px]"
                }`}
              />
            </div>
            {isSidebarOpen && <span className="ml-2">Report</span>}
          </li>

          <div>
            <li
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="hover:text-gray-400 cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center transition-all duration-300 ${
                    isSidebarOpen ? "justify-start" : "justify-center pr-5"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    className={`transition-all duration-300 ${
                      isSidebarOpen ? "text-xl" : "text-[30px]"
                    }`}
                  />
                </div>
                {isSidebarOpen && <span>Profile Setting</span>}
              </div>
              {isSidebarOpen && <span>{isProfileOpen ? "▲" : "▼"}</span>}
            </li>
            {isProfileOpen && isSidebarOpen && (
              <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/company-profile">
                    <FontAwesomeIcon icon={faBuilding} />
                    &nbsp;&nbsp;Company Profile
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="#">
                    <FontAwesomeIcon icon={faStopCircle} />
                    &nbsp;&nbsp;Social Media's
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="#">
                    <FontAwesomeIcon icon={faDollarSign} />
                    &nbsp;&nbsp;Currency Format
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </ul>

        {isSidebarOpen ? (
          <>
            <hr className="border-t border-gray-600 mt-[120px]" />
            <ul className="space-y-2 mt-[10px] text-center text-lg">
              <p className="text-red-400">ABC Travel And Tours</p>
              <p className="text-red-400">Email: abc@gmail.com</p>
              <p className="text-red-400">Phone: 9861023479</p>
            </ul>
          </>
        ) : (
          <img
            src={logo}
            className="mt-[100px]"
            width={"60px"}
            height={"60px"}
          />
        )}
      </aside>

      {/* Clock floats next to sidebar */}
      <div
        className={`items-left z-[999] mt-[10px] flex transition-all duration-200 fixed ${
          isSidebarOpen ? "ml-[260px]" : "ml-[100px]"
        }`}
      >
        <Clock />
      </div>
    </>
  );
};

export default Sidebar;
