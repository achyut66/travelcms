import React, { useState, useEffect } from "react";
import Button from "../../components/PButton.jsx";
import Layout from "../../layouts/Layout.jsx";
import DynamicModal from "../../components/Modal.jsx";
import ViewModal from "../../components/ViewModal.jsx";
import Table from "../../components/Table.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import EButton from "../../components/EditBtn.jsx";
import DButton from "../../components/DangerBtn.jsx";
import Breadcrumb from "../../components/Breadscrum.jsx";

export default function NationalitySetting() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [editFormData, setEditFormData] = useState(null); // to hold fetched data
  const a = 1;
  const b = 2;

  const fields = [
    {
      name: "nationality",
      label: "Nationality",
      type: "text",
      defaultValue: "",
    },
  ];

  // Table data columns
  const columns = [
    { key: "index", label: "S.no" },
    { key: "nationality", label: "Nationality" },
    { key: "code", label: "Code" },
  ];
  // useeffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/nationality-data");
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderActions = (row) => {
    return (
      <>
        {a === b ? (
          <EButton
            className="text-green-500"
            label="Edit"
            onClick={() => handleEdit(row._id)} // or row.id based on your data
          />
        ) : (
          "###"
        )}
      </>
    );
  };
  // Handling submit form
  const handleModalSubmit = async (formData) => {
    try {
      const res = await fetch("/api/nationality-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- ADD THIS
        },
        body: JSON.stringify(formData), // <-- SEND JSON
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert("Form submitted successfully");
      window.location.href = "/settings/nationality";
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const handleEditModalSubmit = async (updatedData) => {
    if (!selectedId) return;
    try {
      const response = await fetch(`/api/nationality-profile/${selectedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Something went wrong");

      alert("Form updated successfully");
      window.location.href = "/settings/nationality";
      setIsEditModalVisible(false);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const handleEdit = async (id) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/nationality-profile/${id}`);
      const data = await res.json();
      setEditFormData(data); // Set the fetched data
      setIsEditModalVisible(true); // Open modal
    } catch (error) {
      console.error("Failed to fetch data for edit:", error);
    }
  };

  return (
    <>
      <Layout>
        {a === b && (
          <div className="py-2 w-10 text-right">
            <Button
              onClick={() => setIsModalVisible(true)}
              label={
                <>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                </>
              }
            />
          </div>
        )}
        <Breadcrumb
          items={[
            { label: "Home", link: "/dashboard" },
            { label: "Settings", link: "#" },
            { label: "Nationality", link: "/settings/nationality" },
          ]}
        />
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table columns={columns} data={data} actions={renderActions} />
          </div>
        )}

        <DynamicModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title="Add Nationality"
          fields={fields}
          onSubmit={handleModalSubmit}
        />
        <DynamicModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          title="Edit Nationality"
          fields={fields}
          onSubmit={handleEditModalSubmit}
          id={selectedId}
          defaultValues={editFormData}
        />
      </Layout>
    </>
  );
}
