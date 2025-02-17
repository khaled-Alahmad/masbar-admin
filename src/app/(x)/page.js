"use client"
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import styles from "@/app/Layout.module.css";
import { FaThLarge, FaUsers, FaSyncAlt, FaBriefcase } from "react-icons/fa";
import RecentRequestCard from "@/components/RecentRequestCard/RecentRequestCard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getData } from "@/utils/apiHelper";
import ServicesRequestDaysTable from "@/components/ui/ServicesRequestDaysTable";
import { Card } from "@nextui-org/react";
import ServiceRequestReviewsDays from "@/components/ui/ServiceRequestReviewsDays";

export default function Dashboard() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/statistics`);
        console.log(response);
        setServices(response.data?.statistics || []);

        // setServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    // fetchServices();
    fetchClients();
  }, []);
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

  const { t } = useTranslation();

  return (
    <>

      <h1>{t('dashboard')}</h1>
      {/* <p>Current Language: {i18n.language}</p> */}

      <div className={styles.cards}>
        {services.map((card, index) => (
          <DashboardCard
            key={index}
            number={card.value}
            title={card.label}
            icon={card.icon}
            bgColor={card.color}
          />
        ))}
      </div>

      <div className="flex lg:flex-row flex-col   mt-6 gap-6">
        {/* <Card className="p-4 my-8"> */}
        <div className="lg:w-[55%] w-auto ">


          <ServicesRequestDaysTable />
        </div>
        {/* </Card> */}

        {/* <Card className="p-4 my-8 h-auto"> */}
        <div className="lg:w-[45%] w-auto">

          <ServiceRequestReviewsDays
          />
        </div>
        {/* </Card> */}
      </div>

    </>
  );
}
