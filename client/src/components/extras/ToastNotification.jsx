import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import Sound from "../../assets/media/noti.mp3";

// console.log(Sound);
const DashboardNotification = () => {
  const [hasNotification, setHasNotification] = useState(0);
  const [notifications, setNotifications] = useState([]);
  // console.log(hasNotification);
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const bookingDetails = await fetch("/api/getdata-with-pickupdate");
        const result = await bookingDetails.json();
        // console.log(result);
        setHasNotification(result.count);
        setNotifications(result.data); // Optional: store actual data
      } catch (error) {
        console.log("error fetching data", error);
      }
    };
    fetchNotification();
  }, []);

  return (
    <div className="relative group inline-block">
      {/* Bell Icon */}
      <div className="cursor-pointer">
        <FontAwesomeIcon icon={faBell} className="text-gray-700 text-xl" />
        {hasNotification > 0 && (
          <span className="absolute -top-1 -right-2 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-600 rounded-full">
            {hasNotification}
          </span>
        )}
      </div>

      {/* Notification Modal */}
      <div className="absolute right-[-290px] mt-[-20px] w-72 bg-white shadow-xl rounded-lg border border-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="text-center font-semibold text-gray-800 text-md mb-3 border-b pb-1">
            🚐 Upcoming Pickups
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No upcoming pickups.
            </p>
          ) : (
            notifications.map((item, index) => (
              <Link
                to={"/classification/booking"}
                key={index}
                // href={`/bookings/${item._id}`}
                className="block mb-2 p-2 rounded-md bg-gray-50 hover:bg-gray-300 transition-colors"
              >
                <div className="text-sm font-medium text-gray-800">
                  {item.company_name || "Guest Name"}
                </div>
                <div className="text-xs text-gray-500">
                  Pickup Date: {item.pickup_date?.slice(0, 10)}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardNotification;
