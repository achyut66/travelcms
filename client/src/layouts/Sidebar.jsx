import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faCog,
  faBuilding,
  faClipboardList,
  faRoute,
  faUser,
  faLocationArrow,
  faBus,
  faDollarSign,
  faPlane,
  faCubes,
  faRocket,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import Clock from "../components/Clock.jsx";
import { API_BASE_URL } from "../config.js";
import DashboardNotification from "../components/extras/ToastNotification";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBookingDropdownOpen, setIsBookingDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/profile-data");
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const result = await response.json();
        // console.log(result);
        setProfileData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // session user
  // const getCurrentUser = async () => {
  //   try {
  //     const res = await fetch("/api/current-user", {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     if (data.user) {
  //       console.log("Logged in user:", data.user);
  //     } else {
  //       console.log("No user logged in");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //   }
  // };

  // getCurrentUser();

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-black text-white overflow-y-auto p-4 z-[1000] transition-all duration-300 ease-in-out
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

        {isSidebarOpen &&
          profileData &&
          profileData.map((profile, idx) => (
            <img
              key={idx}
              src={`${API_BASE_URL}/uploads/${profile.company_logo}`}
              alt="Company Logo"
              style={{ width: "100px", height: "auto" }}
              className="ml-[50px] mt-[40px]"
            />
          ))}

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
              <FontAwesomeIcon
                icon={faRocket}
                className={isSidebarOpen ? "text-xl" : "text-[30px]"}
              />
              {isSidebarOpen && <span>Modules/Features</span>}
            </div>
            {isSidebarOpen && <span>{isDropdownOpen ? "▲" : "▼"}</span>}
          </li>

          {isDropdownOpen && isSidebarOpen && (
            <ul className="ml-4 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
              {/* Booking Details */}
              <li
                onClick={() => setIsBookingDropdownOpen(!isBookingDropdownOpen)}
                className="hover:text-blue-600 cursor-pointer flex justify-between items-center"
              >
                <div className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mb-[-7px]">
                  <FontAwesomeIcon icon={faClipboardList} />
                  &nbsp;&nbsp;
                  <span>Booking Details</span>
                  &nbsp;
                  <span>{isBookingDropdownOpen ? "▲" : "▼"}</span>
                </div>
              </li>

              {isBookingDropdownOpen && (
                <ul className="ml-5 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
                  <Link to={"/classification/booking"}>
                    <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200">
                      <FontAwesomeIcon icon={faCubes} />
                      &nbsp;&nbsp;Package
                    </li>
                  </Link>
                  <Link to={"/classification/booking/flight"}>
                    <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200">
                      <FontAwesomeIcon icon={faPlane} />
                      &nbsp; Flight
                    </li>
                  </Link>
                  {/* <Link to={"/classification/booking"}>
                    <li className="hover:text-blue-600 cursor-pointer">
                      <FontAwesomeIcon icon={faBus} />{" "}
                      &nbsp;&nbsp;Transportation
                    </li>
                  </Link> */}
                </ul>
              )}

              {/* <li className="hover:text-blue-600 cursor-pointer"> */}
              <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-2px]">
                <Link
                  to={"/classification/extras"}
                  className="flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faDollarSign} /> &nbsp;&nbsp;Extras
                </Link>
              </li>

              {/* <li className="hover:text-blue-600 cursor-pointer"> */}
              <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-9px]">
                <Link
                  to={"/classification/itinery"}
                  className="flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faRoute} /> &nbsp;&nbsp;Itinerary
                </Link>
              </li>
            </ul>
          )}

          {/* Reports */}
          <li
            onClick={() => setIsReportOpen(!isReportOpen)}
            className="hover:text-gray-400 cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faFile}
                className={isSidebarOpen ? "text-xl" : "text-[30px]"}
              />
              {isSidebarOpen && <span>Reports</span>}
            </div>
            {isSidebarOpen && <span>{isReportOpen ? "▲" : "▼"}</span>}
          </li>

          {isReportOpen && isSidebarOpen && (
            <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
              <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mb-[-3px]">
                <Link
                  to={"/report/booking"}
                  className="flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span>Booking Report's</span>
                </Link>
              </li>
              <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200">
                <Link
                  to="/report/flight-booking"
                  className="flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span>Flight Report's</span>
                </Link>
              </li>
            </ul>
          )}

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
                {isSidebarOpen && <span>Setting's</span>}
              </div>
              {isSidebarOpen && <span>{isProfileOpen ? "▲" : "▼"}</span>}
            </li>
            {isProfileOpen && isSidebarOpen && (
              <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200">
                  <Link to="/settings/company-profile">
                    <FontAwesomeIcon icon={faBuilding} />
                    &nbsp;&nbsp;Company Profile
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/package">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Package
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/paymentstatus">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Payment Status
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/paymentmethod">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Payment Method
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/visitpurpose">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Visit Purpose
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/nationality">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Nationality
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/language">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Language
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/transportation">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Vehicle
                  </Link>
                </li>
                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/flight">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Flight
                  </Link>
                </li>

                <li className="cursor-pointer hover:text-gray-100 hover:bg-gray-500 px-1 py-1 rounded-lg transition duration-200 mt-[-6px]">
                  <Link to="/settings/guide_potter">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Guide/Potter
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </ul>

        {isSidebarOpen ? (
          <>
            {profileData &&
              profileData.map((profile, idx) => (
                <React.Fragment key={idx}>
                  <hr className="border-t border-gray-600 mt-[120px]" />
                  <ul className="space-y-2 mt-[10px] text-center text-lg">
                    <p className="text-white-400">{profile.company_name}</p>
                    <p className="text-white-400">{profile.company_address}</p>
                    <p className="text-white-400">
                      Phone: {profile.contact_number}
                    </p>
                  </ul>
                </React.Fragment>
              ))}
          </>
        ) : (
          profileData &&
          profileData.map((profile, idx) => (
            <img
              key={idx}
              src={`${API_BASE_URL}/uploads/${profile.company_logo}`}
              alt="Company Logo"
              style={{ width: "100px", height: "auto" }}
              className=" mt-[40px]"
            />
          ))
        )}
      </aside>

      {/* Clock floats next to sidebar */}
      <div
        className={`items-left z-[999] mt-[4px] flex transition-all duration-200 fixed ${
          isSidebarOpen ? "ml-[260px]" : "ml-[100px]"
        }`}
      >
        <Clock />
        <span>
          <DashboardNotification />
        </span>
      </div>
    </>
  );
};

export default Sidebar;
