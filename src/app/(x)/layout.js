"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import styles from "@/app/Layout.module.css";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = { avatar: "/images/user-avatar.svg" };
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        className={isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}
      />

      <Header
        user={user}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      {/* Main Content */}
      <div
        className={`${styles.main} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
          }`}
      >
        <div
          className={`${styles.dashboardContent} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
            }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
