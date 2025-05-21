// App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// classification package
import Booking from "./pages/Classification/Booking";
// import Customer from "./pages/Classification/Customer";
// import Destination from "./pages/Classification/Destination";
// import Transportation from "./pages/Classification/Transportation";
// import Expenses from "./pages/Classification/Expenses";
// import Flights from "./pages/Classification/Flights";
// import Itinery from "./pages/Classification/Itinery";

// setting packages
import CompanyProfile from "./pages/Settings/CompanyProfile";
import NationalitySetting from "./pages/Settings/Nationality";
import PackageSetting from "./pages/Settings/Package";
import PaymentMethodSetting from "./pages/Settings/PaymentMethod";
import PaymentStatusSetting from "./pages/Settings/PaymentStatus";
import VisitPurposeSetting from "./pages/Settings/VisitPurpose";
import LanguageSetting from "./pages/Settings/Language";
import GuideSetting from "./pages/Settings/Guide";
import TransportationSetting from "./pages/Inventory/Transportation";
import FlightSetting from "./pages/Settings/Flight";
import Itenerary from "./pages/Classification/Itenerary/Itinery";
import ExtraDetails from "./pages/Classification/Extras/ExtraDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FlightBookingInfo from "./pages/Classification/FlightBooking";
import VehicleBooking from "./pages/Classification/BusBooking";
import EquipmentSetting from "./pages/Inventory/EquipmentInventory";
import AccountReport from "./pages/Account/AnnualAccountReport";

// reports package
import BookingReport from "./pages/report/BookingReport";
import FlightReport from "./pages/report/FlightReport";

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings/company-profile" element={<CompanyProfile />} />
        <Route path="/classification/booking" element={<Booking />} />

        {/* settings packages */}

        <Route path="/settings/nationality" element={<NationalitySetting />} />
        <Route path="/settings/package" element={<PackageSetting />} />
        <Route
          path="/settings/paymentmethod"
          element={<PaymentMethodSetting />}
        />
        <Route
          path="/settings/paymentstatus"
          element={<PaymentStatusSetting />}
        />
        <Route
          path="/settings/visitpurpose"
          element={<VisitPurposeSetting />}
        />
        <Route path="/settings/language" element={<LanguageSetting />} />
        <Route path="/settings/guide_potter" element={<GuideSetting />} />
        <Route
          path="/inventory/transportation"
          element={<TransportationSetting />}
        />
        <Route path="/settings/flight" element={<FlightSetting />} />
        {/* <Route path="/customer" element={<Customer />} />
      <Route path="/destination" element={<Destination />} />
      <Route path="/transportation" element={<Transportation />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/flights" element={<Flights />} />
      <Route path="/itinery" element={<Itinery />} /> */}
        {/* Add more routes as needed */}

        {/* reports routes */}
        <Route path="/report/booking" element={<BookingReport />} />
        <Route path="/classification/itinery" element={<Itenerary />} />
        <Route path="/classification/extras" element={<ExtraDetails />} />
        <Route
          path="/classification/booking/flight"
          element={<FlightBookingInfo />}
        />
        <Route path="/report/flight-booking" element={<FlightReport />} />
        <Route
          path="/classification/booking/vehicle"
          element={<VehicleBooking />}
        />
        <Route path="/inventory/equipment" element={<EquipmentSetting />} />
        <Route
          path="/account/annual-account-report"
          element={<AccountReport />}
        />
      </Routes>
    </>
  );
}
