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

const EditDocumentModal = ({
  isOpen,
  providerId,
  onClose,
  itemId,
  refreshData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    provider_id: null,
    picture: null, // Holds either a URL (existing image) or a File (new image)
    existingPicture: null, // Separate field for the existing image URL
  });

  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/provider-documents/${itemId}`);
        if (response.success) {
          const service = response.data;
          setFormData({
            name: service.name,
            provider_id: service.provider_id,
            picture: null, // Initially null for new uploads
            existingPicture: service.path || null, // Set existing image URL
          });
        }
      } catch (error) {
        console.error("Failed to load items data:", error);
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

    // Add sort order
    data.append("name", formData.name);
    data.append("status", "Assessing");

    data.append("provider_id", formData.provider_id);

    // Add picture if a new file is uploaded
    if (formData.picture) {
      data.append("path", formData.picture);
    }

    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(
        `/admin/provider-documents/${itemId}`,
        data
      );
      if (response.success) {
        toast.success("item updated successfully!");
        refreshData();
        onClose();
      } else {
        toast.error("Failed to update item.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong.");
    }
  };
  if (!itemId) {
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
      onClose={onClose}
      size="xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Edit Document</ModalHeader>
        <ModalBody>
          {/* Multi-Language Name Fields */}

          {/* Sort Order */}
          <Input
            label="Name"
            placeholder="Enter Name..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={styles.textareaField}
          />

          {/* Main Image Upload */}
          <p>Document File</p>
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

export default EditDocumentModal;
