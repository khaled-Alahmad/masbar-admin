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

const VendorDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [clientDetails, setClientDetails] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await getData(`/vendors/${itemId}`);
        if (response.success) {
          setClientDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to load client data:", error);
      }
    };

    if (isOpen) fetchClientData();
  }, [isOpen, itemId]);

  if (!clientDetails) {
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

  const { user, services, account_type, status, years_experience } =
    clientDetails;
  const {
    first_name,
    last_name,
    email,
    phone,
    profile_photo,
    location,
    images,
  } = user;
  console.log(user);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>Vendor Details</ModalHeader>
        <ModalBody>
          {/* Client Details */}
          <div className={styles.details}>
            <div className="flex justify-between">
              <strong>First Name:</strong> <span>{first_name}</span>
            </div>
            <div className="flex justify-between">
              <strong>Last Name:</strong> <span>{last_name}</span>
            </div>
            <div className="flex justify-between">
              <strong>Email:</strong> <span>{email}</span>
            </div>
            <div className="flex justify-between">
              <strong>Phone:</strong> <span>{phone}</span>
            </div>
            <div className="flex justify-between">
              <strong>Vendor Type:</strong> <span>{account_type}</span>
            </div>
            <div className="flex justify-between">
              <strong>Experience Years:</strong>{" "}
              <span>{years_experience} Years</span>
            </div>
            <div className="flex justify-between">
              <strong>Status:</strong>{" "}
              <span className={status === "active" ? styles.active : ""}>
                {status}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Address 1:</strong>{" "}
              <span> {location.street_address}</span>
            </div>
            <div className="flex justify-between">
              <strong>Address 2:</strong> <span>{location.exstra_address}</span>
            </div>
            <div className="flex justify-between">
              <strong>Country:</strong> <span>{location.country}</span>
            </div>
            <div className="flex justify-between">
              <strong>City:</strong> <span>{location.city}</span>
            </div>
            <div className="flex justify-between">
              <strong>State:</strong> <span>{location.state}</span>
            </div>
            <div className="flex justify-between">
              <strong>Postal Code :</strong> <span>{location.zip_code}</span>
            </div>
            <div className="flex justify-between">
              <strong>Service Name :</strong>{" "}
              <span>{services?.map((service) => service.name).join(", ")}</span>
            </div>
            {/* <div className="flex justify-between">
              <strong>Address:</strong>{" "}
              <span>
                {location.street_address}, {location.city}, {location.state},{" "}
                {location.country} - {location.zip_code}
              </span>
            </div> */}
            <div>
              <strong>Profile Photo:</strong>
              <div className={styles.imageContainer}>
                {profile_photo && (
                  <img
                    src={profile_photo}
                    alt="Profile"
                    className={styles.additionalImage}
                  />
                )}
              </div>
            </div>
            <div>
              <strong>Additional Images:</strong>
              <div className={styles.imageGallery}>
                {images &&
                  images.map((image, index) => (
                    <img
                      key={index}
                      src={image.path}
                      alt={`Client Image ${index + 1}`}
                      className={styles.additionalImage}
                    />
                  ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Back
          </Button>
          <Button color="primary" onPress={onEdit}>
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VendorDetailsModal;
