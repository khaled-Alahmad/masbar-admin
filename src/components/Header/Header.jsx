"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBars, FaBell, FaChevronDown } from "react-icons/fa";
import styles from "./Header.module.css";
import toast from "react-hot-toast";
import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import LanguageSwitcher from "@/utils/LanguageSwitcher";

const Header = ({ user, toggleSidebar, isSidebarOpen }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setNotificationOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      // Retrieve token from cookies
      const token = getCookie("token");

      if (!token) {
        toast.error("No active session found.");
        return;
      }

      // Call the logout API
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove token from cookies
      deleteCookie("token");

      // Show success message
      toast.success("Logged out successfully!");

      // Redirect to login page
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
      console.error("Logout Error:", error);
    }
  };

  return (
    <header className={styles.header}>
      {/* Notification Bell */}
      <button
        className={`${styles.toggleButton} ${isSidebarOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      <div className="flex gap-4">
        <div className={styles.iconWrapper} onClick={toggleNotifications}>
          <FaBell className={styles.notificationIcon} />
          {isNotificationOpen && (
            <div className={styles.notificationDropdown}>
              <p>No new notifications</p>
            </div>
          )}
        </div>
        <LanguageSwitcher />
        {/* User Profile */}
        <div className={styles.profile} onClick={toggleDropdown}>
          <img src={user.avatar} alt="User Avatar" className={styles.avatar} />
          <FaChevronDown className={styles.chevron} />
          {isDropdownOpen && (
            <div className={styles.profileDropdown}>
              <p>My Profile</p>
              <p>Settings</p>
              <p onClick={handleLogout} className={styles.logout}>
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
