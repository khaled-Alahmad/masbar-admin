import styles from "./DashboardCard.module.css";

const DashboardCard = ({ number, title, icon, bgColor }) => {
  return (
    <div className={styles.card} style={{ backgroundColor: bgColor }}>
      <div className={styles.content}>
        <h2 className={styles.number}>{number}</h2>
        <p className={styles.title}>{title}</p>
      </div>
      {/* <div className={styles.icon}>{`<${icon} />`}</div> */}
    </div>
  );
};

export default DashboardCard;
