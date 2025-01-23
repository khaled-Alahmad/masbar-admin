import styles from "./RecentRequestCard.module.css";
import {
  FaBolt,
  FaMoneyBill,
  FaMapMarkerAlt,
  FaEllipsisH,
} from "react-icons/fa";

const RecentRequestCard = ({
  title,
  time,
  offers,
  amount,
  location,
  user,
  image,
  status,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <FaEllipsisH className={styles.menuIcon} />
      </div>
      <p className={styles.time}>{time}</p>
      <div className={styles.details}>
        <div className={styles.detailA}>
          <FaBolt className={styles.icon} />
          <span>{offers} Offers</span>
        </div>
        <div className={styles.detailA}>
          <FaMoneyBill className={styles.icon} />
          <span>{amount} Amount</span>
        </div>
        <div className={styles.detailA}>
          <FaMapMarkerAlt className={styles.icon} />
          <span>{location}</span>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.user}>
          <img src={image} alt={user} className={styles.avatar} />
          <span>{user}</span>
        </div>
        <span className={styles.status}>{status}</span>
      </div>
    </div>
  );
};

export default RecentRequestCard;
