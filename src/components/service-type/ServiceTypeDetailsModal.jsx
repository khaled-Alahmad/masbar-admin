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

const ServiceTypeDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/service-types/${itemId}`);
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

  const {
    name,
    description,
    job_name,
    image,
    is_active,
    category,
    serviceAttributes,
    online_meeting,
  } = services;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>
          Service Type Details
        </ModalHeader>
        <ModalBody>
          {/* Name, Description, and Job Name */}
          <div className="grid grid-cols-3 gap-6">
            {languageKeys.map((lang) => (
              <div key={lang} className={styles.details}>
                <div className="flex justify-between">
                  <strong>{`Name (${lang.toUpperCase()})`}:</strong>
                  <span>{name[lang]}</span>
                </div>
                <div className="flex justify-between">
                  <strong>{`Description (${lang.toUpperCase()})`}:</strong>
                  <span>{description[lang]}</span>
                </div>
                <div className="flex justify-between">
                  <strong>{`Job Name (${lang.toUpperCase()})`}:</strong>
                  <span>{job_name[lang]}</span>
                </div>
              </div>
            ))}

            {/* Status and Online Meeting */}
            <div className={styles.details}>
              <div className="flex justify-between">
                <strong>Is Active:</strong>
                <span>
                  <Badge color={is_active ? "success" : "error"}>
                    {is_active ? "Active" : "Inactive"}
                  </Badge>
                </span>
              </div>
              <div className="flex justify-between">
                <strong>Online Meeting:</strong>
                <span>
                  <Badge color={online_meeting ? "primary" : "error"}>
                    {online_meeting ? "Enabled" : "Disabled"}
                  </Badge>
                </span>
              </div>
            </div>
          </div>
          {/* Category */}
          <div className="mt-6">
            <h4 className="mb-3">Category</h4>
            <div className="flex justify-between">
              {languageKeys.map((lang) => (
                <div key={lang}>
                  <strong>{`Category Name (${lang.toUpperCase()})`}: </strong>
                  <span>{category.name[lang]}</span>
                </div>
              ))}
              <div className={styles.mediaBox}>
                <Image
                  src={category.picture}
                  alt="Category Image"
                  width={100}
                  height={100}
                  objectFit="cover"
                />
              </div>
            </div>
          </div>

          {/* Service Attributes */}
          <div className="mt-6">
            <h4 className="mb-3">Service Attributes</h4>
            {serviceAttributes.length === 0 ? <> Not Exist Any Attributes</> :serviceAttributes.map((attr) => (
              <div key={attr.id} className="mb-4">
                <h5>{attr.name[languageKeys[0]]}</h5>
                <ul>
                  {attr.values.map((val) => (
                    <li key={val.id}>
                      <strong>{val.value[languageKeys[0]]}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Image */}
          <div>
            <h4>Image</h4>
            <div className={styles.mediaBox}>
              <Image
                src={image}
                alt="Service Image"
                width={200}
                height={200}
                objectFit="cover"
              />
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

export default ServiceTypeDetailsModal;
