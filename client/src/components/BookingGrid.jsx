import React, { useEffect, useState } from "react";
import NotificationBadge from "./extras/NotificationBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faInfoCircle,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function BookingGrid() {
  const [bookingCount, setBookingCount] = useState(0);
  const [newbooking, setNewBooking] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [shouldBlink, setShouldBlink] = useState(false);
  const [isAssigned, setIsAssigned] = useState([]);
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
      setIsAssigned(data.result);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {/* Bookings Card */}
        <div className="relative bg-green-300 shadow-md rounded-2xl p-6 transition-transform hover:scale-102">
          {/* Notification badge */}
          <div
            className={`absolute top-4 right-4 ${
              shouldBlink ? "animate-blink-shrink" : ""
            }`}
            onClick={handleView}
          >
            <NotificationBadge count={newbooking} />
          </div>

          {/* Icon */}
          <div className="text-center mb-2">
            <FontAwesomeIcon icon={faCalendarCheck} size="2x" />
          </div>

          {/* Title */}
          <h3 className="text-xl text-center font-semibold mb-2">Bookings</h3>

          {/* Total count */}
          <div className="text-center text-black font-bold text-2xl">
            <Link to={"/classification/booking"}>{bookingCount}</Link>
          </div>

          {/* 👇 New Inner Task Grid */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-sm text-center">
            <div className="bg-gray-600 text-black rounded-md py-2 shadow">
              <div className="font-semibold text-white">Booked</div>
              <div className="text-blue-600 text-white text-lg">{isBooked}</div>
            </div>
            <div className="bg-yellow-400 text-black rounded-md py-2 shadow">
              <div className="font-semibold text-white">Assigned</div>
              <div className="text-blue-600 text-white text-lg">
                {isAssigned}
              </div>
            </div>
            <div className="bg-green-500 text-black rounded-md py-2 shadow">
              <div className="font-semibold text-white">Completed</div>
              <div className="text-green-600 text-white text-lg">
                {isCompleted}
              </div>
            </div>
            <div className="bg-red-400 text-black rounded-md py-2 shadow">
              <div className="font-semibold text-white">Canceled</div>
              <div className="text-red-600 text-white text-lg">
                {isCanceled}
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries Card */}
        <div className="relative bg-gray-300 shadow-md rounded-2xl p-6 transition-transform hover:scale-102">
          <div className="absolute top-4 right-4">
            <NotificationBadge count={3} />
          </div>
          <div className="text-center mb-2">
            <FontAwesomeIcon icon={faInfoCircle} size="2x" />
          </div>
          <h3 className="text-xl text-center font-semibold mb-2">Enquiries</h3>
        </div>

        {/* Flights Card */}
        <div className="relative bg-yellow-200 shadow-md rounded-2xl p-6 transition-transform hover:scale-102">
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
