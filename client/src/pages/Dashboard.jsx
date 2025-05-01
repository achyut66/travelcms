import React from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import "../index.css";
import Layout from "../layouts/Layout";
import BookingGrid from "../components/BookingGrid";
// import Stomach from "../components/Stomach";
import ChartGrid from "../components/extras/ChartGrid";

const Dashboard = () => {
  return (
    <Layout>
      <div className="mt-[-22px]">
        <BookingGrid />
      </div>
      <ChartGrid />
    </Layout>
  );
};
export default Dashboard;
