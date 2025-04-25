import React, { useEffect, useState } from "react";
import Button from "../../components/VButton.jsx";
import Layout from "../../layouts/Layout.jsx";
import Table from "../../components/report/ReportViewTable.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  // faSmile,
} from "@fortawesome/free-solid-svg-icons";
import EButton from "../../components/EditBtn.jsx";
import PUButton from "../../components/PUButton.jsx";
import DButton from "../../components/DangerBtn.jsx";
import SButton from "../../components/SubmitBtn.jsx";
import Breadcrumb from "../../components/Breadscrum.jsx";

export default function BookingReport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const [isBooked, setIsBooked] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch("/api/get-booking-details");
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while fetching data.", error);
    }
    setLoading(false);
  };
  const fetchBookedData = async () => {
    try {
      const response = await fetch("/api/get-booked-bookings");
      const result = await response.json();
      if (response.ok) {
        setIsBooked(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while fetching data.", error);
    }
    setLoading(false);
  };

  const fetchAssignedData = async () => {
    try {
      const response = await fetch("/api/get-assigned-bookings");
      const result = await response.json();
      if (response.ok) {
        setIsAssigned(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while fetching data.", error);
    }
    setLoading(false);
  };

  const fetchCompleteData = async () => {
    try {
      const response = await fetch("/api/get-completed-bookings");
      const result = await response.json();
      if (response.ok) {
        setIsCompleted(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while fetching data.", error);
    }
    setLoading(false);
  };

  const fetchCanceledData = async () => {
    try {
      const response = await fetch("/api/get-canceled-bookings");
      const result = await response.json();
      if (response.ok) {
        setIsCancelled(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while fetching data.", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchBookedData();
    fetchAssignedData();
    fetchCompleteData();
    fetchCanceledData();
  }, []);

  // Define columns for the table
  const columns = [
    { key: "index", label: "S.no" },
    { key: "company_name", label: "Company Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "contact_number", label: "Contact Number" },
    { key: "package_name", label: "Package Name" },
    { key: "departure_date", label: "Departure Date" },
    { key: "return_date", label: "Return Date" },
    { key: "pax_no", label: "Pax No" },
    {
      key: "flag",
      label: "Booking Status",
      render: (row) =>
        row.flag === 0 ? (
          <span>Booked</span>
        ) : row.flag === 1 ? (
          <span>Assigned</span>
        ) : row.flag === 2 ? (
          <span>Completed</span>
        ) : row.flag === 3 ? (
          <span>Cancelled</span>
        ) : (
          <span>Unknown</span>
        ),
    },
  ];

  // Define filter data (booking statuses)
  const filterData = [
    { key: "0", label: "Booked", data: isBooked },
    { key: "1", label: "Assigned", data: isAssigned },
    { key: "3", label: "Cancelled", data: isCancelled },
    { key: "2", label: "Completed", data: isCompleted },
  ];

  return (
    <>
      <Layout>
        <div className="pb-10 bg-white mb-4">
          <Breadcrumb
            items={[
              {
                label: (
                  <>
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Home
                  </>
                ),
                link: "/dashboard",
              },
              { label: "Reports", link: "#" },
              { label: "Booking Report", link: "/report/booking" },
            ]}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table columns={columns} data={data} filterData={filterData} />
          </div>
        )}
      </Layout>
    </>
  );
}
