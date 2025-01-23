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

const AddServiceModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: {},
    order: "",
    picture: null,
  });

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, picture: file }));
    }
  };

  const handleNameChange = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        [lang]: value,
      },
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();

    // Add `name` directly as a JSON object
    Object.entries(formData.name).forEach(([lang, value]) => {
      data.append(`name[${lang}]`, value);
    });
    data.append("order", formData.order);
    if (formData.picture) data.append("picture", formData.picture);

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
      const response = await postData("/admin/service-categories", data);
      if (response.success) {
        toast.success("Service added successfully!");
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
        order: "",
        picture: null,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>Add Service</ModalHeader>
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

          <Input
            label="Order"
            placeholder="Enter Order..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.order}
            onChange={(e) => handleInputChange("order", e.target.value)}
            className={styles.textareaField}
          />

          {/* Image Upload Section */}
          <p className={styles.sectionTitle}>Main Services Photos</p>
          <small className={styles.sectionSubtitle}>
            Maximum image size is 10MB
          </small>
          <p>Main Service Photo</p>
          <div className={styles.uploadBoxTow}>
            {formData.picture ? (
              <>
                <img
                  src={URL.createObjectURL(formData.picture)}
                  alt="Main"
                  className={styles.uploadedImage}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() => handleMainImageUpload(null)}
                >
                  <FaTrashAlt />
                </button>
              </>
            ) : (
              <>
                <label htmlFor="picture" className={styles.uploadLabel}>
                  <FaUpload size={20} /> Upload Main Photo
                </label>
                <input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  className={styles.hiddenInput}
                />
              </>
            )}
          </div>
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

export default AddServiceModal;
