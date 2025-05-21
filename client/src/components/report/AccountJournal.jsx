import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

const JournalModal = ({
  visible,
  onClose,
  title = "Journal Entry",
  data = {}, // single journal entry object
}) => {
  const tableRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=700,width=900");
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .credit, .debit { text-align: right; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center;">${title}</h2>
          <h3 style="text-align:center; margin-top: 10px;">(${data.company_name})</h3>
          ${tableRef.current?.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const {
    pickup_date,
    reference = data.package_name,
    package_total,
    receive_amount,
    due_amount,
    extra_total,
  } = data;

  const formattedDate = pickup_date
    ? new Date(pickup_date).toLocaleDateString("en-IN")
    : "N/A";

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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-xl font-bold text-center mb-4">
                  {title}
                  <div className="text-center text-sm">
                    {" "}
                    ({data.company_name})
                  </div>
                </Dialog.Title>

                {package_total ? (
                  <div className="overflow-x-auto">
                    <table
                      ref={tableRef}
                      className="min-w-full border text-sm text-left"
                    >
                      <thead>
                        <tr>
                          <th className="border px-3 py-2">Date</th>
                          <th className="border px-3 py-2">Particular</th>
                          <th className="border px-3 py-2 text-right">
                            Debit (Rs.)
                          </th>
                          <th className="border px-3 py-2 text-right">
                            Credit (Rs.)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-gray-100 font-semibold">
                          <td className="border px-3 py-2" colSpan="5">
                            {formattedDate} - {reference || "No Ref"}
                          </td>
                        </tr>

                        {/* Debit Line */}
                        <tr className="hover:bg-gray-50">
                          <td className="border px-3 py-2">{formattedDate}</td>
                          <td className="border px-3 py-2">
                            Accounts Receivable (Dr.)
                          </td>
                          <td className="border px-3 py-2 text-right">
                            {Number(package_total).toLocaleString("en-IN")}
                          </td>
                          <td className="border px-3 py-2 text-right"></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="border px-3 py-2">{formattedDate}</td>
                          <td className="border px-3 py-2">
                            Extra Expences (Dr.)
                          </td>
                          <td className="border px-3 py-2 text-right">
                            {Number(extra_total).toLocaleString("en-IN")}
                          </td>
                          <td className="border px-3 py-2 text-right"></td>
                        </tr>

                        {/* Credit Lines */}
                        {receive_amount > 0 && (
                          <tr className="hover:bg-gray-50">
                            <td className="border px-3 py-2">
                              {formattedDate}
                            </td>
                            <td className="border px-3 py-2 pl-[50px]">
                              Cash Received (Cr.)
                            </td>
                            <td className="border px-3 py-2 text-right"></td>
                            <td className="border px-3 py-2 text-right">
                              {Number(receive_amount).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                        {due_amount > 0 && (
                          <tr className="hover:bg-gray-50 ml-[30px]">
                            <td className="border px-3 py-2">
                              {formattedDate}
                            </td>
                            <td className="border px-3 py-2 pl-[50px]">
                              Due's (Cr.)
                            </td>
                            <td className="border px-3 py-2 text-right"></td>
                            <td className="border px-3 py-2 text-right">
                              {Number(due_amount).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan={2} className="text-center text-lg">
                            Total
                          </td>
                          <td className="border px-3 py-2 text-right text-lg underline">
                            {Number(package_total + extra_total).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td className="border px-3 py-2 text-right text-lg underline">
                            {Number(receive_amount + due_amount).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-600">
                    No journal data found.
                  </p>
                )}

                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  {package_total && (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={handlePrint}
                    >
                      Print
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default JournalModal;
