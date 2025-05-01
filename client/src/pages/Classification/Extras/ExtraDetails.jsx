import React, { useState, useEffect } from "react";
import Button from "../../../components/VButton.jsx";
import Layout from "../../../layouts/Layout.jsx";
import DynamicModal from "../../../components/ExtrasModal.jsx";
import Table from "../../../components/ExtrasTable.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../../components/Breadscrum.jsx";
import EButton from "../../../components/EditBtn.jsx";
import DButton from "../../../components/DangerBtn.jsx";

export default function ExtraDetails() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Separate modal visibility state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Separate modal visibility state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState([]);

  const [formData, setFormData] = useState({
    booking_id: "",
    extra_item: "",
    extra_item_price: "",
    extra_item_quantity: "",
    extra_item_amount: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch package data (bookings)
  const fetchBookingData = async () => {
    try {
      const response = await fetch("/api/get-isassigned-booking");
      if (!response.ok) {
        throw new Error("Failed to fetch Bookings");
      }
      const result = await response.json();
      setBookingData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  // Fields for adding itinerary data
  const fields = [
    {
      name: "booking_id",
      label: "Booking Name",
      type: "select2",
      options: bookingData.map((pcks) => ({
        value: pcks._id,
        label: pcks.company_name,
      })),
      defaultValue: "",
    },
    {
      name: "extras",
      label: "Extras",
      type: "group",
      allowMultiple: true,
      fields: [
        {
          name: "extra_item",
          label: "Items",
          type: "text",
          placeholder: "Items",
        },
        {
          name: "extra_item_quantity",
          label: "Quantity",
          type: "number",
          placeholder: "Qty",
        },
        {
          name: "extra_item_price",
          label: "Rate",
          type: "number",
          placeholder: "Rate",
        },
        {
          name: "extra_item_amount",
          label: "Amount",
          type: "number",
          placeholder: "Amount",
        },
      ],
    },
  ];

  const columns = [
    { name: "Item", field: "extra_item" },
    { name: "Quantity", field: "extra_item_quantity" },
    { name: "Rate", field: "extra_item_price" },
    { name: "Amount", field: "extra_item_amount" },
    { name: "Actions", field: "actions" },
  ];

  // Handle actions for each row (e.g., Edit, Delete)
  const renderActions = (item) => {
    return (
      <>
        {/* <EButton
          className="text-green-500"
          label={<FontAwesomeIcon icon={faPen} />}
          onClick={() => handleEdit(item)} // <-- pass the entire item
        />
        &nbsp; */}
        <DButton
          className="text-white-500"
          label={<FontAwesomeIcon icon={faTrash} className="text-white-200" />}
          onClick={() => handleDelete(item._id)} // <-- pass the correct ID
        />
      </>
    );
  };

  // Dummy handlers for now
  const handleEdit = (item) => {
    setFormData({
      booking_id: item.booking_id,
      extra_item: item.extra_item,
      extra_item_price: item.extra_item_price,
      extra_item_quantity: item.extra_item_quantity,
      extra_item_amount: item.extra_item_amount,
    });
    setEditId(item._id); // Save the ID for PUT
    setIsEditModalVisible(true); // Open the Edit modal
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this extra?")) return;

    try {
      const res = await fetch(`/api/extras-profile/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete extra.");

      // Refetch data after deletion
      const updatedData = data
        .map((group) => ({
          ...group,
          extras: group.extras.filter((extra) => extra._id !== id),
        }))
        .filter((group) => group.extras.length > 0);

      setData(updatedData);
      alert("Deleted successfully.");
      window.location.href = "/classification/extras";
    } catch (error) {
      console.error("Delete error:", error.message);
      alert("Error deleting.");
    }
  };

  // Fetch extras data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/extras-data");
        if (!response.ok) {
          throw new Error("Failed to fetch extras data");
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

  // Handle form submission for adding new extras
  const handleModalSubmit = async (formData) => {
    try {
      if (!formData.extras || !Array.isArray(formData.extras)) {
        throw new Error("Extras is missing or not an array.");
      }

      for (let extra of formData.extras) {
        const dataToSend = {
          booking_id: formData.booking_id,
          extra_item: extra.extra_item,
          extra_item_price: extra.extra_item_price,
          extra_item_quantity: extra.extra_item_quantity,
          extra_item_amount: extra.extra_item_amount,
        };

        const res = await fetch("/api/extras-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data.message || "Something went wrong while saving extras."
          );
      }

      alert("Extras submitted successfully");
      window.location.href = "/classification/extras"; // Or refetch data
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  // Handle form submission for editing the extras
  const handleEditModalSubmit = async (e) => {
    e.preventDefault();

    const url = isEditMode
      ? `/api/extras-update/${editId}`
      : "/api/extras-register";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong while submitting.");
      }

      alert("Form submitted successfully");
      window.location.href = "/classification/extras"; // Or refetch data
    } catch (error) {
      console.error("Submit error:", error.message);
    }
  };

  return (
    <Layout>
      <div className="text-left ml-[300px] mb-[-53px]">
        <Button
          onClick={() => setIsAddModalVisible(true)} // Show Add Modal
          label={<FontAwesomeIcon icon={faPlus} />}
        />
      </div>
      <Breadcrumb
        items={[
          { label: "Home", link: "/dashboard" },
          { label: "Classification", link: "#" },
          { label: "Extras", link: "/classification/extras" },
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

      {/* Add Extra Modal */}
      <DynamicModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)} // Close Add Modal
        title="Add Extras"
        fields={fields}
        onSubmit={handleModalSubmit}
      />

      {/* Edit Extra Modal */}
      <DynamicModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)} // Close Edit Modal
        title="Edit Extras"
        fields={fields}
        onSubmit={handleEditModalSubmit}
      />
    </Layout>
  );
}
