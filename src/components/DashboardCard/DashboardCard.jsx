import {
  FaServicestack,
  FaBan,
  FaPercentage,
  FaListAlt,
  FaDollarSign,
  FaHandHoldingUsd,
  FaDonate,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import styles from "./DashboardCard.module.css";

// Mapping icon names to actual React Icons components
const iconMap = {
  FaServicestack: FaServicestack,
  FaBan: FaBan,
  FaPercentage: FaPercentage,
  FaListAlt: FaListAlt,
  FaDollarSign: FaDollarSign,
  FaHandHoldingUsd: FaHandHoldingUsd,
  FaDonate: FaDonate,
  FaFileInvoiceDollar: FaFileInvoiceDollar,
};

const DashboardCard = ({ number, title, icon, bgColor }) => {
  const IconComponent = iconMap[icon] || null; // Get the correct icon component

  return (
    <div className={styles.card} style={{ backgroundColor: bgColor }}>
      <div className={styles.content}>
        <h2 className={styles.number}>{number}</h2>
        <p className={styles.title}>{title}</p>
      </div>
      <div className={styles.icon}>
        {IconComponent && <IconComponent size={30} color="#fff" />}{" "}
        {/* Render the icon */}
      </div>
    </div>
  );
};

export default DashboardCard;
