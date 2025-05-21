import React, { useState, useEffect } from "react";
import Button from "../../components/VButton.jsx";
import RButton from "../../components/ReceiptBtn.jsx";
import Layout from "../../layouts/Layout.jsx";
import DynamicModal from "../../components/GridModal.jsx";
import DynamicEditModal from "../../components/EditGridModal.jsx";
import ViewModal from "../../components/GridViewModal.jsx";
import ReceiptViewModal from "../../components/ReceiptModal.jsx";
import Table from "../../components/Table.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPlus,
  faPen,
  faHome,
  faClipboardList,
  faTimes,
  faCheckCircle,
  faTruckPickup,
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

export default function CompanyProfile() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isAccessModalVisible, setIsAccessModalVisible] = useState(false);

  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [isPickUpModalVisible, setIsPickUpModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

  const [dataWithPotter, setdataWithPotter] = useState(null); // to hold fetched data
  const [isVehicleUsed, setIsVehicleUsed] = useState([]);

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

  const [potterData, setPotterData] = useState([]);
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
      const response = await fetch("/api/get-booking-details");
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
  const getPotterData = async () => {
    try {
      const response = await fetch("/api/guide-data");
      const data = await response.json();
      setPotterData(data);
    } catch (error) {
      console.error("Error fetching potter data:", error.message);
    }
  };
  // console.log(isVehicleUsed);
  const getVehicleUsed = async () => {
    try {
      const response = await fetch("/api/vehicle-data-1");
      const data = await response.json();
      setIsVehicleUsed(data);
    } catch (error) {
      console.error("Error fetching vehicle used data:", error.message);
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
    getPotterData();
    getVehicleUsed();
  }, []);

  // Handling submit form
  const fields = [
    {
      h2Title: "Customer Information",
    },
    {
      name: "company_name",
      label: "Company Name",
      type: "text",
      required: true,
      defaultValue: "",
    },
    {
      name: "company_address",
      label: "Address",
      required: true,
      type: "text",
      defaultValue: "",
    },
    {
      name: "contact_person",
      label: "Contact Person",
      required: true,
      type: "text",
      defaultValue: "",
    },
    {
      name: "contact_number",
      label: "Contact Number",
      required: true,
      type: "text",
      defaultValue: "",
    },
    {
      name: "contact_email",
      label: "Contact Email",
      type: "text",
      defaultValue: "",
    },

    // travel details
    {
      h2Title: "Travel Details",
    },
    {
      name: "package_name",
      label: "Package Name",
      required: true,
      type: "select2",
      options: packageData.map((pck) => ({
        value: pck.package,
        label: pck.package,
      })),
      defaultValue: "",
    },
    {
      name: "departure_date",
      label: "Departure Date",
      required: true,
      type: "date",
      defaultValue: "",
    },
    {
      name: "return_date",
      label: "Return Date",
      required: true,
      type: "date",
      defaultValue: "",
    },
    {
      name: "pickup_location",
      label: "Pick-Up Location",
      type: "text",
      defaultValue: "",
    },
    {
      name: "pickup_date",
      label: "Pick-Up Date",
      required: true,
      type: "date",
      defaultValue: "",
    },
    {
      name: "drop_location",
      label: "Drop Location",
      type: "text",
      defaultValue: "",
    },
    // Payment information
    {
      h2Title: "Payment Information",
    },
    {
      name: "method",
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
      name: "promo_code",
      label: "Promo Code",
      type: "text",
      defaultValue: "",
    },
    {
      name: "payment_status",
      label: "Payment Status",
      type: "select2",
      options: paymentStatusData.map((pcks) => ({
        value: pcks.status,
        label: pcks.status,
      })),
      defaultValue: "",
    },

    {
      name: "invoice_receipt",
      label: "Invoice Receipt",
      type: "file",
      defaultValue: "",
    },
    // internation flight details
    {
      h2Title: "International Flight Details",
    },
    {
      name: "airlines_name",
      label: "Airlines Name",
      type: "text",
      defaultValue: "",
    },
    {
      name: "flight_taken_date",
      label: "Date",
      type: "date",
      defaultValue: "",
    },
    {
      name: "flight_number",
      label: "Flight Number",
      type: "text",
      defaultValue: "",
    },
    {
      name: "flight_time",
      label: "Flight Time",
      type: "time",
      defaultValue: "",
    },
    // option fields
    {
      h2Title: "Optional Information",
    },
    {
      name: "special_instruction",
      label: "Special Instruction",
      type: "text",
      defaultValue: "",
    },
    {
      name: "preferred_language",
      label: "Prefered Language",
      type: "select2",
      options: languageData.map((pcks) => ({
        value: pcks.language,
        label: pcks.language,
      })),
      defaultValue: "",
    },
    {
      name: "purpose",
      label: "Purpose Of Visit",
      required: true,
      type: "select2",
      options: purposeData.map((pcks) => ({
        value: pcks.purpose,
        label: pcks.purpose,
      })),
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
          name: "traveller_name[]",
          type: "text",
          label: "Traveller Name",
          required: true,
          defaultValue: "",
        },
        {
          name: "special_request[]",
          type: "text",
          label: "Special Request",
          defaultValue: "",
        },
        {
          name: "nationality[]",
          label: "Nationality",
          required: true,
          type: "select2",
          options: nationalityData.map((pcks) => ({
            value: pcks.nationality,
            label: pcks.nationality,
          })),
          defaultValue: "",
        },
        {
          name: "passport_number[]",
          label: "Passport Number",
          required: true,
          type: "number",
          defaultValue: "",
        },
        {
          name: "visa_copies[]",
          label: "Visa Copies",
          type: "file",
          defaultValue: "",
        },
      ],
      extraEditFields: [
        {
          name: "traveller_name",
          type: "text",
          label: "Traveller Name",
          required: true,
          defaultValue: "",
        },
        {
          name: "special_request",
          type: "text",
          label: "Special Request",
          defaultValue: "",
        },
        {
          name: "nationality",
          label: "Nationality",
          required: true,
          type: "select2",
          options: nationalityData.map((pcks) => ({
            value: pcks.nationality,
            label: pcks.nationality,
          })),
          defaultValue: "",
        },
        {
          name: "passport_number",
          label: "Passport Number",
          required: true,
          type: "number",
          defaultValue: "",
        },
        {
          name: "visa_copies",
          label: "Visa Copies",
          type: "file",
          defaultValue: "",
        },
      ],
    },
    // itenery details
    // {
    //   h2Title: "Itenery Details",
    // },
    // {
    //   name: "pax_no",
    //   label: "No of PAX",
    //   required: true,
    //   type: "number",
    //   isNote: true,
    //   defaultValue: "",
    // },
  ];

  // handling access
  const fieldsAccess = [
    {
      name: "assistants_name",
      label: "Guide / Porter Name",
      type: "select2",
      required: true,
      multiple: true,
      options: potterData.map((pck) => ({
        value: pck.contact_name,
        label: pck.contact_name,
      })),
    },
  ];
  // handling is completed
  const fieldsComplete = [
    {
      name: "completion_date",
      label: "Completion Date",
      type: "date",
      required: true,
      defaultValue: "",
    },
    {
      name: "completion_note",
      label: "Completion Note",
      type: "text",
      required: true,
      defaultValue: "",
    },
    {
      name: "receive_amount",
      label: "Amount Received",
      type: "number",
      defaultValue: "",
    },
  ];
  // pickup field
  const fieldsPickup = [
    {
      name: "pickup_date",
      label: "Pick-Up Date",
      type: "date",
      required: true,
      defaultValue: "",
    },
    {
      name: "assigned_person",
      label: "Name of Assigned Person",
      type: "select2",
      required: true,
      options: potterData.map((pck) => ({
        value: pck.contact_name,
        label: pck.contact_name,
      })),
    },
    {
      name: "pickup_time",
      label: "Pick-Up Time",
      type: "time",
      defaultValue: "",
    },
    {
      name: "vehicle_used",
      label: "Name of Vehicle Used",
      type: "select2",
      required: true,
      options: isVehicleUsed.map((pck) => ({
        value: pck.vehicle_type,
        label: pck.vehicle_type,
      })),
    },
    {
      name: "vehicle_charge",
      label: "Vehicle Charge",
      type: "string",
      defaultValue: "",
    },
  ];
  // cancel feild
  const fieldsCancel = [
    {
      name: "cancel_reason",
      label: "Cancel Reason",
      type: "text",
      required: true,
      defaultValue: "",
    },
  ];

  //  handle submit
  const handleModalSubmit = async (formData) => {
    try {
      const formPayload = new FormData();
      // console.log("Full formData before processing:", formData);
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
          "traveller_name[]": name,
          "nationality[]": nationality,
          "passport_number[]": passport,
          "special_request[]": request,
          "visa_copies[]": visaCopy,
        } = traveller;

        if (!name || !nationality || !passport) {
          throw new Error(`Traveller ${index + 1} is missing required fields.`);
        }

        formPayload.append("traveller_name[]", name);
        formPayload.append("nationality[]", nationality);
        formPayload.append("passport_number[]", passport);
        formPayload.append("special_request[]", request || "");

        if (visaCopy && visaCopy instanceof File) {
          formPayload.append("visa_copies[]", visaCopy);
        }
      });

      const response = await fetch("/api/booking-register", {
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
        `/api/update-booking-and-traveller/${selectedId}`,
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
  // handle access submit
  const handleAccessModalSubmit = async (formData, bookingId) => {
    try {
      const assistants = formData.assistants_name;

      if (!Array.isArray(assistants)) {
        throw new Error("assistants_name must be an array");
      }

      const responses = await Promise.all(
        assistants.map(async (name) => {
          const payload = {
            assistants_name: name,
            booking_id: bookingId,
          };
          const response = await fetch("/api/assistant-register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const result = await response.json();
          if (!response.ok)
            throw new Error(result.message || "Submission failed");
          return result;
        })
      );
      toast.success(responses[0]?.message || "All assistants added");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      alert(error.message);
    }
  };

  // table to display data
  const columns = [
    { key: "index", label: "S.no" },
    { key: "company_name", label: "Company Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "contact_number", label: "Contact Number" },
    { key: "package_name", label: "Package Name" },
    { key: "departure_date", label: "Departure Date" },
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
      const res = await fetch(`/api/get-booking-with-travellers/${id}`);
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
      const res = await fetch(`/api/get-booking-with-travellers/${id}`);
      const data = await res.json();

      // Check if data.data is available before setting state
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
      const res = await fetch(`/api/get-booking-with-travellers/${id}`);
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

  const handleAccess = async (id) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/get-booking-with-travellers/${id}`);
      const result = await res.json();
      setdataWithPotter(result.data);
      setIsAccessModalVisible(true);
    } catch (error) {
      console.error("Edit fetch error:", error);
      alert("Error fetching edit data: " + error.message);
    }
  };

  const openCompleteModal = (id) => {
    setSelectedId(id);
    setIsCompleteModalVisible(true);
  };

  const openPickUpModal = (id) => {
    setSelectedId(id);
    setIsPickUpModalVisible(true);
  };

  const handleComplete = async (id, formData) => {
    // console.log(formData);
    try {
      const res = await fetch("/api/booking-complete-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: id,
          completion_date: formData.completion_date,
          completion_note: formData.completion_note,
          package_rate: formData.package_rate,
          receive_amount: formData.receive_amount,
        }),
      });
      const result = await res.json();
      toast.success(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error completing booking:", error);
      alert(error.message);
    }
  };

  const openCancelModal = (id) => {
    setSelectedId(id);
    setIsCancelModalVisible(true);
  };

  const handleCancel = async (id, formData) => {
    try {
      const res = await fetch("/api/booking-cancel-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: id,
          cancel_reason: formData.cancel_reason,
        }),
      });

      const result = await res.json();
      toast.error(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setIsCancelModalVisible(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.message);
    }
  };

  const handlePickUp = async (id, formData) => {
    // console.log(formData);
    try {
      const res = await fetch("/api/pickup-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: id,
          pickup_date: formData.pickup_date,
          assigned_person: formData.assigned_person,
          pickup_time: formData.pickup_time,
          vehicle_used: formData.vehicle_used,
          vehicle_charge: formData.vehicle_charge,
        }),
      });
      const result = await res.json();
      toast.success(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error completing booking:", error);
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
          onClick={() => openCancelModal(row._id)}
          tooltip="Cancel Booking"
          disabled={[2, 3].includes(row.flag)}
        />
        &nbsp;
        <PUButton
          className="text-gray-500"
          label={<FontAwesomeIcon icon={faClipboardList} />}
          onClick={() => handleAccess(row._id)}
          tooltip="Assign Task To"
          disabled={[2, 3].includes(row.flag)}
        />
        &nbsp;
        <Button
          className="text-green-red-500"
          label={<FontAwesomeIcon icon={faTruckPickup} />}
          onClick={() => openPickUpModal(row._id)}
          tooltip="Assign Pickup"
          disabled={[2, 3].includes(row.flag)}
        />
        &nbsp;
        <SButton
          className="text-green-500"
          label={<FontAwesomeIcon icon={faCheckCircle} />}
          onClick={() => openCompleteModal(row._id)}
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
      section: "Customer Information",
      fields: [
        "company_name",
        "company_address",
        "contact_person",
        "contact_number",
        "contact_email",
      ],
    },
    {
      section: "Travel Details",
      fields: [
        "package_name",
        "departure_date",
        "return_date",
        "pickup_location",
        "drop_location",
        "pickup_date",
      ],
    },
    {
      section: "Payment Information",
      fields: ["method", "promo_code", "payment_status", "invoice_receipt"],
    },
    {
      section: "International Flight Details",
      fields: [
        "airlines_name",
        "flight_taken_date",
        "flight_time",
        "flight_number",
      ],
    },
    {
      section: "Optional Information",
      fields: ["special_instruction", "preferred_language", "purpose"],
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
          title="Booking Information"
          fields={fields}
          onSubmit={handleModalSubmit}
        />
        <DynamicEditModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          title="Edit Booking Information"
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

        <DynamicAccessModal
          visible={isAccessModalVisible}
          onClose={() => setIsAccessModalVisible(false)}
          title="Assign Task To"
          fields={fieldsAccess}
          onSubmit={handleAccessModalSubmit}
          bookingId={selectedId}
        />
        <BookingCancelModal
          visible={isCancelModalVisible}
          onClose={() => setIsCancelModalVisible(false)}
          title="Cancel Booking"
          fields={fieldsCancel} // Assuming this has a "cancel_reason" input
          onSubmit={(formData) => {
            handleCancel(selectedId, formData);
          }}
        />

        <BookingCompleteModal
          visible={isCompleteModalVisible}
          onClose={() => setIsCompleteModalVisible(false)}
          title="Booking Completed"
          fields={fieldsComplete}
          onSubmit={(formData) => {
            handleComplete(selectedId, formData); // Submit form from modal
          }}
        />
        <PickUpModal
          visible={isPickUpModalVisible}
          onClose={() => setIsPickUpModalVisible(false)}
          title="Pick-Up Information"
          fields={fieldsPickup}
          onSubmit={(formData) => {
            handlePickUp(selectedId, formData); // Submit form from modal
          }}
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
