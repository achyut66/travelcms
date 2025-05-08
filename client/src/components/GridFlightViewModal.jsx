import React, { useState, useRef, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { API_BASE_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../assets/css/pdf.css";

const ViewModal = ({
  visible,
  onClose,
  data,
  displayColumns,
  travellers = [],
}) => {
  const printRef = useRef(null);
  const [expandedImg, setExpandedImg] = useState(null);
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [iteneryData, setIteneryData] = useState([]);
  // console.log(displayColumns);
  // console.log(iteneryData);
  const fetchItinerary = async (packageName) => {
    try {
      const response = await fetch(`/api/getby-packagename/${packageName}`);
      const result = await response.json();

      if (response.ok) {
        setIteneryData(result);
      } else {
        console.warn("No itinerary found:", result.message);
        setIteneryData([]); // fallback to empty
      }
    } catch (error) {
      console.error("Error fetching itinerary:", error);
    }
  };

  useEffect(() => {
    if (data?.package_name) {
      fetchItinerary(data.package_name);
    }
  }, [data?.package_name]);

  if (!data) return null;

  const handleGeneratePDF = async () => {
    const el = printRef.current;
    el.style.display = "block";
    const input = printRef.current;
    if (!input) return;
    const hiddenElements = [];

    // const canvas = await html2canvas(el);
    input.querySelectorAll(".no-print").forEach((el) => {
      hiddenElements.push({ el, original: el.style.display });
      el.style.display = "none";
    });
    input.querySelectorAll("*").forEach((el) => {
      const style = getComputedStyle(el);
      if (style.color.includes("oklch")) el.style.color = "#000";
      if (style.backgroundColor.includes("oklch"))
        el.style.backgroundColor = "#fff";
    });
    await new Promise((res) => setTimeout(res, 100));

    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("booking-details.pdf");

      el.style.display = "none";
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      hiddenElements.forEach(({ el, original }) => {
        el.style.display = original;
      });
    }
  };
  //   const handleDownload = () => {
  //     if (!expandedImg) return;
  //     const link = document.createElement("a");
  //     link.href = expandedImg;
  //     link.download = expandedImg.split("/").pop(); // optional: sets filename
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };

  const letterHead = `
    <span class='text-sm'>Pokalde Adventure Tours & Travel</span><br>
    <span>Thamel-11, Kathmandu</span><br>
    <span>Nepal</span>
  `;

  // console.log(displayColumns);
  // const getIteneryData = async (id) => {
  //   try {
  //     const response = await fetch(
  //       `${API_BASE_URL}/api/itenery-profile/${id}`
  //     );
  //     const data = await response.json();
  //     setItineryData(data);
  //   } catch (error) {
  //     console.error("Error fetching itinerary data:", error);
  //   }
  // };

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-40" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="translate-y-full opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="transition ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-full opacity-0"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  className="text-lg font-bold text-center mb-4"
                  dangerouslySetInnerHTML={{ __html: letterHead }}
                />
                <div className="relative h-20 mt-[-70px] ml-[730px] no-print">
                  <button
                    className="absolute top-0 left-0 bg-yellow-300 p-2 rounded cursor-pointer"
                    onClick={handleGeneratePDF}
                  >
                    <FontAwesomeIcon icon={faPrint} /> PDF
                  </button>
                </div>
                <div className="screen-only">
                  {displayColumns.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <h3 className="text-md font-semibold text-red-700 text-center mb-4 border-b pb-1">
                        {section.section}
                      </h3>
                      {/* {console.log(section)} */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700">
                        {section.fields.map((field) => (
                          <div
                            key={field}
                            className={`space-y-1 p-2 text-center ${
                              field === "pax_no" ? "bg-gray-200 rounded" : ""
                            }`}
                          >
                            <span className="font-medium capitalize block">
                              {field.replace(/_/g, " ")}:
                            </span>

                            {/* Check if the field is "invoice_receipt" */}
                            {field === "invoice_receipt" ? (
                              <img
                                crossOrigin="anonymous"
                                src={`${API_BASE_URL}/uploads/booking/invoice/${data[field]}`}
                                alt="Invoice"
                                className="rounded shadow w-16 h-16 object-cover border cursor-pointer ml-[50px]"
                                onClick={() =>
                                  setExpandedInvoice(
                                    `${API_BASE_URL}/uploads/booking/invoice/${data[field]}`
                                  )
                                }
                              />
                            ) : field.includes("date") ? ( // Check if field includes "date"
                              <span className="block text-gray-900 font-bold">
                                {data[field]?.slice(0, 10)}{" "}
                                {/* Show only YYYY-MM-DD */}
                              </span>
                            ) : (
                              <span className="block text-gray-900 font-bold">
                                {data[field] || "N/A"}{" "}
                                {/* Show the value or "N/A" if the field is empty */}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {travellers.length > 0 && (
                    <div className="mt-6">
                      <table className="min-w-full border border-gray-300 mt-4 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-4 py-2">#</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">DOB</th>
                            <th className="border px-4 py-2">Gender</th>
                            <th className="border px-4 py-2">Nationality</th>
                            <th className="border px-4 py-2">
                              Passport Number
                            </th>
                            <th className="border px-4 py-2">Contact Number</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">
                              Special Request
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {travellers.map((traveller, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="border px-4 py-2">{idx + 1}</td>
                              <td className="border px-4 py-2">
                                {traveller.full_name}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.dob}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.gender}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.nationality}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.passport_no}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.contact_no}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.email}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.special_req}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="text-center font-bold text-red-600 mt-[12px]">
                        Itenery Details
                      </div>
                      <hr
                        style={{
                          width: "100%",
                          borderWidth: "1px",
                          color: "red",
                          marginBottom: "20px",
                        }}
                      />
                      <ul>
                        {iteneryData.map((itenery, idx) => (
                          <li key={idx}>
                            <div className="text-sm font-sm italic">
                              {itenery.itinerary}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div ref={printRef} className="print-container print-only">
                  <div className="text-center">
                    Pokalde Adventure Tours & Travel
                    <br />
                    Thamel,11 Kathmandu- Nepal
                    <br />
                    Email: pokalde@gmail.com
                  </div>

                  {displayColumns.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: "10px" }}>
                      <h3 className="print-title">{section.section}</h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "10px",
                        }}
                      >
                        {section.fields.map((field) => {
                          let value = data[field] || "N/A"; // Default to "N/A" if no data exists

                          // Check if the field is a date and format it
                          if (field.includes("date") && value !== "N/A") {
                            value = new Date(value).toISOString().slice(0, 10); // Format as YYYY-MM-DD
                          }

                          return (
                            <div key={field}>
                              <div
                                style={{
                                  fontWeight: "600",
                                  marginBottom: "5px",
                                }}
                              >
                                {field.replace(/_/g, " ")}:
                              </div>
                              <div>{value}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {travellers.length > 0 && (
                    <table className="print-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>DOB</th>
                          <th>Gender</th>
                          <th>Nationality</th>
                          <th>Passport Number</th>
                          <th>Contact Number</th>
                          <th>Email</th>
                          <th>Special Request</th>
                        </tr>
                      </thead>
                      <tbody>
                        {travellers.map((traveller, idx) => (
                          <tr key={idx}>
                            <td>{traveller.full_name}</td>
                            <td>{traveller.dob}</td>
                            <td>{traveller.gender}</td>
                            <td>{traveller.nationality}</td>
                            <td>{traveller.passport_no}</td>
                            <td>{traveller.contact_no}</td>
                            <td>{traveller.email}</td>
                            <td>{traveller.special_req}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <div className="text-center font-bold text-red-600">
                    Itinerary Details
                  </div>
                  <ul>
                    {iteneryData.map((itenery, idx) => (
                      <li
                        key={idx}
                        style={{ fontStyle: "italic", fontSize: "12px" }}
                      >
                        {itenery.itinerary}
                      </li>
                    ))}
                  </ul>
                </div>

                {expandedImg && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative">
                      <img
                        src={expandedImg}
                        alt="Visa"
                        className="max-w-full max-h-[90vh] rounded-lg"
                      />
                      <button
                        onClick={() => setExpandedImg(null)}
                        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 px-3 py-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {expandedInvoice && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative">
                      <img
                        src={expandedInvoice}
                        alt="Invoice"
                        className="max-w-full max-h-[120vh] rounded-lg"
                      />
                      <button
                        onClick={() => setExpandedInvoice(null)}
                        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 px-3 py-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center no-print">
                  <button
                    type="button"
                    className="bg-blue-600 px-4 py-2 text-white rounded"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewModal;
