// App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompanyProfile from "./pages/CompanyProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/company-profile" element={<CompanyProfile />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}
