"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { languageKeys } from "@/utils/lang";

const AddAddAttributeModal = ({ isOpen, itemId, onClose, refreshData }) => {
  console.log("AddAddAttributeModal", itemId);

  const [formData, setFormData] = useState({
    name: {},
    service_attribute_id: itemId,
    // service_type_id: itemId, // service type id
  });

  const handleNameChange = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const data = new FormData();

    // Add `name` directly as a JSON object
    Object.entries(formData.name).forEach(([lang, value]) => {
      data.append(`name[${lang}]`, value);
    });
    data.append("service_type_id", itemId);
    // Log the data to inspect before sending
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      if (key === "name") {
        console.log(`${key}:`, JSON.parse(value)); // Parse the JSON string for better logging
      } else {
        console.log(`${key}:`, value);
      }
    }

    try {
      const response = await postData("/admin/service-attributes", data);
      if (response.success) {
        toast.success("Service Attribute added successfully!");
        refreshData();
        onClose();
      } else {
        toast.error("Failed to add service.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormData({
        name: {},
        // service_type_id: null,
      });
    }
  };

  // if (!itemId) {
  //   return (
  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <ModalContent>
  //         <ModalBody>
  //           <p>Loading...</p>
  //         </ModalBody>
  //       </ModalContent>
  //     </Modal>
  //   );
  // }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>Add Attribute</ModalHeader>
        <ModalBody>
          {/* Name Fields for Each Language */}
          {languageKeys.map((lang) => (
            <Input
              key={lang}
              label={`Name (${lang.toUpperCase()})`}
              placeholder={`Enter name in ${lang.toUpperCase()}`}
              labelPlacement="outside"
              fullWidth
              variant="bordered"
              value={formData.name[lang] || ""}
              onChange={(e) => handleNameChange(lang, e.target.value)}
              className={styles.inputField}
            />
          ))}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAddAttributeModal;
