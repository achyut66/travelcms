import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Sound from "../../assets/media/noti.mp3";
import Layout from "../../layouts/Layout";
import PickUpModal from "../../components/Modal.jsx";
import { toast } from "react-toastify";

const DashboardNotification = () => {
  const [hasNotification, setHasNotification] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const prevNotificationCount = useRef(0);
  const isTabActive = useRef(true);
  const [isPickUpModalVisible, setIsPickUpModalVisible] = useState(false);
  const [potterData, setPotterData] = useState([]);
  const [isVehicleUsed, setIsVehicleUsed] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActive.current = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch("/api/getdata-with-pickupdate");
        const result = await response.json();

        if (
          isTabActive.current &&
          result.count > prevNotificationCount.current
        ) {
          const audio = new Audio(Sound);
          audio
            .play()
            .catch((err) => console.error("Error playing sound:", err));
        }

        setHasNotification(result.count);
        setNotifications(result.data);
        prevNotificationCount.current = result.count;
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchNotification();
    const interval = setInterval(fetchNotification, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Potter Data and Vehicle Data
  const getPotterData = async () => {
    try {
      const response = await fetch("/api/guide-data");
      const data = await response.json();
      setPotterData(data);
    } catch (error) {
      console.error("Error fetching potter data:", error.message);
    }
  };

  const getVehicleUsed = async () => {
    try {
      const response = await fetch("/api/vehicle-data");
      const data = await response.json();
      setIsVehicleUsed(data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error.message);
    }
  };

  useEffect(() => {
    getPotterData();
    getVehicleUsed();
  }, []);

  const fieldsPickup = [
    {
      name: "pickup_date",
      label: "Pick-Up Date",
      type: "date",
      required: true,
      defaultValue: "",
    },
    {
      name: "assigned_person",
      label: "Name of Assigned Person",
      type: "select2",
      required: true,
      options: potterData.map((pck) => ({
        value: pck.contact_name,
        label: pck.contact_name,
      })),
    },
    {
      name: "pickup_time",
      label: "Pick-Up Time",
      type: "time",
      defaultValue: "",
    },
    {
      name: "vehicle_used",
      label: "Name of Vehicle Used",
      type: "select2",
      required: true,
      options: isVehicleUsed.map((pck) => ({
        value: pck.vehicle_type,
        label: pck.vehicle_type,
      })),
    },
    {
      name: "vehicle_charge",
      label: "Vehicle Charge",
      type: "string",
      defaultValue: "",
    },
  ];

  const handlePickUp = async (id, formData) => {
    try {
      const res = await fetch("/api/pickup-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: id,
          pickup_date: formData.pickup_date,
          assigned_person: formData.assigned_person,
          pickup_time: formData.pickup_time,
          vehicle_used: formData.vehicle_used,
          vehicle_charge: formData.vehicle_charge,
        }),
      });
      const result = await res.json();
      toast.success(result.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setIsPickUpModalVisible(false);
    } catch (error) {
      console.error("Error completing booking:", error);
      toast.error("Error completing booking.");
    }
  };

  const handleNotificationClick = (id) => {
    console.log(id);
    setSelectedId(id);
    setIsPickUpModalVisible(true);
  };

  return (
    <>
      <div className="relative group inline-block">
        <div className="cursor-pointer">
          <FontAwesomeIcon icon={faBell} className="text-gray-700 text-xl" />
          {hasNotification > 0 && (
            <span className="absolute -top-1 -right-2 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-600 rounded-full">
              {hasNotification}
            </span>
          )}
        </div>

        <div className="absolute right-[-290px] mt-[-20px] w-72 bg-white shadow-xl rounded-lg border border-gray-200 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="text-center font-semibold text-gray-800 text-md mb-3 border-b pb-1">
              🚐 Upcoming Pickups
            </div>
            {console.log(notifications)}
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No upcoming pickups.
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="block mb-2 p-2 rounded-md bg-gray-50 hover:bg-gray-300 transition-colors cursor-pointer"
                  onClick={() => handleNotificationClick(item._id)}
                >
                  <div className="text-sm font-medium text-gray-800">
                    {item.company_name || "Guest Name"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Pickup Date: {item.pickup_date?.slice(0, 10)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* <Layout> */}
      <PickUpModal
        visible={isPickUpModalVisible}
        onClose={() => setIsPickUpModalVisible(false)}
        title="Pick-Up Information"
        fields={fieldsPickup}
        selectedId={selectedId}
        onSubmit={(formData) => {
          handlePickUp(selectedId, formData);
        }}
      />
      {/* </Layout> */}
    </>
  );
};

export default DashboardNotification;
