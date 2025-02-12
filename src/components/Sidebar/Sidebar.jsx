"use client";
import { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/app/Layout.module.css";
import {
  FaTachometerAlt,
  FaThLarge,
  FaSignOutAlt,
  FaTools,
  FaBriefcase,
  FaStar,
  FaUserFriends,
  FaUsersCog,
  FaQuestionCircle,
  FaArchway,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
// import { Link } from "@nextui-org/react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef(null); // Ref to detect clicks outside

  const menuItems = [
    { name: "Dashboard", link: "/", icon: <FaTachometerAlt /> },
    { name: "Service categories", link: "/services", icon: <FaThLarge /> },
    // { name: "Client Management", link: "/clients", icon: <FaUserFriends /> },
    { name: "Service Type", link: "/services-type", icon: <FaTools /> },
    {
      name: "Service Request",
      link: "/service-requests",
      icon: <FaBriefcase />,
    },
    // {
    //   name: "Revenue and Finance",
    //   link: "/finance",
    //   icon: <FaMoneyBillWave />,
    // },
    // { name: "Transaction", link: "/transaction", icon: <FaExchangeAlt /> },
    {
      name: "Invoices",
      link: "/invoices",
      icon: <FaFileInvoiceDollar />,
    },
    {
      name: "Service Request Reviews",
      link: "/service-request-reviews",
      icon: <FaArchway />,
    },
    { name: "Ads", link: "/ads", icon: <FaQuestionCircle /> },
    { name: "Clients", link: "/clients", icon: <FaUserFriends /> },
    { name: "Providers", link: "/providers", icon: <FaUsersCog /> },

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
          <div className={styles.logo}>
            <img
              src="/logo.jpg"
              alt="Instahando Logo"
              style={{ objectFit: "contain" }}
            />
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
          <div className={styles.logo}>
            <img
              src="/logo.jpg"
              alt="Instahando Logo"
              style={{ objectFit: "contain" }}
            />
          </div>
          <ul className={styles.menu}>
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
