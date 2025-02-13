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
  Switch,
} from "@nextui-org/react";
import styles from "@/assets/css/components/ServiceRequestDetails.module.css";
import { getData } from "@/utils/apiHelper";
import Image from "next/image";
import { languageKeys } from "@/utils/lang";
import Link from "next/link";

const FreeServiceDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/free-services/${itemId}`);
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
        <ModalHeader className={styles.modalHeader}>
          View Free Service
        </ModalHeader>
        <ModalBody>
          {/* Details Section */}
          <div className={styles.details}>
            <div className="flex justify-between">
              <strong>Name:</strong> <span>{services.name}</span>
            </div>
            <div className="flex justify-between">
              <strong>Link:</strong>{" "}
              <span>
                <Link
                  href={services.link_url}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  Click Here
                </Link>
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Visible:</strong>{" "}
              <span>
                {/* <label htmlFor="">Visible</label> */}
                <Switch
                  size="sm"
                  color="primary"
                  isSelected={services.visible} // Individual row selection
                />
              </span>
            </div>

            <div className="flex justify-between">
              <strong>Created At:</strong>{" "}
              <span>
                {new Date(services.created_at).toLocaleString("EN-us")}
              </span>
            </div>
          </div>

          <div>
            <strong>Image</strong>
            {/* <div className={styles.mediaGrid}> */}
            <div className={styles.mediaBo2x}>
              <img
                // priority
                src={services.image_path || "https://placehold.co/400"}
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

export default FreeServiceDetailsModal;
