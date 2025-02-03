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
  Divider,
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
  console.log("Service:", services);

  const {
    name,
    description,
    job_name,
    image,
    is_active,
    category,
    service_attributes,
    online_meeting,
  } = services;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setServices(null); // Ensure services are reset on close
        onClose(); // Call the provided onClose function
      }}
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
          <div className="grid grid-cols-2 gap-6">
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
                <span
                  className={
                    is_active
                      ? "bg-primary rounded-lg text-white p-1"
                      : "bg-red-300 rounded-lg text-white p-1"
                  }
                >
                  {is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <strong>Online Meeting:</strong>
                <span
                  className={
                    online_meeting
                      ? "bg-primary rounded-lg text-white p-1"
                      : "bg-red-400 rounded-lg text-white p-1"
                  }
                >
                  {online_meeting ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
          {/* Category */}
          <Divider />
          <div className="">
            <h3 className="font-bold">Category</h3>
            <div className="flex justify-between items-center">
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
          <Divider />

          {/* Service Attributes */}
          <div className="">
            <h4 className="font-bold mb-4">Service Attributes</h4>
            {service_attributes.length === 0 ? (
              <>
                <p> Not Exist Any Attributes</p>
              </>
            ) : (
              service_attributes.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Attribute
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Values
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {service_attributes
                        .filter((attr) => attr.values.length > 0)
                        .map((attr) => (
                          <tr key={attr.id} className="border-b">
                            {/* Attribute Name */}
                            <td className="border border-gray-300 px-4 py-2">
                              {attr.name[languageKeys[0]]}
                            </td>

                            {/* Attribute Values */}
                            <td className="border border-gray-300 px-4 py-2">
                              {attr.values.length > 0 ? (
                                <ul>
                                  {attr.values.map((val) => (
                                    <li
                                      key={val.id}
                                      className="inline-block mr-2"
                                    >
                                      <strong>
                                        {val.value[languageKeys[0]]}
                                      </strong>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-400">
                                  No values available
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
          <Divider />

          {/* Image */}
          <div>
            <h4 className="font-bold">Image</h4>
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
