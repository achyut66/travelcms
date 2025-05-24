import React, { useState, useEffect } from "react";
import Button from "../../components/VButton.jsx";
import Layout from "../../layouts/Layout.jsx";
import DynamicModal from "../../components/Modal.jsx";
import DynamicEditModal from "../../components/EditModal.jsx";
import Table from "../../components/Table.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import EButton from "../../components/EditBtn.jsx";
import DButton from "../../components/DangerBtn.jsx";
import Breadcrumb from "../../components/Breadscrum.jsx";
import { toast } from "react-toastify";

export default function InclusionSetting() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editFormData, setEditFormData] = useState(null); // to hold fetched data

  // Fields for adding/editing itinerary data
  const fields = [
    {
      name: "items_name",
      label: "Items",
      type: "text",
      defaultValue: "",
      allowMultiple: true,
      placeholder: "Enter Items",
    },
  ];

  const editFields = [
    {
      name: "items_name",
      label: "Items",
      type: "text",
      defaultValue: "",
      placeholder: "Enter Items",
    },
  ];

  const columns = [
    { key: "index", label: "S.no" },
    { label: "Items", key: "items_name" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/inclusion-data");
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
        <EButton
          className="text-green-500"
          label={<FontAwesomeIcon icon={faPen} />}
          onClick={() => handleEdit(row._id)} // <-- pass itineraryId
        />
        &nbsp;
        <DButton
          className="text-white-500"
          label={<FontAwesomeIcon icon={faTrash} className="text-white-200" />}
          onClick={() => handleDelete(row._id)} // <-- pass itineraryId
        />
      </>
    );
  };

  const handleModalSubmit = async (formData) => {
    try {
      for (let inclusionItem of formData.items_name) {
        const dataToSend = { items_name: inclusionItem };

        await fetch("/api/inclusion-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
      }

      toast.success("All inclusions added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      toast.error("Something went wrong.");
    }
  };

  const handleEditModalSubmit = async (updatedData) => {
    if (!selectedId) return;
    try {
      const response = await fetch(`/api/inclusion-profile/${selectedId}`, {
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
      }, 3000);
      setIsEditModalVisible(false);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const handleEdit = async (id) => {
    if (id) {
      setSelectedId(id);
      try {
        const res = await fetch(`/api/inclusion-profile/${id}`);
        const data = await res.json();
        setEditFormData(data);
        setIsEditModalVisible(true);
      } catch (error) {
        console.error("Failed to fetch itinerary for edit:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) {
      return;
    }
    try {
      const res = await fetch(`/api/inclusion-profile/${id}`, {
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

  return (
    <Layout>
      <div className="text-left ml-[300px] mb-[-53px]">
        <Button
          onClick={() => setIsModalVisible(true)}
          label={
            <>
              <FontAwesomeIcon icon={faPlus} />
            </>
          }
        />
      </div>
      <Breadcrumb
        items={[
          { label: "Home", link: "/dashboard" },
          { label: "Classification", link: "#" },
          { label: "Inclusions", link: "/settings/inclusions" },
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
        title="Add Items"
        fields={fields} // Fields for the form
        onSubmit={handleModalSubmit}
      />
      <DynamicEditModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        title="Edit Items"
        fields={editFields}
        onSubmit={handleEditModalSubmit}
        id={selectedId}
        defaultValues={editFormData}
      />
    </Layout>
  );
}
