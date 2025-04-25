import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function Stomach() {
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/profile-data");
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const result = await response.json();
        // console.log(result);
        setProfileData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-w-[1200px] h-full">
        <div>
          {profileData &&
            profileData.map((profile, idx) => (
              <>
                <img
                  key={idx}
                  src={`${API_BASE_URL}/uploads/${profile.company_logo}`}
                  alt="Company Logo"
                  style={{ width: "100px", height: "auto" }}
                  className="ml-[170px]"
                />
                <h1 className="text-3xl font-bold mb-4">
                  {profile.company_name}
                </h1>
                <p className="text-lg text-center">{profile.company_address}</p>
                <p className="text-lg text-center">
                  Managing director{" "}
                  <span className="text-red-500">{profile.contact_person}</span>
                </p>
              </>
            ))}
        </div>
      </div>
    </>
  );
}
