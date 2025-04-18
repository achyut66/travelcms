// App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompanyProfile from "./pages/CompanyProfile";
import Booking from "./pages/Classification/Booking";
// import Customer from "./pages/Classification/Customer";
// import Destination from "./pages/Classification/Destination";
// import Transportation from "./pages/Classification/Transportation";
// import Expenses from "./pages/Classification/Expenses";
// import Flights from "./pages/Classification/Flights";
// import Itinery from "./pages/Classification/Itinery";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/company-profile" element={<CompanyProfile />} />
      <Route path="/booking" element={<Booking />} />
      {/* <Route path="/customer" element={<Customer />} />
      <Route path="/destination" element={<Destination />} />
      <Route path="/transportation" element={<Transportation />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/flights" element={<Flights />} />
      <Route path="/itinery" element={<Itinery />} /> */}
      {/* Add more routes as needed */}
    </Routes>
  );
}
