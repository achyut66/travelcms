import React, { useState, useEffect } from "react";
import Pagination from "../components/Pagination";

const ExtrasTable = ({ columns, data, renderActions }) => {
  const [exchangeRate, setExchangeRate] = useState(null); // NPR to USD

  // Fetch today's exchange rate: NPR base → USD target
  useEffect(() => {
    fetch(
      "https://v6.exchangerate-api.com/v6/3cc904a49e03f15228b6b0c0/latest/NPR"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.conversion_rates && data.conversion_rates.USD) {
          setExchangeRate(data.conversion_rates.USD);
        } else {
          console.error("Unexpected response format", data);
        }
      })
      .catch((err) => console.error("Failed to fetch exchange rate", err));
  }, []);

  // Group by booking_id
  const groupedData = data.reduce((acc, item) => {
    const key = item.booking_id || "Unknown Booking";
    if (!acc[key]) {
      acc[key] = {
        bookingId: key,
        company_name: item.company_name,
        items: [],
      };
    }

    acc[key].items.push(
      ...item.extras.map((extra) => ({
        ...extra,
        booking_id: key,
      }))
    );

    return acc;
  }, {});

  const groupedDataArray = Object.values(groupedData);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const currentCompanies = groupedDataArray.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-10 pt-[70px]">
      {currentCompanies.map((group) => {
        const totalNPR = group.items.reduce(
          (total, item) => total + item.extra_item_price,
          0
        );
        const totalUSD = exchangeRate
          ? (totalNPR * exchangeRate).toFixed(2)
          : "Loading...";

        return (
          <div key={group.bookingId}>
            <h2 className="text-lg font-semibold mb-2 underline text-center text-blue-500">
              {group.company_name}
            </h2>

            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="p-2 border border-gray-300 text-left"
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.items.map((item, index) => (
                  <tr key={item._id || index} className="border-t">
                    {columns.map((col, colIdx) => {
                      const value =
                        col.field === "actions"
                          ? renderActions(item, index, item._id)
                          : col.field === "booking_id"
                          ? item.booking_id || "N/A"
                          : item[col.field] || "N/A";

                      return (
                        <td key={colIdx} className="p-2 border border-gray-300">
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                <tr className="bg-gray-200">
                  <td
                    colSpan={columns.length - 2}
                    className="p-2 border border-gray-300 text-right font-bold"
                  >
                    Total:
                  </td>
                  <td className="p-2 border border-gray-300 text-right font-bold">
                    NPR {totalNPR.toFixed(2)} <br />
                    {/* <span className="text-sm text-gray-600">
                      USD {totalUSD}
                    </span> */}
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(groupedDataArray.length / rowsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ExtrasTable;
