import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import Pagination from "../../components/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../public/images/logo.png";
import "../../../src/index.css";
import "../../../src/assets/css/pdf.css";

const Table = ({
  columns,
  data,
  actions,
  itemsPerPage = 20,
  year,
  onCountClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const tableRef = useRef();
  const [userData, setUserData] = useState([]);
  // console.log(year);
  //   console.log(data);
  const handleSearch = (e) => {
    e.preventDefault();
    // applyFilters();
  };

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

  //   const applyFilters = async () => {
  //     const params = new URLSearchParams();

  //     if (selectedStatus) params.append("status", selectedStatus);
  //     if (selectedColumn) params.append("column", selectedColumn);
  //     if (fromDate) params.append("from", fromDate.toISOString().split("T")[0]);
  //     if (toDate) params.append("to", toDate.toISOString().split("T")[0]);

  //     const response = await fetch(
  //       `${API_BASE_URL}/api/filter-by-date?${params}`
  //     );
  //     const result = await response.json();

  //     setFilteredData(result);
  //     setCurrentPage(1);
  //   };

  const handlePrint = () => {
    const input = tableRef.current;
    if (!input) return;

    const printWindow = window.open("", "", "height=700,width=900");
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
          ${input.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const isImage = (value) => {
    if (typeof value !== "string") return false;
    return [".jpg", ".png", ".jpeg", ".gif"].some((ext) =>
      value.toLowerCase().endsWith(ext)
    );
  };

  const isDateTime = (value) => {
    return (
      typeof value === "string" &&
      !isNaN(Date.parse(value)) &&
      value.includes("T")
    );
  };

  const formatDate = (value) => {
    try {
      return new Date(value).toISOString().split("T")[0];
    } catch {
      return value;
    }
  };

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  // total
  const extratotal = filteredData.reduce(
    (sum, row) => sum + (+row.total_amt || 0),
    0
  );
  const receivetotal = filteredData.reduce(
    (sum, row) => sum + (+row.damagedprice || 0),
    0
  );
  const duestotal = filteredData.reduce(
    (sum, row) => sum + (+row.availableprice || 0),
    0
  );
  //   const packagetotal = filteredData.reduce(
  //     (sum, row) => sum + (+row.receive_amount || 0),
  //     0
  //   );

  return (
    <div className="overflow-x-auto w-full">
      {/* Filter Section */}
      <form
        onSubmit={handleSearch}
        className="mb-4 flex flex-wrap gap-4 items-end"
      ></form>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handlePrint}
          className="px-4 py-4 bg-green-600 text-white rounded text-sm ml-[1170px] cursor-pointer"
        >
          <FontAwesomeIcon icon={faPrint} className="mr-2" />
        </button>
      </div>

      {/* Table */}
      <div ref={tableRef} className="print-area">
        <div className="hidden print:flex flex-col items-center justify-center mb-4 text-center">
          <img src={logo} width={80} className="mx-auto" alt="Logo" />
          {userData?.[0] && (
            <>
              <div className="text-lg font-bold">
                {userData[0].company_name}
              </div>
              <div>{userData[0].company_address}</div>
              <div>Nepal</div>
              {year.map((y, index) => (
                <p key={index}>
                  ( The Annual Accounting Report For The Year {y} )
                </p>
              ))}
            </>
          )}
        </div>

        <table className="w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 border-[2px] border-gray-200 text-left bg-gray-100 font-medium text-sm text-gray-700"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-2 border-[2px] border-gray-200 text-left bg-gray-100 text-sm">
                  ###
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, idx) => (
                <>
                  <tr
                    key={`row-${idx}`}
                    className="hover:bg-gray-200 border-gray-200 border-[1px]"
                  >
                    {columns.map((col) => {
                      let displayValue = "--";
                      // console.log(col);
                      if (col.key === "count") {
                        return (
                          <td key={`${col.key}-${idx}`} className="text-center">
                            <button
                              className="text-lg text-blue-500 px-2 py-1 rounded cursor-pointer"
                              onClick={() => onCountClick(row.ids)} // This must be an array of ObjectIds
                            >
                              {row.count}
                            </button>
                          </td>
                        );
                      }
                      if (col.key === "index") {
                        displayValue =
                          (currentPage - 1) * itemsPerPage + idx + 1;
                      } else if (col.render) {
                        displayValue = col.render(row);
                      } else {
                        const cellValue = row[col.key];
                        if (isImage(cellValue)) {
                          displayValue = (
                            <img
                              src={`${API_BASE_URL}/uploads/${cellValue}`}
                              alt={col.label}
                              className="w-16 h-16 object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "";
                              }}
                            />
                          );
                        } else if (isDateTime(cellValue)) {
                          displayValue = formatDate(cellValue);
                        } else if (cellValue) {
                          displayValue = cellValue;
                        }
                      }

                      return (
                        <td
                          key={`${col.key}-${idx}`}
                          className="px-4 py-2 border-[1px] border-gray-200 text-sm"
                        >
                          {displayValue}
                        </td>
                      );
                    })}

                    {actions && (
                      <td className="px-4 py-2 border-[1px] border-gray-200 text-sm">
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                </>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-4 text-center text-gray-400"
                >
                  No data found
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={3} className="text-center text-lg font-bold">
                Total
              </td>
              <td className="text-center font-bold bg-yellow-300">
                NPR.{extratotal.toLocaleString("en-IN")}
              </td>
              <td>&nbsp;</td>
              <td className="text-center font-bold bg-red-400">
                NPR. ({receivetotal.toLocaleString("en-IN")})
              </td>
              <td>&nbsp;</td>
              <td className="text-center font-bold bg-green-400">
                NPR. {duestotal.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
