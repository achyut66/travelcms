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
  faRocket,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import Clock from "../components/Clock.jsx";
import { API_BASE_URL } from "../config.js";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
              <div
                className={`flex items-center transition-all duration-300 ${
                  isSidebarOpen ? "justify-start" : "justify-center pr-5"
                }`}
              >
                <FontAwesomeIcon
                  icon={faRocket}
                  className={`transition-all duration-300 ${
                    isSidebarOpen ? "text-xl" : "text-[30px]"
                  }`}
                />
              </div>
              {isSidebarOpen && <span>Modules/Features</span>}
            </div>
            {isSidebarOpen && <span>{isDropdownOpen ? "▲" : "▼"}</span>}
          </li>

          {isDropdownOpen && isSidebarOpen && (
            <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to={"/classification/booking"}>
                  <FontAwesomeIcon icon={faClipboardList} /> &nbsp;&nbsp;Booking
                </Link>
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <FontAwesomeIcon icon={faUser} /> &nbsp;&nbsp;Customer
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

          {/* <li className="hover:text-gray-400 cursor-pointer flex items-center">
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
          </li> */}

          {/* <li className="hover:text-gray-400 cursor-pointer flex items-center">
            <div
              className={`flex items-center transition-all duration-300 ${
                isSidebarOpen ? "justify-start" : "justify-center pr-5"
              }`}
            >
              <FontAwesomeIcon
                icon={faFile}
                className={`transition-all duration-300 ${
                  isSidebarOpen ? "text-xl" : "text-[30px]"
                }`}
              />
            </div>
            {isSidebarOpen && <span className="ml-2">Report</span>}
          </li> */}
          <li
            onClick={() => setIsReportOpen(!isReportOpen)}
            className="hover:text-gray-400 cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center transition-all duration-300 ${
                  isSidebarOpen ? "justify-start" : "justify-center pr-5"
                }`}
              >
                <FontAwesomeIcon
                  icon={faRocket}
                  className={`transition-all duration-300 ${
                    isSidebarOpen ? "text-xl" : "text-[30px]"
                  }`}
                />
              </div>
              {isSidebarOpen && <span>Reports</span>}
            </div>
            {isSidebarOpen && <span>{isReportOpen ? "▲" : "▼"}</span>}
          </li>

          {isReportOpen && isSidebarOpen && (
            <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-300 bg-gray-800 rounded-md p-2">
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to={"/report/booking"}>
                  <FontAwesomeIcon icon={faClipboardList} /> &nbsp;&nbsp;
                  Booking Report's
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
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/company-profile">
                    <FontAwesomeIcon icon={faBuilding} />
                    &nbsp;&nbsp;Company Profile
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/package">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Package Setting
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/paymentstatus">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Payment Status
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/paymentmethod">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Payment Method
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/visitpurpose">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Visit Purpose
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/nationality">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Nationality Setting
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/language">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Language Setting
                  </Link>
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/language">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Vendor Setting
                  </Link>
                </li>

                <li className="hover:text-blue-600 cursor-pointer">
                  <Link to="/settings/guide_potter">
                    <FontAwesomeIcon icon={faCog} />
                    &nbsp;&nbsp;Guide/Potter Setting
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
