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

const ReviewDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/vendor-reviews/${itemId}`);
        if (response.success) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Failed to load faq data:", error);
      }
    };

    if (isOpen) fetchServiceData();
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

  const { question, answer } = services;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>View FQA</ModalHeader>
        <ModalBody>
          {/* Details Section */}
          <div className={styles.details}>
            <div className="flex justify-between">
              <strong>Client Name:</strong> <span>{question}</span>
            </div>
            <div className="flex justify-between">
              <strong> Order Code:</strong> <span>{question}</span>
            </div>
            <div className="flex justify-between">
              <strong>Rate:</strong> <span>{question}</span>
            </div>

            <div>
              <strong> Comment:</strong>{" "}
              <p className={styles.description}>{answer}</p>
            </div>
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

export default ReviewDetailsModal;
