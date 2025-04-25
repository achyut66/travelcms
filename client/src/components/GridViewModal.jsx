import React, { useState, useRef, Fragment } from "react";
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
      const canvas = await html2canvas(el, input, {
        scale: 2,
        useCORS: true,
      });

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
    <span class='text-sm'>ABC Travels & Tours</span><br>
    <span>Thamel-12, Kathmandu</span><br>
    <span>Nepal</span>
  `;

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
                            ) : (
                              <span className="block text-gray-900 font-bold">
                                {data[field] || "N/A"}
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
                            <th className="border px-4 py-2">Nationality</th>
                            <th className="border px-4 py-2">Special Req.</th>
                            <th className="border px-4 py-2">Passport No.</th>
                            <th className="border px-4 py-2">Visa Copy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {travellers.map((traveller, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="border px-4 py-2">{idx + 1}</td>
                              <td className="border px-4 py-2">
                                {traveller.traveller_name}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.nationality}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.special_request}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.passport_number}
                              </td>
                              <td className="border px-4 py-2">
                                {traveller.visa_copies ? (
                                  <img
                                    crossOrigin="anonymous"
                                    src={`${API_BASE_URL}/uploads/booking/visa/${traveller.visa_copies}`}
                                    alt="Visa"
                                    className="w-16 h-16 object-cover border rounded cursor-pointer"
                                    onClick={() =>
                                      setExpandedImg(
                                        `${API_BASE_URL}/uploads/booking/visa/${traveller.visa_copies}`
                                      )
                                    }
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div ref={printRef} className="print-container print-only">
                  <div className="text-center" style={{}}>
                    ABC Travel & Tours
                    <br />
                    Thamel,12 Kathmandu- Nepal
                    <br />
                    Email: abc@gmail.com
                  </div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {displayColumns.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: "30px" }}>
                      <h3 className="print-title">{section.section}</h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "20px",
                        }}
                      >
                        {section.fields.map((field) => (
                          <div key={field}>
                            <div
                              style={{ fontWeight: "600", marginBottom: "5px" }}
                            >
                              {field.replace(/_/g, " ")}:
                            </div>
                            <div>{data[field] || "N/A"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {travellers.length > 0 && (
                    <table className="print-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Nationality</th>
                          <th>Special Req.</th>
                          <th>Passport No.</th>
                          {/* <th>Visa Copy</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {travellers.map((traveller, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{traveller.traveller_name}</td>
                            <td>{traveller.nationality}</td>
                            <td>{traveller.special_request}</td>
                            <td>{traveller.passport_number}</td>
                            {/* <td>
                              {traveller.visa_copies ? (
                                <img
                                  src={`${API_BASE_URL}/uploads/booking/visa/${traveller.visa_copies}`}
                                  alt="Visa"
                                  className="print-img"
                                />
                              ) : (
                                "N/A"
                              )}
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
