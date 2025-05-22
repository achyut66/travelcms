import React, { useEffect, useState } from "react";
import Button from "../../components/VButton.jsx";
import Layout from "../../layouts/Layout.jsx";
import Table from "../../components/extras/EquipmentTable.jsx";
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
  const [isDamage, setDamage] = useState([]);
  const [isRemain, setRemain] = useState([]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewFormData, setViewFormData] = useState(null); // to hold fetched data

  const fetchData = async () => {
    try {
      const response = await fetch("/api/get-equipment-data-total");
      const result = await response.json();
      //   console.log(result.extras);
      if (response.ok) {
        setData(result.extras);
        setDamage(result.damaged_item_amt);
        setRemain(result.remaining_item_amt);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while fetching data.", error);
    }
    setLoading(false);
  };

  const mergedData = data.map((item, index) => ({
    ...item,
    total_amt: item.number * item.rate,
    damagedprice: isDamage[index],
    availableprice: isRemain[index],
  }));

  // Define columns for the table

  const columns = [
    { key: "equipment_name", label: "Name Of Items" },
    { key: "number", label: "Total Items" },
    { key: "rate", label: "Item Rate" },
    { key: "total_amt", label: "Items Total" },
    { key: "damaged", label: "Damaged Items" },
    { key: "damagedprice", label: "Loss" },
    { key: "available", label: "Available Items" },
    { key: "availableprice", label: "Remaining Price" },
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
                label: "Equipment Account Report",
                link: "/account/equipment-account-report",
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
              data={mergedData}
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
          "equipment_name",
          "number",
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
