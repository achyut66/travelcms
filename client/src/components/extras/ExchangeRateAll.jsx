import React, { useEffect, useState } from "react";
import "../../index.css";

const ExchangeRateMarquee = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = "cur_live_WnpCcZWUiDxi3I01JBt1tS0egWV0WWz9BWD1GU6N"; // Replace with your actual API key
  const CACHE_KEY = "exchangeRateData";
  const CACHE_DURATION = 1000 * 60 * 60 * 5; // 5 hour

  const TARGET_CURRENCIES = [
    { code: "USD", country: "USA", flag: "us" },
    { code: "INR", country: "India", flag: "in" },
    { code: "CNY", country: "China", flag: "cn" },
    { code: "EUR", country: "Eurozone", flag: "eu" },
    { code: "CAD", country: "Canada", flag: "ca" },
    { code: "AUD", country: "Australia", flag: "au" },
    { code: "THB", country: "Thailand", flag: "th" },
    { code: "BDT", country: "Bangladesh", flag: "bd" },
    { code: "MMK", country: "Myanmar", flag: "mm" },
    { code: "BTN", country: "Bhutan", flag: "bt" },
    { code: "LKR", country: "Sri Lanka", flag: "lk" },
    { code: "GBP", country: "United Kingdom", flag: "gb" },
    { code: "SGD", country: "Singapore", flag: "sg" },
    { code: "MYR", country: "Malaysia", flag: "my" },
    { code: "JPY", country: "Japan", flag: "jp" },
    { code: "KRW", country: "South Korea", flag: "kr" },
    { code: "BRL", country: "Brazil", flag: "br" },
  ];

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

  if (loading) return <div>Loading exchange rates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="overflow-hidden bg-blue-400 p-2 text-sm">
        <div className="flex animate-marquee whitespace-nowrap">
          {TARGET_CURRENCIES.map(({ code, country, flag }) => {
            // const rate = rates[code] ? rates[code].value : null;
            const rate = rates[code] ? 1 / rates[code].value : null;
            // console.log(rate);
            return (
              <span key={code} className="inline-flex items-center mx-4">
                <img
                  src={`https://flagcdn.com/w20/${flag}.png`}
                  alt={country}
                  className="w-5 h-3 mr-1 object-cover"
                />
                <strong>{code}: &nbsp;</strong> {rate ? rate.toFixed(2) : "N/A"}
                {/* <strong>{code}:</strong> {rate ? (1 / rate).toFixed(2) : "N/A"}{" "} */}
                &nbsp;NPR &nbsp;&nbsp;&nbsp;
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ExchangeRateMarquee;
