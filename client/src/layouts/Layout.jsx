import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`flex h-screen bg-white-100 transition-all duration-300 w-full ${
          isSidebarOpen ? "ml-[260px]" : "ml-[70px]"
        }`}
      >
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        {isSidebarOpen ? (
          <div className="min-w-full pl-[1px] pt-[80px]">{children}</div>
        ) : (
          <div className="min-w-full pl-[30px] pt-[80px]">{children}</div>
        )}
      </div>
    </div>
  );
}
