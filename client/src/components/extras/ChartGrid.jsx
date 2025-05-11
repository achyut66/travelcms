import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const ChartGrid = () => {
  const monthsMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  const [bookingCount, setBookingCount] = useState(0);
  const [flightCount, setFlightCount] = useState(0);

  const fetchBookingCount = async () => {
    try {
      const res = await fetch("/api/get-booking-count");
      const data = await res.json();
      setBookingCount(data.count);
    } catch (error) {
      console.error("Error fetching booking count:", error.message);
    }
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

  useEffect(() => {
    fetchBookingCount();
    fetchFlightCount();
  }, []);

  const pieData = [
    { name: "Bookings", value: bookingCount },
    { name: "Flights", value: flightCount },
  ];

  const formatBarData = (rawData) => {
    const chartData = Object.entries(monthsMap).map(([num, name]) => ({
      name,
      value: 0,
    }));

    rawData.forEach((item) => {
      const monthString = item._id.month; // e.g., "2025-02"
      const monthNum = monthString.split("-")[1]; // e.g., "02"
      const monthName = monthsMap[monthNum];
      const match = chartData.find((entry) => entry.name === monthName);
      if (match) {
        match.value = item.count;
      }
    });

    return chartData;
  };

  // booking status data
  const bookingStatusMap = {
    0: "Booked",
    1: "Assigned",
    2: "Completed",
    3: "Canceled",
  };
  const bookingStatusFlight = {
    0: "Booked",
    2: "Completed",
    3: "Canceled",
  };

  const formatStatusBarData = (rawData) => {
    const chartData = Object.values(bookingStatusMap).map((name) => ({
      name,
      value: 0,
    }));

    rawData.forEach((item) => {
      const status = bookingStatusMap[item._id]; // use number as key
      const count = item.count;
      const match = chartData.find((entry) => entry.name === status);
      if (match) {
        match.value = count;
      }
    });

    return chartData;
  };
  // format for flight
  const formatStatusBarDataFlight = (rawData) => {
    const chartData = Object.values(bookingStatusFlight).map((name) => ({
      name,
      value: 0,
    }));

    rawData.forEach((item) => {
      const status = bookingStatusFlight[item._id]; // use number as key
      const count = item.count;
      const match = chartData.find((entry) => entry.name === status);
      if (match) {
        match.value = count;
      }
    });

    return chartData;
  };

  // rawData.forEach((item) => {

  const [barData, setBarData] = useState([]);
  const [barDataFlight, setBarDataFlight] = useState([]);
  const [statusBarData, setStatusBarData] = useState([]);
  const [statusBarDataFlight, setStatusBarDataFlight] = useState([]);

  const fetchBookingByMonth = async () => {
    try {
      const response = await fetch("/api/get-booking-by-month");
      const data = await response.json();
      const formattedData = formatBarData(data);
      setBarData(formattedData);
    } catch (error) {
      console.error("Error Fetching Data", error.message);
    }
  };

  const fetchFlightByMonth = async () => {
    try {
      const response = await fetch("/api/get-flight-by-month");
      const data = await response.json();
      const formattedData = formatBarData(data);
      setBarDataFlight(formattedData);
    } catch (error) {
      console.error("Error Fetching Data", error.message);
    }
  };

  const fetchBookingStatus = async () => {
    try {
      const response = await fetch("/api/get-booking-status-summary");
      const data = await response.json();
      const formattedData = formatStatusBarData(data);
      setStatusBarData(formattedData);
    } catch (error) {
      console.error("Error Fetching Data", error.message);
    }
  };
  const fetchBookingStatusFlight = async () => {
    try {
      const response = await fetch("/api/get-flight-status-summary");
      const data = await response.json();
      const formattedData = formatStatusBarDataFlight(data);
      setStatusBarDataFlight(formattedData);
    } catch (error) {
      console.error("Error Fetching Data", error.message);
    }
  };

  useEffect(() => {
    fetchBookingByMonth();
    fetchBookingStatus();
    fetchBookingStatusFlight();
    fetchFlightByMonth();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Bar Chart */}
        <div className="bg-white shadow-md p-4 rounded-2xl">
          <h2 className="text-sm font-bold mb-4">Status Of Package Booking</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statusBarData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="blue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* bar chart flight */}
        <div className="bg-white shadow-md p-4 rounded-2xl">
          <h2 className="text-sm font-bold mb-4">Status Of Flight Booking</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statusBarDataFlight}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="green" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-md p-4 rounded-2xl">
          <h2 className="text-sm font-bold mb-4">Categories</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/*  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Bar Chart */}
        <div className="bg-white shadow-md p-4 rounded-2xl">
          <h2 className="text-sm font-bold mb-4">Monthly Package Bookings</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow-md p-4 rounded-2xl">
          <h2 className="text-sm font-bold mb-4">Monthly Flight Bookings</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barDataFlight}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default ChartGrid;
