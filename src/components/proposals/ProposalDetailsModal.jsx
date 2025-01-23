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

const ProposalDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [serviceRequest, setServiceRequest] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/proposals/${itemId}`);
        if (response.success) {
          setServiceRequest(response.data);
        }
      } catch (error) {
        console.error("Failed to load proposal:", error);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId]);

  if (!serviceRequest) {
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
    message,
    // description,
    status,
    price,
    // start_date,
    estimated_hours,
    created_at,
    code,
    service_request,
    // location,
    // images,
    vendor,
    payment_type,
  } = serviceRequest;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>View Proposal</ModalHeader>
        <ModalBody>
          {/* Details Section */}
          <div className={styles.details}>
            <div className="flex justify-between">
              <strong>Proposal Code:</strong> <span>{code}</span>
            </div>
            <div className="flex justify-between">
              <strong>Request Code:</strong>{" "}
              <span>{service_request?.code}</span>
            </div>
            <div className="flex justify-between">
              <strong>Vendor Name:</strong>{" "}
              <span>
                {vendor?.user?.first_name + " " + vendor?.user?.last_name}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Date Created :</strong>{" "}
              <span>{new Date(created_at).toLocaleDateString("en-CA")}</span>
            </div>

            <div className="flex justify-between">
              <strong>Payment Type:</strong>{" "}
              <span>
                {payment_type === "flat_rate" ? "Flat Rate" : "Hourly Rate"}
              </span>
            </div>
            {payment_type === "flat_rate" ? (
              <>
                {" "}
                <div className="flex justify-between">
                  <strong>Flat Rate:</strong> <span>${price}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <strong>Hourly Rate:</strong> <span>${price}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Estimated Hours:</strong>{" "}
                  <span>{estimated_hours}</span>
                </div>
              </>
            )}

            <div>
              <strong>Message:</strong>{" "}
              <p className={styles.description}>{message}</p>
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

export default ProposalDetailsModal;
