import React, { useState, useEffect } from "react";
import Button from "../../components/VButton.jsx";
import Layout from "../../layouts/Layout.jsx";
import DynamicModal from "../../components/Modal.jsx";
import ViewModal from "../../components/ViewModal.jsx";
import Table from "../../components/Table.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import EButton from "../../components/EditBtn.jsx";
import DButton from "../../components/DangerBtn.jsx";
import Breadcrumb from "../../components/Breadscrum.jsx";
import { toast } from "react-toastify";

export default function LanguageSetting() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [editFormData, setEditFormData] = useState(null); // to hold fetched data

  const fields = [
    {
      name: "language",
      label: "Language",
      type: "text",
      defaultValue: "",
    },
  ];

  // Table data columns
  const columns = [
    { key: "index", label: "S.no" },
    { key: "language", label: "Language" },
  ];
  // useeffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/language-data");
        if (!response.ok) {
          throw new Error("Failed to fetch language");
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

  const handleDelete = async (id) => {
    if (!window.confirm("You really want to delete?")) return;
    try {
      const res = await fetch(`/api/language-profile/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      toast.error(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error deleting purpose:", error);
    }
  };

  const renderActions = (row) => {
    return (
      <>
        <EButton
          className="text-green-500"
          label={<FontAwesomeIcon icon={faPen} />}
          onClick={() => handleEdit(row._id)} // or row.id based on your data
        />
        &nbsp;
        <DButton
          className="text-gray-500"
          label={<FontAwesomeIcon icon={faTrash} />}
          onClick={() => handleDelete(row._id)} // or row.id based on your data
        />
      </>
    );
  };
  // Handling submit form
  const handleModalSubmit = async (formData) => {
    try {
      const res = await fetch("/api/language-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- ADD THIS
        },
        body: JSON.stringify(formData), // <-- SEND JSON
      });

      const data = await res.json();
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const handleEditModalSubmit = async (updatedData) => {
    if (!selectedId) return;
    try {
      const response = await fetch(`/api/language-profile/${selectedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      toast.warn(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setIsEditModalVisible(false);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const handleEdit = async (id) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/language-profile/${id}`);
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
        <div className="text-left ml-[280px] mb-[-53px]">
          <Button
            onClick={() => setIsModalVisible(true)}
            label={
              <>
                <FontAwesomeIcon icon={faPlus} className="mr-0" />
              </>
            }
          />
        </div>
        <Breadcrumb
          items={[
            { label: "Home", link: "/dashboard" },
            { label: "Settings", link: "#" },
            { label: "Language", link: "/settings/language" },
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
          title="Add Purpose Of Visit"
          fields={fields}
          onSubmit={handleModalSubmit}
        />
        <DynamicModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          title="Edit Purpose Of Visit"
          fields={fields}
          onSubmit={handleEditModalSubmit}
          id={selectedId}
          defaultValues={editFormData}
        />
      </Layout>
    </>
  );
}
