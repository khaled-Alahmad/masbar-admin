"use client";
import { useEffect, useState, Suspense } from "react";
import { getData } from "@/utils/apiHelper";
import DashboardCard from "@/components/DashboardCard/DashboardCard";
import ServicesRequestDaysTable from "@/components/ui/ServicesRequestDaysTable";
import { Spinner } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import styles from "@/app/Layout.module.css";

export default function Dashboard() {
  const { t } = useTranslation();
  const [services, setServices] = useState(() => {
    // Load initial data from localStorage
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("statistics");
      return savedData ? JSON.parse(savedData) : [];
    }
    return [];
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/statistics`);
        console.log(response);

        if (response.data?.statistics) {
          setServices(response.data.statistics);
          localStorage.setItem("statistics", JSON.stringify(response.data.statistics));
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <>
      <h1>{t("dashboard")}</h1>

      {/* Show stored data immediately */}
      <div className={styles.cards}>
        {services.length > 0 ? (
          services.map((card, index) => (
            <DashboardCard
              key={index}
              number={card.value}
              title={card.label}
              icon={card.icon}
              bgColor={card.color}
            />
          ))
        ) : (
          <p>{t("no_data_available")}</p>
        )}
      </div>

      <div className="flex lg:flex-row flex-col mt-6 gap-6">
        <div className="lg:w-[100%] w-auto">
          <Suspense fallback={<Spinner color="primary" />}>
            <ServicesRequestDaysTable />
          </Suspense>
        </div>
      </div>
    </>
  );
}
