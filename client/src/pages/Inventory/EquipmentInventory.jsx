import React, { useState, useEffect } from "react";
import Button from "../../components/VButton.jsx";
import Layout from "../../layouts/Layout.jsx";
import DynamicModal from "../../components/Modal.jsx";
import Table from "../../components/Table.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faHome,
  faWrench,
  faIndustry,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import EButton from "../../components/EditBtn.jsx";
import DButton from "../../components/DangerBtn.jsx";
import PUButton from "../../components/PUButton.jsx";
import SButton from "../../components/SubmitBtn.jsx";
import Breadcrumb from "../../components/Breadscrum.jsx";
import { toast } from "react-toastify";

export default function EquipmentSetting() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [editFormData, setEditFormData] = useState(null); // to hold fetched data

  const fields = [
    {
      name: "equipment",
      label: "Equipments",
      type: "group",
      allowMultiple: true,
      fields: [
        {
          name: "equipment_name",
          label: "Items",
          type: "text",
          placeholder: "Items",
        },
        {
          name: "number",
          label: "Quantity",
          type: "number",
          placeholder: "Qty",
        },
      ],
    },
  ];
  // edit feilds
  const editFeilds = [
    {
      name: "equipment_name",
      lable: "Item Name",
      type: "text",
      placeholder: "name",
    },
    {
      name: "number",
      type: "string",
      label: "Qty",
      placeholder: "Qty",
    },
  ];
  // Table data columns
  const columns = [
    { key: "index", label: "S.no" },
    { key: "equipment_name", label: "Equipment Name" },
    { key: "number", label: "No. Of Items" },
    { key: "is_available", label: "If Damaged ?", type: "boolean" },
  ];
  // useeffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/equipment-data");
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
          onClick={() => handleEdit(row._id)} // or row.id based on your data
        />
        &nbsp;
        <DButton
          className="text-gray-500"
          label={<FontAwesomeIcon icon={faTrash} />}
          onClick={() => handleDelete(row._id)} // or row.id based on your data
        />
        &nbsp;
        <PUButton
          className="text-gray-500"
          label={<FontAwesomeIcon icon={faTriangleExclamation} />}
          onClick={() => handleMaintainance(row._id)} // or row.id based on your data
          tooltip={"If Damage ???"}
        />
        {/* &nbsp;
        <SButton
          className="text-gray-500"
          label={<FontAwesomeIcon icon={faRandom} />}
          onClick={() => handleMaintainanceReturn(row._id)} // or row.id based on your data
          tooltip={"Return After Maintainance"}
        /> */}
      </>
    );
  };
  // Handling submit form
  const handleModalSubmit = async (formData) => {
    try {
      if (!formData.equipment || !Array.isArray(formData.equipment)) {
        throw new Error("Equipment is missing or not an array.");
      }

      for (let equip of formData.equipment) {
        const dataToSend = {
          equipment_name: equip.equipment_name,
          number: equip.number,
        };

        const res = await fetch("/api/equipment-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Submission failed");
        }
      }

      toast.success("All equipment submitted successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error.message);
      toast.error("Failed to submit equipment.");
    }
  };

  const handleEditModalSubmit = async (updatedData) => {
    if (!selectedId) return;
    try {
      const response = await fetch(`/api/equipment-update/${selectedId}`, {
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
      const res = await fetch(`/api/equipment-data-id/${id}`);
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch equipment");
      }
      setEditFormData(result.data); // <- extract the `data` object
      setIsEditModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch data for edit:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("You really want to delete?")) return;
    try {
      const res = await fetch(`/api/equipment-profile/${id}`, {
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

  const handleMaintainance = async (id) => {
    if (!window.confirm("If Eqipment Is Damaged ?")) return;
    try {
      const res = await fetch(`/api/check-flag/${id}`, {
        method: "GET",
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
    <>
      <Layout>
        <div className="text-left ml-[350px] mb-[-53px]">
          <Button
            onClick={() => setIsModalVisible(true)}
            label={
              <>
                <FontAwesomeIcon icon={faPlus} className="" />
              </>
            }
          />
        </div>
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
            {
              label: (
                <>
                  <FontAwesomeIcon icon={faIndustry} className="mr-2" />
                  Inventory
                </>
              ),
              link: "#",
            },
            {
              label: (
                <>
                  <FontAwesomeIcon icon={faWrench} className="mr-2" />
                  Equipment
                </>
              ),
              link: "/inventory/equipment",
            },
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
          title="Add Equipment Information"
          fields={fields}
          onSubmit={handleModalSubmit}
        />
        <DynamicModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          title="Edit Equipment Information"
          fields={editFeilds}
          onSubmit={handleEditModalSubmit}
          id={selectedId}
          defaultValues={editFormData}
        />
      </Layout>
    </>
  );
}
