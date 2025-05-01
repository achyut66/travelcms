import React, { useState, useEffect } from "react";
import Button from "../../components/VButton.jsx";
import Layout from "../../layouts/Layout.jsx";
import DynamicModal from "../../components/Modal.jsx";
import ViewModal from "../../components/ViewModal.jsx";
import Table from "../../components/Table.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faEye } from "@fortawesome/free-solid-svg-icons";
import EButton from "../../components/EditBtn.jsx";
import Breadcrumb from "../../components/Breadscrum.jsx";

export default function CompanyProfile() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [datacount, setDataCount] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [editFormData, setEditFormData] = useState(null); // to hold fetched data
  const [viewFormData, setViewFormData] = useState(null); // to hold fetched data

  const fields = [
    {
      name: "company_name",
      label: "Company Name",
      type: "text",
      defaultValue: "",
    },
    {
      name: "company_address",
      label: "Address",
      type: "text",
      defaultValue: "",
    },
    {
      name: "contact_person",
      label: "Contact Person",
      type: "text",
      defaultValue: "",
    },
    {
      name: "contact_number",
      label: "Contact Number",
      type: "text",
      defaultValue: "",
    },
    {
      name: "vat_no",
      label: "VAT Number",
      type: "text",
      defaultValue: "",
    },
    {
      name: "company_logo",
      label: "Company Logo",
      type: "file",
      defaultValue: "",
    },
  ];

  // Table data columns
  const columns = [
    { key: "index", label: "S.no" },
    { key: "company_name", label: "Company Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "vat_no", label: "VAT Number" },
    { key: "company_logo", label: "Company Logo" },
  ];
  // useeffect
  useEffect(() => {
    const fetchDataCount = async () => {
      try {
        const response = await fetch("/api/count-profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const result = await response.json();
        setDataCount(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataCount();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/profile-data");
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
        <Button
          className="text-blue-500"
          label={<FontAwesomeIcon icon={faEye} />}
          onClick={() => handleView(row._id)}
        />
        &nbsp;
        <EButton
          className="text-green-500"
          label={<FontAwesomeIcon icon={faPen} />}
          onClick={() => handleEdit(row._id)} // or row.id based on your data
        />
      </>
    );
  };
  // Handling submit form
  const handleModalSubmit = async (formData) => {
    try {
      const formPayload = new FormData();
      for (const key in formData) {
        formPayload.append(key, formData[key]);
      }

      const res = await fetch("/api/profile-register", {
        method: "POST",
        body: formPayload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      alert("Form submitted successfully");
      window.location.href = "/settings/company-profile"; // Redirect after success
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };
  const handleEditModalSubmit = async (updatedData) => {
    if (!selectedId) return;
    try {
      const formData = new FormData();
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }
      const response = await fetch(`/api/company-profile/${selectedId}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to update company profile");
      }
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Something went wrong");
      alert("Form updated successfully");
      window.location.href = "/settings/company-profile"; // Redirect after success
      setIsEditModalVisible(false);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const handleEdit = async (id) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/company-profile/${id}`);
      const data = await res.json();
      setEditFormData(data); // Set the fetched data
      setIsEditModalVisible(true); // Open modal
    } catch (error) {
      console.error("Failed to fetch data for edit:", error);
    }
  };

  const handleView = async (id) => {
    setSelectedId(id);

    try {
      const res = await fetch(`/api/company-profile/${id}`);
      const data = await res.json();

      setViewFormData(data); // Set the fetched data
      setIsViewModalVisible(true); // Open modal
    } catch (error) {
      console.error("Failed to fetch data for edit:", error);
    }
  };

  return (
    <>
      <Layout>
        {/* <div className="py-2 w-10 text-right">
          <Button
            disabled={datacount > 0}
            onClick={() => setIsModalVisible(true)}
            label={
              <>
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
              </>
            }
          />
        </div> */}
        <Breadcrumb
          items={[
            { label: "Home", link: "/dashboard" },
            { label: "Settings", link: "#" },
            { label: "Company Profille", link: "/company-profile" },
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
          title="Add Company Profile"
          fields={fields}
          onSubmit={handleModalSubmit}
        />
        <DynamicModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          title="Edit Company Profile"
          fields={fields}
          onSubmit={handleEditModalSubmit}
          id={selectedId}
          defaultValues={editFormData}
        />
        <ViewModal
          visible={isViewModalVisible}
          onClose={() => setIsViewModalVisible(false)}
          title="View Company Profile"
          data={viewFormData}
          displayColumns={[
            "company_name",
            "contact_person",
            "contact_number",
            "company_logo",
            "vat_no",
          ]} // specify the columns to show
        />
      </Layout>
    </>
  );
}
