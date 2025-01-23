import React, { useEffect, useState } from "react";
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
import { getData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { languageKeys } from "@/utils/lang";

const EditServiceModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    name: {},
    order: "",
    picture: null, // Holds either a URL (existing image) or a File (new image)
    existingPicture: null, // Separate field for the existing image URL
  });

  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/service-categories/${itemId}`);
        if (response.success) {
          const service = response.data;
          setFormData({
            name: service.name || {},
            order: service.sort || "",
            picture: null, // Initially null for new uploads
            existingPicture: service.picture || null, // Set existing image URL
          });
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId]);

  // Handle Input Change for Text Fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Input Change for Multi-Language Name
  const handleNameChange = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        [lang]: value,
      },
    }));
  };

  // Handle Main Image Upload
  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        picture: file, // Set the new file
        existingPicture: null, // Remove reference to the existing image
      }));
    }
  };

  // Submit Updated Data
  const handleSubmit = async () => {
    const data = new FormData();

    // Add multi-language name fields
    Object.entries(formData.name).forEach(([lang, value]) => {
      data.append(`name[${lang}]`, value);
    });

    // Add sort order
    data.append("sort", formData.order);

    // Add picture if a new file is uploaded
    if (formData.picture) {
      data.append("picture", formData.picture);
    }

    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(
        `/admin/service-categories/${itemId}`,
        data
      );
      if (response.success) {
        toast.success("Service updated successfully!");
        refreshData();
        onClose();
      } else {
        toast.error("Failed to update service.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong.");
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
        <ModalHeader>Edit Service</ModalHeader>
        <ModalBody>
          {/* Multi-Language Name Fields */}
          {languageKeys.map((lang) => (
            <Input
              key={lang}
              label={`Name (${lang.toUpperCase()})`}
              placeholder={`Enter name in ${lang.toUpperCase()}`}
              labelPlacement="outside"
              fullWidth
              variant="bordered"
              defaultValue={formData.name[lang] || ""}
              onChange={(e) => handleNameChange(lang, e.target.value)}
              className={styles.inputField}
            />
          ))}

          {/* Sort Order */}
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

          {/* Main Image Upload */}
          <p>Main Service Photo</p>
          <div className={styles.uploadBox}>
            {formData.picture ? (
              // If a new file is uploaded
              <>
                <img
                  src={URL.createObjectURL(formData.picture)}
                  alt="Uploaded Main"
                  className={styles.uploadedImage}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, picture: null }))
                  }
                >
                  <FaTrashAlt />
                </button>
              </>
            ) : formData.existingPicture ? (
              // If an existing image URL is available
              <>
                <img
                  src={formData.existingPicture}
                  alt="Existing Main"
                  className={styles.uploadedImage}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, existingPicture: null }))
                  }
                >
                  <FaTrashAlt />
                </button>
              </>
            ) : (
              // If no image is available
              <>
                <label htmlFor="main_image" className={styles.uploadLabel}>
                  <FaUpload size={20} /> Upload Main Photo
                </label>
                <input
                  id="main_image"
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
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditServiceModal;
