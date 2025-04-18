import React, { useState } from "react";
import "../index.css"; // Import your CSS file here
import logo from "../assets/react.svg"; // Adjust the path as necessary
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // alert("Login successful!");
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
          <img src={logo} alt="Logo" className="w-24 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            ABC Travel And Tours
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
              className="absolute left-2 -top-2.5 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500"
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
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
          <div className="w-full">
            <Link to="/register">
              <button
                id="register-button"
                className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-gray-600 transition"
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
