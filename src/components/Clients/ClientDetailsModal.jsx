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

const ClientDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [clientDetails, setClientDetails] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await getData(`/clients/${itemId}`);
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

  const { user } = clientDetails;
  const {
    first_name,
    last_name,
    email,
    phone,
    profile_photo,
    exstra_address,
    location,
    images,
  } = user;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>Client Details</ModalHeader>
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

export default ClientDetailsModal;
