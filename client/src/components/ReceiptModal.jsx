import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import logo from "../../public/images/logo.png";
import "../index.css";

const ReceiptViewModal = ({ visible, onClose, row = {}, receiptData }) => {
  const [packageRate, setPackageRate] = useState("");
  const [extraData, setExtraData] = useState([]);
  const [userData, setUserData] = useState([]);
  const printRef = useRef();

  const [receiptNo, setReceiptNo] = useState("1");
  const [printDate, setPrintDate] = useState(
    row.date || new Date().toISOString().split("T")[0]
  );

  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_KEY = "cur_live_WnpCcZWUiDxi3I01JBt1tS0egWV0WWz9BWD1GU6N"; // Replace with your actual API key
  const CACHE_KEY = "exchangeRateData";
  const CACHE_DURATION = 1000 * 60 * 60 * 5; // 5 hour

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profiledata = await fetch("/api/profile-data");
        const result = await profiledata.json();
        setUserData(result);
      } catch (error) {
        console.log("error fetching profile", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(`${CACHE_KEY}_timestamp`);

    const isCacheValid =
      cached && cachedTime && Date.now() - cachedTime < CACHE_DURATION;

    if (isCacheValid) {
      try {
        const parsedRates = JSON.parse(cached);
        setRates(parsedRates);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing cached rates:", error);
        // Fall back to fetching from API if JSON parsing fails
        fetchExchangeRates();
      }
    } else {
      fetchExchangeRates();
    }
  }, [CACHE_DURATION]);

  const fetchExchangeRates = () => {
    fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=NPR`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          // console.log(data.data);
          setRates(data.data); // Storing the data
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.data));
          localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now());
        } else {
          throw new Error("Failed to fetch valid exchange rates.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!receiptData.package_name) return;
    const fetchRate = async () => {
      try {
        const response = await fetch(
          `/api/get-rate-by-package/${encodeURIComponent(
            receiptData.package_name
          )}`
        );
        const result = await response.json();
        setPackageRate(result.rate);
      } catch (error) {
        console.log("Can't fetch rate", error);
      }
    };
    fetchRate();
  }, [receiptData.package_name]);

  useEffect(() => {
    if (!receiptData._id) return;
    const fetchExtras = async () => {
      try {
        const response = await fetch(
          `/api/get-by-bookingid/${encodeURIComponent(receiptData._id)}`
        );
        const result = await response.json();
        setExtraData(result.length > 0 ? result : null);
      } catch (error) {
        console.log("Can't fetch extras", error);
      }
    };
    fetchExtras();
  }, [receiptData._id]);

  const receiptInfo = {
    receiptNo: receiptNo,
    date: row.date || new Date().toISOString().split("T")[0],
    note: "Please retain this receipt for future reference.",
  };

  const extrasTotal = (extraData || []).reduce(
    (sum, item) =>
      sum + (item.extra_item_price || 0) * (item.extra_item_quantity || 1),
    0
  );

  const subtotal = (parseFloat(packageRate) || 0) + extrasTotal;
  const vatAmount = subtotal * 0.13;
  const total = subtotal + vatAmount;

  const usdRate = rates?.USD?.value || 0;
  const totalInUSD = (usdRate ? total * usdRate : 0).toFixed(2);

  const handlePrint = () => {
    handlePrintSubmit();
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              td, th { border: 1px solid #000; padding: 8px; text-align: left; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .no-border { border: none; }
              input {
                border: none;
                outline: none;
                background: transparent;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // print submit form
  // useEffect(() => {
  const handlePrintSubmit = async () => {
    try {
      const payload = {
        receipt_no: receiptNo,
        print_date: printDate,
        booking_id: receiptData._id,
      };

      const response = await fetch("/api/receipt-print-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("Receipt registered:", result);
    } catch (error) {
      console.log("Error registering print:", error);
    }
  };

  // print count
  useEffect(() => {
    const fetchReceiptNo = async () => {
      try {
        const response = await fetch(
          `/api/get-latest-receipt?booking_id=${receiptData._id}`
        );
        const result = await response.json();
        if (result.receipt_no) {
          setReceiptNo(result.receipt_no);
        }
      } catch (error) {
        console.log("Error fetching receipt number:", error);
      }
    };

    if (receiptData._id) {
      fetchReceiptNo();
    }
  }, [receiptData._id]);

  if (loading) return <div>Loading exchange rates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-40" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="translate-y-full opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="transition ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-full opacity-0"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
                {/* PRINTABLE CONTENT */}
                <div ref={printRef}>
                  <div className="text-center mb-4">
                    <img src={logo} width={80} className="mx-auto" alt="Logo" />
                    {userData?.[0] && (
                      <>
                        <div className="text-lg font-bold">
                          {userData[0].company_name}
                        </div>
                        <div>{userData[0].company_address}</div>
                        <div>Nepal</div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <div>
                      <div>
                        <strong>Receipt No:</strong>{" "}
                        <input
                          type="text"
                          name="receipt_no"
                          value={receiptInfo.receiptNo}
                          className="border-none focus:outline-none only-input"
                        />
                      </div>
                      <div>
                        <strong>VAT No:</strong>{" "}
                        {userData?.[0]?.vat_no || "N/A"}
                      </div>
                    </div>
                    <div className="text-center font-semibold underline mr-[100px]">
                      Receipt Voucher
                    </div>
                    <div className="text-right mr-[-50px] print:mr-0">
                      <strong>Date:</strong>
                      <input
                        className="border-none focus:outline-none bg-transparent only-input"
                        type="text"
                        name="print_date"
                        value={printDate}
                        onChange={(e) => setPrintDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="text-sm mb-4">
                    <div className="underline font-semibold">Bill To</div>
                    <div>
                      <strong>Name:</strong> {receiptData.company_name}
                    </div>
                    <div>
                      <strong>Address:</strong> {receiptData.company_address}
                    </div>
                    <div>
                      <strong>Contact:</strong> {receiptData.contact_number}
                    </div>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th>Particulars</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{receiptData.package_name}</td>
                        <td>1</td>
                        <td>{packageRate}</td>
                        <td>{packageRate}</td>
                      </tr>

                      {/* Extras Section */}
                      {extraData.length > 0 && (
                        <tr>
                          <td colSpan="4" className="font-semibold bg-gray-50">
                            Extras
                          </td>
                        </tr>
                      )}

                      {extraData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.extra_item}</td>
                          <td>{item.extra_item_quantity}</td>
                          <td>{item.extra_item_price}</td>
                          <td>
                            {(
                              item.extra_item_quantity * item.extra_item_price
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4}>&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-left font-semibold">
                          Subtotal
                        </td>
                        <td>{subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-left font-semibold">
                          VAT (13%)
                        </td>
                        <td>{vatAmount.toFixed(2)}</td>
                      </tr>
                      <tr className="font-bold bg-gray-100">
                        <td colSpan="3" className="text-left">
                          Total
                        </td>
                        <td>
                          {total.toFixed(2)} NPR
                          <br />
                          {totalInUSD} USD
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-sm italic mt-4">
                    <strong>Note:</strong> {receiptInfo.note}
                  </div>
                  <div>&nbsp;&nbsp;&nbsp;</div>
                  <div className="text-sm flex justify-end mt-20">
                    <div className="text-center">
                      <div>________________________</div>
                      <div>Authorized Signature</div>
                      {userData?.[0] && (
                        <div className="font-bold">
                          {userData[0].company_name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-6 text-center">
                  <button
                    className="bg-blue-600 px-4 py-2 text-white rounded"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    className="bg-green-600 px-4 py-2 text-white rounded ml-4"
                    onClick={handlePrint}
                    onSubmit={handlePrintSubmit}
                  >
                    Print Receipt
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

export default ReceiptViewModal;
