"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/app/Layout.module.css";
import {
  FaTachometerAlt,
  FaThLarge,
  FaUsersCog,
  FaUserFriends,
  FaTools,
  FaBriefcase,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaQuestionCircle,
  FaStar,
  FaBell,
  FaSignOutAlt,
  FaArchway,
  FaBars,
} from "react-icons/fa";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef(null); // Ref to detect clicks outside

  const menuItems = [
    { name: "Dashboard", link: "/", icon: <FaTachometerAlt /> },
    { name: "Service categories", link: "/services", icon: <FaThLarge /> },
    // { name: "Vendor Management", link: "/vendors", icon: <FaUsersCog /> },
    // { name: "Client Management", link: "/clients", icon: <FaUserFriends /> },
    // { name: "Service Request", link: "/requests", icon: <FaTools /> },
    // { name: "Jobs", link: "/jobs", icon: <FaBriefcase /> },
    // {
    //   name: "Revenue and Finance",
    //   link: "/finance",
    //   icon: <FaMoneyBillWave />,
    // },
    // { name: "Transaction", link: "/transaction", icon: <FaExchangeAlt /> },
    // {
    //   name: "Billing management",
    //   link: "/billing",
    //   icon: <FaFileInvoiceDollar />,
    // },
    // { name: "Proposals", link: "/proposals", icon: <FaArchway /> },
    // { name: "FQA", link: "/fqa", icon: <FaQuestionCircle /> },
    // { name: "Customer Reviews", link: "/reviews", icon: <FaStar /> },
    // { name: "Notification", link: "/notifications", icon: <FaBell /> },
    { name: "Logout", link: "#", icon: <FaSignOutAlt /> },
  ];

  const handleLogout = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("No active session found.");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      deleteCookie("token");
      toast.success("Logged out successfully!");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.error("Logout Error:", error);
    }
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       sidebarRef.current &&
  //       !sidebarRef.current.contains(event.target) &&
  //       isSidebarOpen
  //     ) {
  //       toggleSidebar(); // Close sidebar if clicked outside
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isSidebarOpen, toggleSidebar]);

  return (
    <div
      className={`${styles.sidebar} ${
        isSidebarOpen ? styles.open : styles.sidebarClosed
      }`}
      ref={sidebarRef}
    >
      {isSidebarOpen ? (
        <>
          <div className={styles.logo} style={{ height: "4rem" }}>
            {/* <img src="/logo.svg" alt="Instahando Logo" /> */}
          </div>
          <ul className={styles.menu}>
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`${styles.menuItem} ${
                  pathname === item.link ? styles.active : ""
                }`}
              >
                {item.name === "Logout" ? (
                  <Link
                    href={item.link}
                    onClick={handleLogout}
                    className={styles.link}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    {item.name}
                  </Link>
                ) : (
                  <Link href={item.link} className={styles.link}>
                    <span className={styles.icon}>{item.icon}</span>
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>{" "}
        </>
      ) : (
        <>
          <div className={styles.logo} style={{ height: "4rem" }}>
            {/* <img src="/logo.svg" alt="Instahando Logo" /> */}
          </div>
          <ul className={styles.menu}>
            {/* <li className={styles.icon}>
              <Link
                href={"#"}
                className={`${styles.menuItem} ${
                  isSidebarOpen ? styles.open : ""
                }`}
                onClick={toggleSidebar}
              >
                <FaBars />
              </Link>{" "}
            </li> */}

            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`${styles.icon} ${
                  pathname === item.link ? styles.active : ""
                }`}
              >
                {item.name === "Logout" ? (
                  <Link
                    href={item.link}
                    onClick={handleLogout}
                    className={styles.link}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    {/* {item.name} */}
                  </Link>
                ) : (
                  <Link href={item.link} className={styles.link}>
                    <span className={styles.icon}>{item.icon}</span>
                    {/* {item.name} */}
                  </Link>
                )}
              </li>
            ))}
          </ul>{" "}
        </>
      )}
    </div>
  );
};

export default Sidebar;
