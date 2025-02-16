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
import Link from "next/link";

const CompanyDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/companies/${itemId}`);
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
        <ModalHeader className={styles.modalHeader}>View Company</ModalHeader>
        <ModalBody>
          {/* Details Section */}
          <div className={styles.details}>
            <div className="flex justify-between">
              <strong>Full Name :</strong> <span>{services.name}</span>
            </div>
            <div className="flex justify-between">
              <strong>Address:</strong> <span>{services.address}</span>
            </div>
            <div className="flex justify-between">
              <strong>Type:</strong> <span>{services.type}</span>
            </div>{" "}
            <div className="flex justify-between">
              <strong>Phone Number:</strong>{" "}
              <span>{services.phone_number}</span>
            </div>{" "}
            <div className="flex justify-between">
              <strong>Providers Count:</strong>{" "}
              <span>{services.providers_count}</span>
            </div>
            <div className="flex justify-between">
              <strong>Commission:</strong> <span>{services.commission}</span>
            </div>
            <div className="flex justify-between">
              <strong>Status:</strong>{" "}
              <span
                className={
                  services.status === "approved"
                    ? "bg-green-300 text-white rounded-lg p-1"
                    : services.status === "IN_REVIEW"
                    ? "bg-orange-300 text-white rounded-lg p-1"
                    : "bg-red-300 text-white rounded-lg p-1"
                }
              >
                {services.status === "in_review"
                  ? "In Review"
                  : services.status}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <strong>order:</strong> <span>{sort}</span>
            </div> */}
          </div>

          <div>
            <strong>Attachments</strong>
            <div className={styles.mediaGrid}>
              {services.attachments &&
                services.attachments?.map((item, idx) => {
                  return (
                    <>
                      <div key={idx} className={styles.mediaBo2x}>
                        <img
                          // priority
                          src={item.path || "https://placehold.co/400"}
                          // width={0}
                          // height={0}

                          // style={{
                          //   width: "100%",
                          //   height: "6rem",
                          // }}
                          // objectFit="cover"
                          alt={`Media `}
                        />
                      </div>
                    </>
                  );
                })}
              {services.attachments.LENGTH <= 0 && (
                <>
                  <span>not exist attachments</span>
                </>
              )}
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

export default CompanyDetailsModal;
