import React, { useState, useEffect } from "react";
import "../index.css"; // Import your CSS file here
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import setSession from "../../src/utils/session";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
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

  // useEffect(() => {
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSession();
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
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
        {error && (
          <div className="text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative w-full">
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder=" "
              className="peer h-12 w-full border border-gray-300 rounded-md px-3 text-sm placeholder-transparent focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <label
              htmlFor="username"
              className="absolute left-2 -top-2.5 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 "
            >
              Username
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="peer h-12 w-full border border-gray-300 rounded-md px-3 text-sm placeholder-transparent focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <label
              htmlFor="password"
              className="absolute left-2 -top-2.5 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500"
            >
              Password
            </label>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="w-full">
            <button
              onClick={handleLogin}
              id="login-button"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition cursor-pointer"
            >
              Login
            </button>
          </div>
          <div className="w-full">
            <Link to="/register">
              <button
                id="register-button"
                className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-gray-600 transition cursor-pointer"
              >
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
