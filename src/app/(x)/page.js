"use client"
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import styles from "@/app/Layout.module.css";
import { FaThLarge, FaUsers, FaSyncAlt, FaBriefcase } from "react-icons/fa";
import RecentRequestCard from "@/components/RecentRequestCard/RecentRequestCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const cardData = [
    {
      number: "500",
      title: "Total Service",
      icon: <FaThLarge color="#ff7e29" />,
      bgColor: "#fff5ec",
    },
    {
      number: "1,200",
      title: "Total Clients",
      icon: <FaUsers color="#2ab284" />,
      bgColor: "#ebfaf4",
    },
    {
      number: "1,600",
      title: "Total service providers",
      icon: <FaSyncAlt color="#637bfe" />,
      bgColor: "#f0f4ff",
    },
    {
      number: "1,600",
      title: "Total Requests",
      icon: <FaBriefcase color="#a154d5" />,
      bgColor: "#f8f2ff",
    },
  ];
  const recentRequests = [
    {
      title: "Air conditioning technician required",
      time: "2 days ago",
      offers: 25,
      amount: "150$",
      location: "Umm Al Quwain",
      user: "Mohammed bin Shafi",
      image: "/images/user-avatar.svg",
      status: "New",
    },
    {
      title: "Air conditioning technician required",
      time: "Few seconds",
      offers: 25,
      amount: "150$",
      location: "Jebel Ali",
      user: "Mubarak Al Ameri",
      image: "/images/user-avatar.svg",
      status: "New",
    },
    {
      title: "Air conditioning technician required",
      time: "Few seconds",
      offers: 25,
      amount: "150$",
      location: "Al damam",
      user: "Layla Al Yamahi",
      image: "/images/user-avatar.svg",
      status: "New",
    },
  ];
  const user = { avatar: "/images/user-avatar.svg" };
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => i18n.changeLanguage(lang);
  return (
    <>

      <h1>Dashboard</h1>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button onClick={() => changeLanguage('ar')}>Arabic</button>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('tr')}>Turkish</button>
      <div className={styles.cards}>
        {cardData.map((card, index) => (
          <DashboardCard
            key={index}
            number={card.number}
            title={card.title}
            icon={card.icon}
            bgColor={card.bgColor}
          />
        ))}
      </div>
      <h1 className="mt-6">Recent Requests</h1>
      <div className={styles.cards}>
        {recentRequests.map((request, index) => (
          <RecentRequestCard key={index} {...request} />
        ))}
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}

      {/* <div className={styles.dashboardContent}> */}

      {/* </div> */}
    </>
  );
}
