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

const ServiceRequestDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [serviceRequest, setServiceRequest] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/service-requests/${itemId}`);
        if (response.success) {
          setServiceRequest(response.data);
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
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
    title,
    description,
    status,
    price,
    start_date,
    estimated_hours,
    service,
    location,
    images,
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
        <ModalHeader className={styles.modalHeader}>
          View Service Request
        </ModalHeader>
        <ModalBody>
          {/* Details Section */}
          <div className={styles.details}>
            <div className="flex justify-between">
              <strong>Title:</strong> <span>{title}</span>
            </div>
            <div className="flex justify-between">
              <strong>Date:</strong>{" "}
              <span>{new Date(start_date).toLocaleDateString("en-CA")}</span>
            </div>
            <div className="flex justify-between">
              <strong>Service Name:</strong> <span>{service?.name || ""}</span>
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

            <div className="flex justify-between">
              <strong>Location:</strong>{" "}
              <span>{location?.street_address || ""}</span>
            </div>
            <div className="flex justify-between">
              <strong>City:</strong> <span>{location?.city || ""}</span>
            </div>
            <div className="flex justify-between">
              <strong>Status:</strong>{" "}
              <Badge
                color={status === "pending" ? "warning" : "success"}
                variant="flat"
              >
                {status}
              </Badge>
            </div>
            <div>
              <strong>Description:</strong>{" "}
              <p className={styles.description}>{description}</p>
            </div>
          </div>

          {images.length > 0 ? (
            <div>
              <h4>Photos & Videos</h4>
              <div className={styles.mediaGrid}>
                {images.map((item, index) => (
                  <div key={index} className={styles.mediaBox}>
                    <Image
                      priority
                      src={item.path}
                      width={0}
                      height={0}
                      objectFit="cover"
                      alt={`Media ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h4>Photos & Videos</h4>
              <p>No media available for this request.</p>
            </div>
          )}
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

export default ServiceRequestDetailsModal;
