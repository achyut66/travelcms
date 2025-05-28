import React from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import "../index.css";
import Layout from "../layouts/Layout";
import BookingGrid from "../components/BookingGridNew";
// import Stomach from "../components/Stomach";
import ChartGrid from "../components/extras/ChartGrid";

const Dashboard = () => {
  return (
    <Layout>
      {/* booking chart grid for each indivisual bookings */}
      <div className="mt-[-22px]">
        <BookingGrid />
      </div>
      <ChartGrid />
    </Layout>
  );
};
export default Dashboard;
