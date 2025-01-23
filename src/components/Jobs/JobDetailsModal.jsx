"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import styles from "@/assets/css/components/ServiceRequestDetails.module.css";
import { getData } from "@/utils/apiHelper";

const JobDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await getData(`/orders/${itemId}`);
        if (response.success) {
          setJobDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to load job data:", error);
      }
    };

    if (isOpen) fetchJobData();
  }, [isOpen, itemId]);

  if (!jobDetails) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalBody>
            <p>Loading...</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const {
    services,
    account_type,
    status,
    years_experience,
    created_at,
    start_date,
    images,
    title,
    price,
    description,
    service_request,
  } = jobDetails;
  const { client, service } = service_request;
  const { user } = client;
  const { first_name, last_name, email, phone, profile_photo, location } = user;
  // console.log(user);
  let formattedDate;
  try {
    formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(created_at));
  } catch (error) {
    console.error("Date formatting error:", error);
    formattedDate = "Invalid date"; // Fallback message
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>Job Details</ModalHeader>
        <ModalBody>
          {/* Client Details */}
          <div className={styles.details}>
            <div className="flex justify-between">
              <strong>Client Name:</strong>{" "}
              <span>{first_name + " " + last_name}</span>
            </div>

            <div className="flex justify-between">
              <strong>Date:</strong>{" "}
              <span>{formattedDate.replace(/\//g, " \\ ")}</span>
            </div>
            <div className="flex justify-between">
              <strong>Service Name:</strong> <span>{service.name}</span>
            </div>
            <div className="flex justify-between">
              <strong>Job Name:</strong> <span>{title}</span>
            </div>
            <div className="flex justify-between">
              <strong>Final fees:</strong> <span>{price}$</span>
            </div>
            <div>
              <strong>Service Description:</strong>{" "}
              <p className={styles.description}>{description}</p>
            </div>
            {/* <div className="flex justify-between">
              <strong>Address:</strong>{" "}
              <span>
                {location.street_address}, {location.city}, {location.state},{" "}
                {location.country} - {location.zip_code}
              </span>
            </div> */}
            {/* <div>
              <strong>Profile Photo:</strong>
              <div className={styles.imageContainer}>
                {profile_photo && (
                  <img
                    src={profile_photo}
                    alt="Profile"
                    className={styles.profilePhoto}
                  />
                )}
              </div>
            </div> */}
            <div>
              <strong>Additional Images:</strong>
              <div className={styles.imageGallery}>
                {images &&
                  images.map((image, index) => (
                    <img
                      key={index}
                      src={image.path}
                      alt={` Image ${index + 1}`}
                      className={styles.additionalImage}
                    />
                  ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="w-[100%]" onPress={onClose}>
            Back
          </Button>
          {/* <Button color="primary" onPress={onEdit}>
            Edit
          </Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JobDetailsModal;
