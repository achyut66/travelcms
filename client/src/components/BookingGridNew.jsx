import React, { useEffect, useState } from "react";
import NotificationBadge from "./extras/NotificationBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faInfoCircle,
  faPlane,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import DashboardNotification from "../components/extras/ToastNotification";

export default function BookingGrid() {
  const [bookingCount, setBookingCount] = useState(0);
  const [flightCount, setFlightCount] = useState(0);
  const [newbooking, setNewBooking] = useState(0);
  const [newflight, setNewFlight] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [shouldBlink, setShouldBlink] = useState(false);
  const [isAssigned, setIsAssigned] = useState([]);
  const [isAssignedData, setIsAssignedData] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompletedFlight, setIsCompletedFlight] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isCanceledFlight, setIsCanceledFlight] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isBookedFlight, setIsBookedFlight] = useState(false);

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

  // fetch flight booking details

  useEffect(() => {
    if (newflight > prevCount) {
      setShouldBlink(true);
    }
    setPrevCount(newflight);
  }, [newflight]);

  const handleViewFlight = () => {
    setShouldBlink(false);
  };

  const fetchFlightCount = async () => {
    try {
      const res = await fetch("/api/get-flight-count");
      const data = await res.json();
      setFlightCount(data.count);
    } catch (error) {
      console.error("Error fetching booking count:", error.message);
    }
  };

  const fetchNewFlight = async () => {
    try {
      const res = await fetch("/api/get-flight-with-flag");
      const data = await res.json();
      setNewFlight(data.result);
    } catch (error) {
      console.error("Error fetching data", error.message);
    }
  };

  const fetchIsCompletedFlight = async () => {
    try {
      const res = await fetch("/api/get-completed-flight");
      const data = await res.json();
      setIsCompletedFlight(data.result);
    } catch (error) {
      console.error("Error fetching completed booking count:", error.message);
    }
  };

  const fetchIsBookedFlight = async () => {
    try {
      const res = await fetch("/api/get-booked-flight");
      const data = await res.json();
      setIsBookedFlight(data.result);
    } catch (error) {
      console.error("Error fetching canceled booking count:", error.message);
    }
  };

  const fetchIsCanceledFlight = async () => {
    try {
      const res = await fetch("/api/get-canceled-flight");
      const data = await res.json();
      setIsCanceledFlight(data.result);
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
    fetchFlightCount();
    fetchNewFlight();
    fetchIsCompletedFlight();
    fetchIsBookedFlight();
    fetchIsCanceledFlight();

    // Optional: auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBookingCount();
      fetchIsAssigned();
      fetchIsCompleted();
      fetchIsCanceled();
      fetchIsBooked();
      fetchNewBooking();
      fetchFlightCount();
      fetchNewFlight();
      fetchIsCompletedFlight();
      fetchIsBookedFlight();
      fetchIsCanceledFlight();
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-6">
        {/* Bookings Card */}
        <div className="relative bg-white shadow-md p-6 transition-transform hover:scale-102">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking Card 1 */}
            <div className="relative text-center p-4 shadow rounded bg-blue-400">
              <div className="absolute top-4 right-4" onClick={handleView}>
                {/* <Link to="/classification/booking">
                  <NotificationBadge count={newbooking} />
                </Link> */}
                <DashboardNotification />
              </div>
              <div className="mb-2">
                <FontAwesomeIcon icon={faCar} size="2x" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PickUp Information</h3>
            </div>

            {/* Booking Card 2 */}
            <div className="relative text-center p-4 shadow rounded bg-green-300">
              <div
                className={`absolute top-4 right-4`}
                onClick={handleViewFlight}
              >
                <Link to="/classification/booking">
                  <NotificationBadge count={newbooking} />
                </Link>
              </div>
              <div className="mb-2">
                <FontAwesomeIcon icon={faCalendarCheck} size="2x" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Total Package Bookings
              </h3>
              <div className="text-black font-bold text-2xl">
                <Link to="/classification/booking">{bookingCount}</Link>
              </div>
            </div>

            {/* Booking Card 3 */}
            <div
              className="relative text-center p-4 shadow rounded"
              style={{ backgroundColor: "#00C49F" }}
            >
              <div className={`absolute top-4 right-4`} onClick={handleView}>
                <Link to="/classification/booking/flight">
                  <NotificationBadge count={newflight} />
                </Link>
              </div>
              <div className="mb-2">
                <FontAwesomeIcon icon={faPlane} size="2x" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Total Flight Bookings
              </h3>
              <div className="text-black font-bold text-2xl">
                <Link to="/classification/booking/flight">{newflight}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
