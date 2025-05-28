import React, { useState, useEffect } from "react";
import Button from "../../../components/VButton.jsx";
import Layout from "../../../layouts/Layout.jsx";
import DynamicModal from "../../../components/ExtrasModal.jsx";
import DynamicEditModal from "../../../components/EditModal.jsx";
import Table from "../../../components/IteneryTable.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import EButton from "../../../components/EditBtn.jsx";
import DButton from "../../../components/DangerBtn.jsx";
import Breadcrumb from "../../../components/Breadscrum.jsx";
import { toast } from "react-toastify";

export default function NationalitySetting() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editFormData, setEditFormData] = useState(null); // to hold fetched data
  const [isPackage, setIsPackage] = useState([]);

  // fetch package data
  const fetchPackageData = async () => {
    try {
      const response = await fetch("/api/package-data");
      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }
      const result = await response.json();
      setIsPackage(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageData();
  }, []);

  // Fields for adding/editing itinerary data
  // const fields = [
  //   {
  //     name: "package_name",
  //     label: "Package Name",
  //     type: "select2",
  //     options: isPackage.map((pcks) => ({
  //       value: pcks.package,
  //       label: pcks.package,
  //     })),
  //     defaultValue: "",
  //   },
  //   {
  //     name: "itinerary",
  //     label: "Itinerary",
  //     type: "text",
  //     defaultValue: "",
  //     allowMultiple: true,
  //     placeholder: "Enter itinerary",
  //   },
  //   {
  //     name: "description",
  //     label: "Description",
  //     type: "text",
  //     defaultValue: "",
  //     allowMultiple: true,
  //     placeholder: "Enter Description",
  //   },
  // ];

  const fields = [
    {
      name: "package_name",
      label: "Package Name",
      type: "select2",
      options: isPackage.map((pcks) => ({
        value: pcks.package,
        label: pcks.package,
      })),
      defaultValue: "",
    },
    {
      name: "itenery",
      label: "Itenery",
      type: "group",
      allowMultiple: true,
      fields: [
        {
          name: "itinerary",
          label: "Itenerary",
          type: "text",
          placeholder: "Items",
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          placeholder: "Description",
        },
      ],
    },
  ];

  const editFields = [
    {
      name: "itinerary",
      label: "Itinerary",
      type: "text",
      defaultValue: "",
      placeholder: "Enter itinerary",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      defaultValue: "",
      placeholder: "Description",
    },
  ];

  const columns = [
    { name: "Itinerary", field: "itinerary" },
    { name: "Description", field: "description" },
  ];

  // useEffect to fetch itinerary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/itenery-data");
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

  // Action buttons for Edit/Delete
  const renderActions = (itinerary, itineraryIdx, itineraryId) => {
    return (
      <>
        <EButton
          className="text-green-500"
          label={<FontAwesomeIcon icon={faPen} />}
          onClick={() => handleEdit(itineraryId)} // <-- pass itineraryId
        />
        &nbsp;
        <DButton
          className="text-white-500"
          label={<FontAwesomeIcon icon={faTrash} className="text-white-200" />}
          onClick={() => handleDelete(itineraryId)} // <-- pass itineraryId
        />
      </>
    );
  };

  // Handle Submit form for adding new itinerary

  const handleModalSubmit = async (formData) => {
    try {
      if (!formData.itenery || !Array.isArray(formData.itenery)) {
        throw new Error("Itenery is missing or not an array.");
      }

      for (let itenry of formData.itenery) {
        const dataToSend = {
          package_name: formData.package_name,
          itinerary: itenry.itinerary,
          description: itenry.description, // Use existing description if not provided
        };

        const res = await fetch("/api/itenery-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const data = await res.json();
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const handleEditModalSubmit = async (updatedData) => {
    if (!selectedId) return;
    try {
      const payload = {
        package_name: editFormData?.package_name,
        itinerary: updatedData.itinerary,
        description: updatedData.description,
      };

      const response = await fetch(`/api/itenery-profile/${selectedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setIsEditModalVisible(false);
      toast.warn(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error updating itinerary:", err);
    }
  };

  const handleEdit = async (id) => {
    if (id) {
      setSelectedId(id); // Ensure id is valid
      try {
        const res = await fetch(`/api/itenery-profile/${id}`);
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
      const res = await fetch(`/api/itenery-profile/${id}`, {
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
          { label: "Itinerary", link: "/classification/itinery" },
        ]}
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <Table columns={columns} data={data} renderActions={renderActions} />
        </div>
      )}

      <DynamicModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Add Itinerary"
        fields={fields} // Fields for the form
        onSubmit={handleModalSubmit}
      />
      <DynamicEditModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        title="Edit Itinerary"
        fields={editFields}
        onSubmit={handleEditModalSubmit}
        id={selectedId}
        defaultValues={editFormData}
        packageName={editFormData?.package_name}
      />
    </Layout>
  );
}
