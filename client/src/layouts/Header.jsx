import React, { useEffect } from "react";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import ExchangeRateTable from "../components/extras/ExchangeRateAll.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DButton from "../components/PowerBtn.jsx";
import DashboardNotification from "../components/extras/ToastNotification";
import { isSessionValid, clearSession } from "../utils/session";
import { useNavigate } from "react-router-dom";

// import Clock from "../components/Clock.jsx";

const Header = () => {
  const handleLogout = async () => {
    const res = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      window.location.href = "/";
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSessionValid()) {
      clearSession();
      alert("Session expired!");
      navigate("/");
    }
    const timer = setTimeout(() => {
      clearSession();
      alert("Session expired!");
      navigate("/");
    }, 60 * 60 * 1000); // 1 minute timeout

    return () => clearTimeout(timer); // Clean on unmount
  }, [navigate]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-blue-400 backdrop-blur-md p-4 flex justify-end items-center z-50 shadow-md">
        <div className="grid grid-cols-2 items-center">
          <div className="flex justify-end relative">
            {/* <div className="fixed"> */}
            <div className="relative bg-white rounded-[4px] p-0 flex items-right cursor-pointer z-50 mt-[-13px] mr-[-22px] z-999">
              <DButton
                label={<FontAwesomeIcon icon={faPowerOff} />}
                className="text-black-500"
                onClick={handleLogout}
              />
            </div>
            {/* </div> */}
          </div>
        </div>
      </nav>

      <div className="fixed top-0 left-0 w-full mt-[37px] z-80">
        <ExchangeRateTable />{" "}
      </div>
    </>
  );
};

export default Header;
