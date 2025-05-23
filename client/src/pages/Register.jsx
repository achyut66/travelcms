import React, { useState, useEffect } from "react";
import "../index.css";
import { API_BASE_URL } from "../config";

const Register = () => {
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // profile fetch
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
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // live message

  useEffect(() => {
    if (formData.confirmPassword.length > 0) {
      if (formData.password === formData.confirmPassword) {
        setPasswordMatchMessage("✅ Passwords match");
      } else {
        setPasswordMatchMessage("❌ Passwords do not match");
      }
    } else {
      setPasswordMatchMessage("");
    }
  }, [formData.password, formData.confirmPassword]);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        alert("User registered successfully!");
        window.location.href = "/";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went big wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6 text-center">
          {profileData &&
            profileData.map((profile, idx) => (
              <img
                key={idx}
                src={`${API_BASE_URL}/uploads/${profile.company_logo}`}
                alt="Company Logo"
                // style={{ width: "100px", height: "100px" }}
                className="w-34 h-34 mx-auto rounded p-6"
              />
            ))}
          <h2 className="text-2xl font-bold text-gray-800">
            {profileData &&
              profileData.map((profile, idx) => (
                <span key={idx}>{profile.company_name}</span>
              ))}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Retype Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          {passwordMatchMessage && (
            <p
              className={`mt-1 text-sm font-medium ${
                passwordMatchMessage.includes("match")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordMatchMessage}
            </p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleRegister}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
