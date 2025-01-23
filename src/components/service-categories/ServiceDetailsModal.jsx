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

const ServiceDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/service-categories/${itemId}`);
        if (response.success) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
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

  const { name, sort, picture } = services;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>View Service</ModalHeader>
        <ModalBody>
          {/* Details Section */}
          <div className={styles.details}>
            {languageKeys.map((lang) => (
              <div className="flex justify-between" key={lang}>
                <strong>{`Name (${lang.toUpperCase()})`}:</strong>{" "}
                <span>{name[lang]}</span>
              </div>
            ))}

            <div className="flex justify-between">
              <strong>order:</strong> <span>{sort}</span>
            </div>
          </div>

          <div>
            <h4>Photo Main</h4>
            {/* <div className={styles.mediaGrid}> */}
            <div className={styles.mediaBox}>
              <img
                // priority
                src={picture}
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

export default ServiceDetailsModal;
