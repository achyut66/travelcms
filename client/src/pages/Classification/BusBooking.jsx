import React, { useState, useEffect } from "react";
import Button from "../../components/VButton.jsx";
import RButton from "../../components/ReceiptBtn.jsx";
import Layout from "../../layouts/Layout.jsx";
import DynamicModal from "../../components/GridModal.jsx";
import DynamicEditModal from "../../components/EditGridModal.jsx";
import ViewModal from "../../components/GridFlightViewModal.jsx";
import ReceiptViewModal from "../../components/FlightReceipt.jsx";
import Table from "../../components/FlightTable.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPlus,
  faPen,
  faHome,
  faTimes,
  faCheckCircle,
  faReceipt,
  // faSmile,
} from "@fortawesome/free-solid-svg-icons";
import EButton from "../../components/EditBtn.jsx";
import PUButton from "../../components/PUButton.jsx";
import DButton from "../../components/DangerBtn.jsx";
import SButton from "../../components/SubmitBtn.jsx";
import Select from "react-select";
import Breadcrumb from "../../components/Breadscrum.jsx";
import DynamicAccessModal from "../../components/Modal.jsx";
import BookingCompleteModal from "../../components/Modal.jsx";
import BookingCancelModal from "../../components/Modal.jsx";
import PickUpModal from "../../components/Modal.jsx";
import { toast } from "react-toastify";

