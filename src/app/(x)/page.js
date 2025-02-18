"use client"
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import styles from "@/app/Layout.module.css";
import { FaThLarge, FaUsers, FaSyncAlt, FaBriefcase } from "react-icons/fa";
import RecentRequestCard from "@/components/RecentRequestCard/RecentRequestCard";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getData } from "@/utils/apiHelper";
import ServicesRequestDaysTable from "@/components/ui/ServicesRequestDaysTable";
import { Card, Spinner } from "@nextui-org/react";
import CustomerReviews from "@/components/ui/CustomerReviews";

export default function Dashboard() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/statistics`);
        console.log(response);
        setServices(response.data?.statistics || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

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
            icon={card.icon}  // Ensure this is passed correctly
            bgColor={card.color}
          />
        ))}
      </div>


      <div className="flex lg:flex-row flex-col   mt-6 gap-6">
        {/* <Card className="p-4 my-8"> */}
        <div className="lg:w-[100%] w-auto ">

          <Suspense fallback={<Spinner color="primary" />}>

            <ServicesRequestDaysTable />
          </Suspense>
        </div>
        {/* </Card> */}

        {/* <Card className="p-4 my-8 h-auto"> */}
        {/* <div className="lg:w-[45%] w-auto">
          <Suspense fallback={<Spinner color="primary" />}>

            <CustomerReviews
            />
          </Suspense>
        </div> */}
        {/* </Card> */}
      </div>

    </>
  );
}
