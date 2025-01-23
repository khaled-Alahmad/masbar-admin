"use client";
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

const EditClientModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    profilePhoto: null,
    additionalImages: [],
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await getData(`/clients/${itemId}`);
        if (response.success) {
          const client = response.data;
          setFormData({
            firstName: client.user?.first_name,
            lastName: client.user?.last_name,
            email: client.user?.email,
            phone: client.user?.phone,
            streetAddress: client.user?.location?.street_address,
            country: client.user?.location?.country,
            city: client.user?.location?.city,
            state: client.user?.location?.state,
            zipCode: client.user?.location?.zip_code,
            profilePhoto: client.user?.profile_photo,
            additionalImages: client.user?.images || [],
          });
        }
      } catch (error) {
        console.error("Failed to load client data:", error);
      }
    };

    if (isOpen) fetchClientData();
  }, [isOpen, itemId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, file) => {
    if (field === "additionalImages") {
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, file],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleMainImageRemove = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: null }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    console.log("clicked");

    const data = new FormData();
    data.append("user[first_name]", formData.firstName);
    data.append("user[last_name]", formData.lastName);
    data.append("user[email]", formData.email);
    data.append("user[phone]", formData.phone);
    data.append("street_address", formData.streetAddress);
    data.append("country", formData.country);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("zip_code", formData.zipCode);

    if (formData.profilePhoto && typeof formData.profilePhoto !== "string") {
      data.append("user[profile_photo]", formData.profilePhoto);
    }

    formData.additionalImages.forEach((image, index) => {
      if (typeof image !== "string") {
        data.append(`additional_images[${index}]`, image);
      }
    });

    try {
      const response = await putData(`/clients/${itemId}`, data);
      if (response.success) {
        toast.success("Client updated successfully!");
        refreshData();
        onClose();
      } else {
        toast.error("Failed to update client.");
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
        <ModalHeader>Edit Client</ModalHeader>
        <ModalBody>
          {/* Client Details */}
          {/* Client Details */}
          <Input
            label="First Name"
            placeholder="Enter First Name"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="Last Name"
            placeholder="Enter Last Name"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="Email"
            placeholder="Enter Email"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="Phone"
            placeholder="Enter Phone Number"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="Street Address"
            placeholder="Enter Street Address"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.streetAddress}
            onChange={(e) => handleInputChange("streetAddress", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="Country"
            placeholder="Enter Country"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="City"
            placeholder="Enter City"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="State"
            placeholder="Enter State"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="Zip Code"
            placeholder="Enter Zip Code"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            className={styles.inputField}
          />

          {/* Profile Photo */}
          <div className={styles.uploadBoxTow}>
            {formData.profilePhoto ? (
              <>
                <img
                  src={
                    typeof formData.profilePhoto === "string"
                      ? formData.profilePhoto
                      : URL.createObjectURL(formData.profilePhoto)
                  }
                  alt="Profile"
                  className={styles.uploadedImage}
                />
                <button
                  className={styles.deleteButton}
                  onClick={handleMainImageRemove}
                >
                  <FaTrashAlt />
                </button>
              </>
            ) : (
              <>
                <label htmlFor="main_image" className={styles.uploadLabel}>
                  <FaUpload size={20} /> Upload Profile Photo
                </label>
                <input
                  id="main_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload("profilePhoto", e.target.files[0])
                  }
                  className={styles.hiddenInput}
                />
              </>
            )}
          </div>

          <div className={styles.additionalImagesContainer}>
            {formData.additionalImages.map((image, index) => (
              <div key={index} className={styles.uploadBox}>
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : image instanceof File || image instanceof Blob
                      ? URL.createObjectURL(image)
                      : image.path // Fallback to an empty string or a placeholder image
                  }
                  alt={`Additional ${index}`}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() => handleRemoveImage(index)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            <div className={styles.uploadBox}>
              <label htmlFor="additional_images" className={styles.uploadLabel}>
                <FaUpload /> Upload Additional Images
              </label>
              <input
                id="additional_images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  Array.from(e.target.files).forEach((file) =>
                    handleFileUpload("additionalImages", file)
                  )
                }
                className={styles.hiddenInput}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditClientModal;
