"use client";
import { getData } from "@/utils/apiHelper";
import styles from "./CustomerReviews.module.css";
import { Avatar } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "James Smith",
    image: "/path-to-image1.jpg",
    rating: 4.5,
    text: "This is a sample text that can be replaced in the same space. This text was generated from a text generator.",
    time: "2 months ago",
  },
  {
    id: 2,
    name: "Emma Johnson",
    image: "/path-to-image2.jpg",
    rating: 4,
    text: "This is a sample text that can be replaced in the same space. This text was generated from a text generator.",
    time: "2 months ago",
  },
];

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className={styles.filledStar} />);
    } else if (i - 0.5 === rating) {
      stars.push(<FaStarHalfAlt key={i} className={styles.filledStar} />);
    } else {
      stars.push(<FaRegStar key={i} className={styles.emptyStar} />);
    }
  }
  return stars;
};

export default function CustomerReviews() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/service-request-reviews`);
        console.log(response);
        // const clientOptions = response.data.map((item) => ({
        //   label: `${item.user.first_name} ${item.user.last_name}`,
        //   value: String(item.id), // Ensure value is a string
        // }));

        // // Add the "All" option at the beginning
        // const allOption = { label: "All", value: null };
        setClients(response.data); // Prepend the "All" option
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    // fetchServices();
    fetchClients();
  }, []);
  return (
    <div className={styles.reviewsContainer}>
      <h2 className={styles.title}>Customer Reviews</h2>
      {clients.map((review) => (
        <div key={review.id} className={styles.reviewCard}>
          <Avatar  src={review.client.user.avatar} className={styles.avatar} />
          <div className={styles.reviewContent}>
            <h3 className={styles.name}>
              {review.client.user.first_name +
                " " +
                review.client.user.last_name}
            </h3>
            <div className={styles.stars}>{renderStars(review.rate)}</div>
            <p className={styles.text}>{review.review}</p>
            <span className={styles.time}>
              {new Date(review.created_at).toLocaleDateString("EN-ca")}
            </span>
          </div>
        </div>
      ))}
      {/* <button className={styles.showMore}>Show More</button> */}
    </div>
  );
}