export default function VehicleBooking() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const [packageData, setPackageData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);
  const [purposeData, setPurposeData] = useState([]);
  const [nationalityData, setNationalityData] = useState([]);
  const [languageData, setlanguageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [data, setData] = useState([]);
  const [travellerData, setTravellerData] = useState([]);
  const [travellerReceiptData, setReceiptTravellerData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [viewFormData, setViewFormData] = useState(null); // to hold fetched data
  const [viewReceiptFormData, setViewReceiptFormData] = useState(null); // to hold fetched data
  const [editFormData, setEditFormData] = useState(null); // Add this at the top
  const [editTravellerData, setEditTravellerData] = useState(null); // Add this at the top

  // if booking is completed
  const [ifComplete, setIfComplete] = useState("");

  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);

  // package state
  const getPackageData = async () => {
    try {
      const response = await fetch("/api/package-data");
      const data = await response.json();
      setPackageData(data);
    } catch (error) {
      console.error("Error fetching package:", error.message);
    }
  };
  const getPaymentMethodData = async () => {
    try {
      const response = await fetch("/api/payment-method-data");
      const data = await response.json();
      setPaymentMethodData(data);
    } catch (error) {
      console.log("Fetch Error", error.message);
    }
  };
  const getPaymentStatusData = async () => {
    try {
      const response = await fetch("/api/payment-status-data");
      const data = await response.json();
      setPaymentStatusData(data);
    } catch (error) {
      console.log("Fetch Error", error.message);
    }
  };
  const getPurposeData = async () => {
    try {
      const response = await fetch("/api/visit-purpose-data");
      const data = await response.json();
      setPurposeData(data);
    } catch (error) {
      console.log("Fetch Error", error.message);
    }
  };
  const getNationalityData = async () => {
    try {
      const response = await fetch("/api/nationality-data");
      const data = await response.json();
      setNationalityData(data);
    } catch (error) {
      console.log("Fetch Error", error.message);
    }
  };
  const getLanguageData = async () => {
    try {
      const response = await fetch("/api/language-data");
      const data = await response.json();
      setlanguageData(data);
    } catch (error) {
      console.log("Fetch Error", error.message);
    }
  };
  const getBookingData = async () => {
    try {
      const response = await fetch("/api/get-flight-booking-details");
      if (!response.ok) {
        throw new Error("Failed to fetch booking details");
      }
      const result = await response.json();
      // console.log(result);

      setData(result.data); // Accessing `.data` inside the result
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPackageData();
    getPaymentMethodData();
    getPaymentStatusData();
    getPurposeData();
    getNationalityData();
    getLanguageData();
    getBookingData();
  }, []);

  // Handling submit form
  const fields = [
    {
      h2Title: "Flight Information",
    },
    {
      name: "company_name",
      label: "Company / Person Name",
      type: "text",
      required: true,
      defaultValue: "",
    },
    {
      name: "dept_airport",
      label: "Departure Airport",
      type: "text",
      required: true,
      defaultValue: "",
    },
    {
      name: "arrv_airport",
      label: "Arrival Airport",
      required: true,
      type: "text",
      defaultValue: "",
    },
    {
      name: "dept_date",
      label: "Departure Date",
      required: true,
      type: "date",
      defaultValue: "",
    },
    {
      name: "dept_time",
      label: "Departure Time",
      required: true,
      type: "time",
      defaultValue: "",
    },
    {
      name: "return_date",
      label: "Return Date",
      type: "date",
      defaultValue: "",
    },
    {
      name: "return_time",
      label: "Return Time",
      type: "time",
      defaultValue: "",
    },
    {
      name: "flight_no",
      label: "Flight Number",
      type: "text",
      defaultValue: "",
    },
    {
      name: "service_class",
      label: "Service Class",
      type: "select2",
      required: true,
      options: [
        { label: "Business", value: "Business" },
        { label: "Economy", value: "Economy" },
      ],
      defaultValue: "",
    },

    // baggage information
    {
      h2Title: "Baggage Information",
    },
    {
      name: "no_of_checked_baggage",
      label: "Checked Baggage",
      type: "number",
      defaultValue: "",
    },
    {
      name: "baggage_weight",
      label: "Weight",
      type: "number",
      defaultValue: "",
    },
    {
      name: "additional_baggage",
      label: "Additional Baggage",
      type: "number",
      defaultValue: "",
    },

    // Payment information
    {
      h2Title: "Payment Information",
    },
    {
      name: "payment_method",
      label: "Method Of Payment",
      required: true,
      type: "select2",
      options: paymentMethodData.map((pckm) => ({
        value: pckm.method,
        label: pckm.method,
      })),
      defaultValue: "",
    },
    {
      name: "billing_address",
      label: "Billing Address",
      type: "text",
      defaultValue: "",
    },

    // additional service
    {
      h2Title: "Additional Details",
    },
    {
      name: "insurance",
      label: "Insurance",
      type: "text",
      defaultValue: "",
    },
    {
      name: "special_assist",
      label: "Special Assistant",
      type: "text",
      defaultValue: "",
    },

    // traveller
    {
      h2Title: "Traveller Details",
    },
    {
      name: "pax_no",
      label: "No of PAX",
      required: true,
      type: "number",
      isNote: true,
      defaultValue: "",
    },
    {
      extraFields: [
        {
          name: "full_name[]",
          type: "text",
          label: "Full Name",
          required: true,
          defaultValue: "",
        },
        {
          name: "dob[]",
          type: "date",
          label: "DOB",
          defaultValue: "",
        },
        {
          name: "gender[]",
          label: "Gender",
          required: true,
          type: "select2",
          options: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Others", label: "Others" },
          ],
          defaultValue: "",
        },
        {
          name: "pass_type[]",
          label: "Type",
          required: true,
          type: "select2",
          options: [
            { value: "Adult", label: "Adult (ADT)" },
            { value: "Child", label: "Child (CHD)" },
            { value: "Infant", label: "Infant (INF)" },
            { value: "Senior", label: "senior (SRC)" },
          ],
          defaultValue: "",
        },
        {
          name: "passport_no[]",
          label: "Passport Number",
          required: true,
          type: "number",
          defaultValue: "",
        },
        {
          name: "nationality[]",
          label: "Nationality",
          type: "select2",
          options: nationalityData.map((pcks) => ({
            value: pcks.nationality,
            label: pcks.nationality,
          })),
          defaultValue: "",
        },
        {
          name: "contact_no[]",
          label: "Contact Number",
          type: "text",
          defaultValue: "",
        },
        {
          name: "email[]",
          label: "Email",
          type: "text",
          defaultValue: "",
        },
        {
          name: "rate[]",
          label: "Rate",
          type: "number",
          defaultValue: "",
        },
        {
          name: "special_req[]",
          label: "Special Request",
          type: "text",
          defaultValue: "",
        },
      ],
      extraEditFields: [
        {
          name: "full_name",
          type: "text",
          label: "Full Name",
          required: true,
          defaultValue: "",
        },
        {
          name: "dob",
          type: "date",
          label: "DOB",
          defaultValue: "",
        },
        {
          name: "gender",
          label: "Gender",
          required: true,
          type: "select2",
          options: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Others", label: "Others" },
          ],
          defaultValue: "",
        },
        {
          name: "passport_no",
          label: "Passport Number",
          required: true,
          type: "number",
          defaultValue: "",
        },
        {
          name: "nationality",
          label: "Nationality",
          type: "select2",
          options: nationalityData.map((pcks) => ({
            value: pcks.nationality,
            label: pcks.nationality,
          })),
          defaultValue: "",
        },
        {
          name: "contact_no",
          label: "Contact Number",
          type: "text",
          defaultValue: "",
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          defaultValue: "",
        },
        {
          name: "special_req",
          label: "Special Request",
          type: "text",
          defaultValue: "",
        },
      ],
    },
  ];

  //  handle submit
  const handleModalSubmit = async (formData) => {
    try {
      const formPayload = new FormData();
      console.log(formData);
      const excludedTravellerKeys = ["pax_details"];
      Object.entries(formData).forEach(([key, value]) => {
        if (!excludedTravellerKeys.includes(key)) {
          if (key === "invoice_receipt" && value instanceof File) {
            formPayload.append("invoice_receipt", value);
          } else {
            formPayload.append(key, value);
          }
        }
      });

      const travellers = formData.pax_details || [];
      if (!Array.isArray(travellers) || travellers.length === 0) {
        throw new Error("At least one traveller is required.");
      }

      travellers.forEach((traveller, index) => {
        const {
          "full_name[]": name,
          "dob[]": dob,
          "gender[]": gender,
          "pass_type[]": passtype,
          "rate[]": rate,
          "nationality[]": nationality,
          "passport_no[]": passport,
          "contact_no[]": contact,
          "special_req[]": request,
        } = traveller;

        if (!name || !passport) {
          throw new Error(`Traveller ${index + 1} is missing required fields.`);
        }

        formPayload.append("full_name[]", name);
        formPayload.append("dob[]", dob || "");
        formPayload.append("gender[]", gender || "");
        formPayload.append("pass_type[]", passtype || "");
        formPayload.append("rate[]", rate || "");
        formPayload.append("nationality[]", nationality);
        formPayload.append("passport_no[]", passport);
        formPayload.append("contact_no[]", contact || "");
        formPayload.append("special_req[]", request || "");
      });

      const response = await fetch("/api/flight-register", {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();
      toast.success(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error: " + error.message);
    }
  };

  // handle edit modal submit
  const handleEditModalSubmit = async (formData) => {
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "invoice_receipt" && key !== "pax_details") {
          formPayload.append(key, value);
        }
      });

      if (formData.invoice_receipt instanceof File) {
        formPayload.append("invoice_receipt", formData.invoice_receipt);
      }

      const paxDetails = formData.pax_details.map(
        ({ visa_copies, ...rest }) => rest
      );
      formPayload.append("pax_details", JSON.stringify(paxDetails));

      // Append traveller visa copies
      formData.pax_details.forEach((traveller, index) => {
        if (traveller.visa_copies instanceof File) {
          formPayload.append("visa_copies", traveller.visa_copies);
        }
      });
      // console.log(formData);
      // Send request to the server
      const response = await fetch(
        `/api/update-flight-booking-and-traveller/${selectedId}`,
        {
          method: "PUT",
          body: formPayload,
        }
      );
      const result = await response.json();
      toast.warn(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setIsEditModalVisible(false); // Close the modal after successful update
      getBookingData(); // Refresh the data after update
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error: " + error.message);
    }
  };

  // table to display data
  const columns = [
    { key: "index", label: "S.no" },
    { key: "company_name", label: "Company Name" },
    { key: "dept_airport", label: "Departure Airport" },
    { key: "arrv_airport", label: "Arrival Airport" },
    { key: "service_class", label: "Service Class" },
    { key: "dept_date", label: "Departure Date" },
    { key: "return_date", label: "Return Date" },
    { key: "pax_no", label: "Pax No" },
    {
      key: "flag",
      label: "Booking Status",
      render: (row) =>
        row.flag === 0 ? (
          <span className="bg-blue-200 p-3" title="This booking has been made.">
            "Booked"
          </span>
        ) : row.flag === 1 ? (
          <span
            className="bg-yellow-200 p-3"
            title="Tasks assigned to guides/porter."
          >
            "Assigned"
          </span>
        ) : row.flag === 2 ? (
          <span className="bg-green-500 p-3" title="This task is completed">
            "Completed"
          </span>
        ) : row.flag === 4 ? (
          <span className="bg-gray-300 p-3" title="Sent Person To Pick-Up">
            "Picking-Up"
          </span>
        ) : row.flag === 3 ? (
          <span
            className="bg-red-600 p-3 text-white"
            title="This booking is canceled"
          >
            "Cancelled"
          </span>
        ) : (
          <span className="bg-gray-200 p-3">"Unknown"</span>
        ),
    },
  ];

  const handleView = async (id) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/get-flightbooking-with-travellers/${id}`);
      const data = await res.json();
      setViewFormData(data.data); // Set the fetched data
      setTravellerData(data.data.travellers);
      setIsViewModalVisible(true); // Open modal
    } catch (error) {
      console.error("Failed to fetch data for edit:", error);
    }
  };

  const handleReceiptView = async (id) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/get-flightbooking-with-travellers/${id}`);
      const data = await res.json();
      console.log(data);
      if (data.data) {
        setViewReceiptFormData(data.data);
        setReceiptTravellerData(data.data.travellers);
        setIsReceiptModalVisible(true);
      } else {
        // Handle case when data.data is not available
        console.error("No data found for this booking");
      }
    } catch (error) {
      console.error("Failed to fetch data for edit:", error);
    }
  };

  const handleEdit = async (id) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/get-flightbooking-with-travellers/${id}`);
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to fetch edit data");
      setEditFormData(result.data);
      setEditTravellerData(result.data.travellers);
      setIsEditModalVisible(true);
    } catch (error) {
      console.error("Edit fetch error:", error);
      alert("Error fetching edit data: " + error.message);
    }
  };

  const handleComplete = async (id) => {
    const confirmComplete = window.confirm(
      "Are you sure you want to complete this booking?"
    );

    if (!confirmComplete) {
      return; // Exit if the user cancels the action
    }
    try {
      const res = await fetch("/api/flight-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking_id: id }),
      });

      const result = await res.json();
      toast.success(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error complete booking:", error);
      alert(error.message);
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return; // Exit if the user cancels the action
    }
    try {
      const res = await fetch("/api/flight-cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking_id: id }),
      });

      const result = await res.json();
      toast.error(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchIfCompleteOnly = async () => {
      try {
        const completeOnly = await fetch("/api/getifbookingcompleted");
        const result = await completeOnly.json();
        setIfComplete(result);
        // console.log(result);
      } catch (error) {
        console.log("Error while fetching completed booking", error);
      }
    };

    fetchIfCompleteOnly();
  }, []); // Empty dependency array to run the effect only once
  // handle edit view
  const renderActions = (row) => {
    const handleHover = () => {};
    return (
      <div onMouseEnter={handleHover}>
        <Button
          className="text-blue-500"
          label={<FontAwesomeIcon icon={faEye} />}
          onClick={() => handleView(row._id)}
          tooltip="View Booking"
        />
        &nbsp;
        <EButton
          className="text-gray-500"
          label={<FontAwesomeIcon icon={faPen} />}
          onClick={() => handleEdit(row._id)}
          tooltip="Edit Booking"
          disabled={[2, 3].includes(row.flag)}
        />
        &nbsp;
        <DButton
          className="text-red-500"
          label={<FontAwesomeIcon icon={faTimes} />}
          onClick={() => handleCancel(row._id)}
          tooltip="Cancel Booking"
          disabled={[2, 3].includes(row.flag)}
        />
        &nbsp;
        <SButton
          className="text-green-500"
          label={<FontAwesomeIcon icon={faCheckCircle} />}
          onClick={() => handleComplete(row._id)}
          tooltip="Is Booking Completed?"
          disabled={[2, 3].includes(row.flag)}
        />
        &nbsp;
        {row.flag === 2 ? (
          <RButton
            className="text-green-500"
            label={<FontAwesomeIcon icon={faReceipt} />}
            tooltip="Generate Receipt"
            onClick={() => handleReceiptView(row._id)}
          />
        ) : null}
      </div>
    );
  };
  const displayColumns = [
    {
      section: "Flight Information",
      fields: [
        "company_name",
        "dept_airport",
        "arrv_airport",
        "dept_date",
        "dept_time",
        "return_date",
        "return_time",
        "flight_no",
        "service_class",
      ],
    },
    {
      section: "Baggage Information",
      fields: ["no_of_checked_baggage", "baggage_weight", "additional_baggage"],
    },
    {
      section: "Payment Information",
      fields: ["payment_method", "billing_address"],
    },
    {
      section: "Additional Details",
      fields: ["insurance", "special_assist"],
    },
    {
      section: "Traveller Details",
      fields: ["pax_no"],
    },
  ];

  return (
    <>
      <Layout>
        <div className="text-left ml-[370px] mb-[-53px]">
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
            {
              label: (
                <>
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </>
              ),
              link: "/dashboard",
            },
            { label: "Classification", link: "#" },
            { label: "Booking Details", link: "/booking" },
          ]}
        />
        {loading ? (
          <div>&nbsp;</div>
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
          title="Flight Booking Information"
          fields={fields}
          onSubmit={handleModalSubmit}
        />
        <DynamicEditModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          title="Edit Flight Booking Information"
          fields={fields}
          defaultValues={editFormData}
          defaultTravellerdata={editTravellerData}
          onSubmit={handleEditModalSubmit}
        />

        <ViewModal
          visible={isViewModalVisible}
          onClose={() => setIsViewModalVisible(false)}
          data={viewFormData}
          travellers={travellerData}
          id={selectedId}
          displayColumns={displayColumns}
        />

        {viewReceiptFormData ? (
          <ReceiptViewModal
            visible={isReceiptModalVisible}
            onClose={() => setIsReceiptModalVisible(false)}
            receiptData={viewReceiptFormData}
            travellers={travellerReceiptData}
          />
        ) : (
          <div>&nbsp;</div> // Or any other loading state
        )}
      </Layout>
    </>
  );
}
