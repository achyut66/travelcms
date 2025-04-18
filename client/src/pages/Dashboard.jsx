import React from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import "../index.css";
import Stomach from "../components/Stomach";
import Layout from "../layouts/Layout";

const Dashboard = () => {
  return (
    <div className="flex flex-row">
      <Layout>
        <Stomach />
      </Layout>
    </div>
  );
};
export default Dashboard;
