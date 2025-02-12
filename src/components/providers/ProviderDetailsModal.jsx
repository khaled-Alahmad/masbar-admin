"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
} from "@nextui-org/react";
import styles from "@/assets/css/components/ServiceRequestDetails.module.css";
import { getData } from "@/utils/apiHelper";
import Image from "next/image";
import { languageKeys } from "@/utils/lang";

const ProviderDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/providers/${itemId}`);
        if (response.success) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
      }
    };

    if (isOpen) {
      fetchServiceData();
    } else {
      setServices(null); // Reset services when modal is closed
    }
  }, [isOpen, itemId]);

  if (!services) {
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

  const { user } = services;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setServices(null); // Ensure services are reset on close
        onClose(); // Call the provided onClose function
      }}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>View Provider</ModalHeader>
        <ModalBody>
          {/* Details Section */}
          <div className={styles.details}>
            <div className="flex justify-between">
              <strong>Full Name:</strong>{" "}
              <span>{user.first_name + " " + user.last_name}</span>
            </div>
            <div className="flex justify-between">
              <strong>Phone:</strong> <span>{user.phone_number}</span>
            </div>
            <div className="flex justify-between">
              <strong>Email:</strong> <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <strong>Gender:</strong> <span>{user.gender}</span>
            </div>
            <div className="flex justify-between">
              <strong>Status:</strong>{" "}
              <span
                className={
                  user.status === "ACTIVE"
                    ? "bg-green-300 text-white rounded-lg p-1"
                    : user.status === "PENDING"
                    ? "bg-orange-300 text-white rounded-lg p-1"
                    : "bg-red-300 text-white rounded-lg p-1"
                }
              >
                {user.status}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Created At:</strong>{" "}
              <span>{new Date(user.created_at).toLocaleString("EN-us")}</span>
            </div>
            {/* <div className="flex justify-between">
              <strong>order:</strong> <span>{sort}</span>
            </div> */}
          </div>

          <div>
            <strong>Avatar</strong>
            {/* <div className={styles.mediaGrid}> */}
            <div className={styles.mediaBox}>
              <img
                // priority
                src={user.avatar || "https://placehold.co/400"}
                // width={0}
                // height={0}
                // objectFit="cover"
                alt={`Media `}
              />
            </div>
            {/* </div> */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Back
          </Button>
          <Button color="primary" onClick={onEdit}>
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProviderDetailsModal;
