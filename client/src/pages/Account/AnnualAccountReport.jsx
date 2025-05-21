import React, { useEffect, useState } from "react";
import Button from "../../components/VButton.jsx";
import Layout from "../../layouts/Layout.jsx";
import Table from "../../components/report/AccountReportTable.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEye,
  // faSmile,
} from "@fortawesome/free-solid-svg-icons";
import EButton from "../../components/EditBtn.jsx";
import PUButton from "../../components/PUButton.jsx";
import DButton from "../../components/DangerBtn.jsx";
import SButton from "../../components/SubmitBtn.jsx";
import Breadcrumb from "../../components/Breadscrum.jsx";
import ViewModal from "../../components/ViewModalWithTables.jsx";

export default function AccountReport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [year, setYear] = useState([]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewFormData, setViewFormData] = useState(null); // to hold fetched data

  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const fetchData = async () => {
    try {
      const response = await fetch("/api/month-wise-account-report");
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setYear(result.year);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while fetching data.", error);
    }
    setLoading(false);
  };

  // Define columns for the table

  const columns = [
    { key: "month", label: "Month" },
    { key: "count", label: "No of Packages" },
    { key: "package_total", label: "Package Revenue" },
    { key: "extra_total", label: "Extra Expenses" },
    { key: "due_amount", label: "Dues" },
    { key: "receive_amount", label: "Received" },
  ];

  //  handling view modal

  const handleCountClick = async (ids) => {
    try {
      const res = await fetch("/api/account-report/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const result = await res.json();
      setViewFormData(result.data); // Display in modal
      setIsViewModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch count details:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Layout>
        <div className="pb-0 bg-white mb-4">
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
              { label: "Account", link: "#" },
              {
                label: "Annual Account Report",
                link: "/account/annual-account-report",
              },
            ]}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table
              columns={columns}
              data={data}
              year={year}
              onCountClick={handleCountClick}
            />
          </div>
        )}
      </Layout>
      <ViewModal
        visible={isViewModalVisible}
        onClose={() => setIsViewModalVisible(false)}
        title="Annual Account Report"
        data={viewFormData}
        displayColumns={[
          "company_name",
          "contact_number",
          "contact_email",
          "package_name",
          "pax_no",
          "package_total",
          "extra_total",
          "receive_amount",
          "due_amount",
        ]}
      />
    </>
  );
}
