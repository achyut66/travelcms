import React, { useEffect, useState } from "react";
import NotificationBadge from "./extras/NotificationBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faInfoCircle,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function BookingGrid() {
  const [bookingCount, setBookingCount] = useState(0);
  const [newbooking, setNewBooking] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [shouldBlink, setShouldBlink] = useState(false);
  const [isAssigned, setIsAssigned] = useState([]);
  const [isAssignedData, setIsAssignedData] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    if (newbooking > prevCount) {
      setShouldBlink(true);
    }
    setPrevCount(newbooking);
  }, [newbooking]);

  const handleView = () => {
    setShouldBlink(false);
  };

  const fetchBookingCount = async () => {
    try {
      const res = await fetch("/api/get-booking-count");
      const data = await res.json();
      setBookingCount(data.count);
    } catch (error) {
      console.error("Error fetching booking count:", error.message);
    }
  };

  const fetchNewBooking = async () => {
    try {
      const res = await fetch("/api/get-customer-with-flag");
      const data = await res.json();
      setNewBooking(data.result);
    } catch (error) {
      console.error("Error fetching data", error.message);
    }
  };
  const fetchIsAssigned = async () => {
    try {
      const res = await fetch("/api/get-assigned-bookings");
      const data = await res.json();
      // console.log(data);
      setIsAssigned(data.result);
      setIsAssignedData(data.data);
    } catch (error) {
      console.error("Error fetching assigned booking count:", error.message);
    }
  };

  const fetchIsCompleted = async () => {
    try {
      const res = await fetch("/api/get-completed-bookings");
      const data = await res.json();
      setIsCompleted(data.result);
    } catch (error) {
      console.error("Error fetching completed booking count:", error.message);
    }
  };

  const fetchIsCanceled = async () => {
    try {
      const res = await fetch("/api/get-canceled-bookings");
      const data = await res.json();
      setIsCanceled(data.result);
    } catch (error) {
      console.error("Error fetching canceled booking count:", error.message);
    }
  };

  const fetchIsBooked = async () => {
    try {
      const res = await fetch("/api/get-booked-bookings");
      const data = await res.json();
      setIsBooked(data.result);
    } catch (error) {
      console.error("Error fetching canceled booking count:", error.message);
    }
  };

  useEffect(() => {
    fetchBookingCount();
    fetchIsAssigned();
    fetchIsCompleted();
    fetchIsCanceled();
    fetchIsBooked();
    fetchNewBooking();

    // Optional: auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBookingCount();
      fetchIsAssigned();
      fetchIsCompleted();
      fetchIsCanceled();
      fetchIsBooked();
      fetchNewBooking();
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {/* Bookings Card */}
        <div className="relative bg-gray-300 shadow-md  p-6 transition-transform hover:scale-102">
          <div
            className={`absolute top-4 right-4 ${
              shouldBlink ? "animate-blink-shrink" : ""
            }`}
            onClick={handleView}
          >
            <Link to={"/classification/booking"}>
              <NotificationBadge count={newbooking} />
            </Link>
          </div>

          <div className="text-center mb-2">
            <FontAwesomeIcon icon={faCalendarCheck} size="2x" />
          </div>

          <h3 className="text-xl text-center font-semibold mb-2">
            Total Bookings
          </h3>

          <div className="text-center text-black font-bold text-2xl">
            <Link to={"/classification/booking"}>{bookingCount}</Link>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2 text-sm text-center ml-[70px]">
            <div className="relative group">
              <div
                className="bg-blue-400 text-black h-12 w-20 flex flex-col items-center justify-center cursor-pointer"
                style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.7)" }}
              >
                <div className="font-semibold text-white">Booked</div>
                <div className="text-white text-sm">{isBooked}</div>
              </div>

              {/* Hover modal */}
              <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-md bg-white shadow-lg border p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <div className="font-bold mb-1 text-black">Booking Details</div>
                <p className="text-sm text-gray-600">
                  "Only Booked – Not Yet Assigned to Pickup, Guide, or Porter"
                </p>
              </div>
            </div>

            <div className="relative group">
              <div
                className="bg-yellow-400 text-black h-12 w-20 flex flex-col items-center justify-center"
                style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.7)" }}
              >
                <div className="font-semibold text-white">Assigned</div>
                <div className="text-white text-sm">{isAssigned}</div>
              </div>
              {/* Hover modal */}
              <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-md bg-white shadow-lg border p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <div className="font-bold mb-1 text-black">
                  Assigned Details
                </div>
                <p>
                  "These bookings have been assigned to guides, porters, and are
                  scheduled for pickup."
                </p>
              </div>
            </div>

            <div className="relative group">
              <div
                className="bg-green-400 text-black h-12 w-20 flex flex-col items-center justify-center"
                style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.7)" }}
              >
                <div className="font-semibold text-white">Completed</div>
                <div className="text-white text-sm">{isCompleted}</div>
              </div>
              {/* Hover modal */}
              <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-md bg-white shadow-lg border p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <div className="font-bold mb-1 text-black">
                  Completed Details
                </div>
                <p className="text-sm text-gray-600">
                  "Completed bookings that have successfully finished all
                  assigned travel tasks."
                </p>
              </div>
            </div>

            <div className="relative group">
              <div
                className="bg-red-500 text-black h-12 w-20 flex flex-col items-center justify-center"
                style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.7)" }}
              >
                <div className="font-semibold text-white">Canceled</div>
                <div className="text-white text-sm">{isCanceled}</div>
              </div>
              {/* Hover modal */}
              <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-md bg-white shadow-lg border p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <div className="font-bold mb-1 text-black">
                  Cancelled Details
                </div>
                <p className="text-sm text-gray-600">
                  "Canceled bookings that were officially withdrawn before task
                  execution."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries Card */}
        {/* <div className="relative bg-gray-500 shadow-md p-6 transition-transform hover:scale-102">
          <div className="absolute top-4 right-4">
            <NotificationBadge count={3} />
          </div>
          <div className="text-center mb-2">
            <FontAwesomeIcon icon={faInfoCircle} size="2x" />
          </div>
          <h3 className="text-xl text-center font-semibold mb-2">Enquiries</h3>
        </div> */}

        {/* Flights Card */}
        <div className="relative bg-yellow-300 shadow-md p-6 transition-transform hover:scale-102">
          <div className="absolute top-4 right-4">
            <NotificationBadge count={3} />
          </div>
          <div className="text-center mb-2">
            <FontAwesomeIcon icon={faPlane} size="2x" />
          </div>
          <h3 className="text-xl text-center font-semibold mb-2">Flights</h3>
        </div>
      </div>
    </div>
  );
}
