import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DButton from "../components/PowerBtn.jsx";
import ExchangeRateTable from "../components/extras/ExchangeRateAll.jsx";
import { isSessionValid, clearSession } from "../utils/session";
import { API_BASE_URL } from "../config.js";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await fetch(`${API_BASE_URL}/api/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      clearSession();
      navigate("/");
    }
  };

  useEffect(() => {
    const checkSession = () => {
      if (!isSessionValid()) {
        clearSession();
        alert("Session expired!");
        navigate("/");
      }
    };

    // Check session validity on mount
    checkSession();

    // Set an interval to check session validity every minute
    const interval = setInterval(checkSession, 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-blue-400 backdrop-blur-md p-4 flex justify-end items-center z-50 shadow-md">
        <div className="relative bg-white rounded-[4px] p-0 flex items-right cursor-pointer z-50 mt-[-13px] mr-[-12px] z-999">
          <DButton
            label={<FontAwesomeIcon icon={faPowerOff} />}
            className="text-black-500"
            onClick={handleLogout}
          />
        </div>
      </nav>

      <div className="fixed top-0 left-0 w-full mt-[37px] z-80">
        <ExchangeRateTable />
      </div>
    </>
  );
};

export default Header;
