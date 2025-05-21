import React, { useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import JournalModal from "../components/report/AccountJournal";

const ViewModal = ({ visible, onClose, title, data, displayColumns }) => {
  if (!data) return null;

  const isArray = Array.isArray(data);
  const tableRef = useRef();
  const [userData, setUserData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [journalData, setJournalData] = useState([]);

  // Totals
  let total_package = 0;
  let total_extra = 0;
  let total_receive = 0;
  let total_due = 0;

  if (isArray) {
    data.forEach((item) => {
      total_package += Number(item.package_total || 0);
      total_extra += Number(item.extra_total || 0);
      total_receive += Number(item.receive_amount || 0);
      total_due += Number(item.due_amount || 0);
    });
  } else {
    total_package = Number(data.package_total || 0);
    total_extra = Number(data.extra_total || 0);
    total_receive = Number(data.receive_amount || 0);
    total_due = Number(data.due_amount || 0);
  }

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile-data");
        const result = await response.json();
        setUserData(result);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Print handler
  const handlePrint = () => {
    const input = tableRef.current;
    if (!input) return;

    const printWindow = window.open("", "", "height=700,width=900");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .no-border { border: none; }
          </style>
        </head>
        <body>
          <div class="text-center">
            <h2>${userData?.[0]?.company_name || "Company Name"}</h2>
            <p>${userData?.[0]?.company_address || "Company Address"}</p>
            <p>Nepal</p>
            <h3>${title || "Report"}</h3>
          </div>
          ${input.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getjournalModal = async (id) => {
    try {
      const res = await fetch("/api/get-account-data-byid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      setJournalData(result.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch journal details:", error);
    }
  };

  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-[9999]" onClose={onClose}>
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
                <Dialog.Panel className="w-full max-w-6xl h-auto transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold text-center mb-4">
                    {title}
                  </Dialog.Title>

                  {isArray ? (
                    <div className="overflow-x-auto">
                      <div ref={tableRef} className="print-area">
                        <table className="min-w-full border border-gray-300 text-sm text-left">
                          <thead className="bg-gray-100 text-gray-700">
                            <tr>
                              <th className="py-2 px-4 border">#</th>
                              {displayColumns.map((col) => (
                                <th key={col} className="py-2 px-4 border">
                                  {col.replace(/_/g, " ").toUpperCase()}
                                </th>
                              ))}
                              <th className="py-2 px-4 border">##</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border">
                                  {index + 1}
                                </td>
                                {displayColumns.map((col) => (
                                  <td key={col} className="py-2 px-4 border">
                                    {col === "company_logo" ? (
                                      <img
                                        src={`http://localhost:5000/uploads/${item[col]}`}
                                        alt="Logo"
                                        className="w-10 h-10 object-cover rounded border"
                                      />
                                    ) : (
                                      item[col] || "N/A"
                                    )}
                                  </td>
                                ))}
                                <td className="py-2 px-4 border">
                                  <button
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                    onClick={() => getjournalModal(item._id)}
                                  >
                                    Journal
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100 font-semibold">
                              <td
                                colSpan={displayColumns.length - 3}
                                className="text-center"
                              >
                                TOTAL
                              </td>
                              <td className="text-center">
                                Rs. {total_package.toLocaleString("en-IN")}
                              </td>
                              <td className="text-center">
                                Rs. {total_extra.toLocaleString("en-IN")}
                              </td>
                              <td className="text-center">
                                Rs. {total_receive.toLocaleString("en-IN")}
                              </td>
                              <td className="text-center">
                                Rs. {total_due.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                      {Object.entries(data).map(([key, value]) => {
                        if (displayColumns.includes(key)) {
                          return (
                            <div key={key}>
                              <span className="font-medium capitalize block">
                                {key.replace(/_/g, " ")}:
                              </span>
                              {key === "logo" || key === "company_logo" ? (
                                <img
                                  src={`http://localhost:5000/uploads/${value}`}
                                  alt="Logo"
                                  className="mt-1 rounded shadow w-24 h-24 object-cover border"
                                />
                              ) : (
                                <span className="mt-1 block text-gray-900">
                                  {value || "N/A"}
                                </span>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}

                  <div className="mt-6 text-center space-x-4">
                    <button
                      type="button"
                      className="bg-green-600 px-4 py-2 text-white rounded"
                      onClick={handlePrint}
                    >
                      Print
                    </button>
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
      <div>
        <JournalModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          data={journalData}
        />
      </div>
    </>
  );
};

export default ViewModal;
