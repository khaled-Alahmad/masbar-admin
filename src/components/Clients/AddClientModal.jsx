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
  Textarea,
} from "@nextui-org/react";
import { FaTrashAlt, FaUpload } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";

const AddClientModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "male",
    phone: "",
    streetAddress: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    profilePhoto: null,
    additionalImages: [],
  });

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
  const handleMainImageUpload = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: null }));
  };
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("user[first_name]", formData.firstName);
    data.append("user[last_name]", formData.lastName);
    data.append("user[email]", formData.email);
    data.append("user[password]", formData.password);
    data.append("user[gender]", formData.gender);
    data.append("user[phone]", formData.phone);
    data.append("street_address", formData.streetAddress);
    data.append("country", formData.country);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("zip_code", formData.zipCode);

    if (formData.profilePhoto) {
      data.append("user[profile_photo]", formData.profilePhoto);
    }

    formData.additionalImages.forEach((image, index) => {
      data.append(`additional_images[${index}]`, image);
    });

    try {
      const response = await postData("/clients", data);
      if (response.success) {
        toast.success("Client added successfully!");
        refreshData();
        onClose();
      } else {
        toast.error("Failed to add client.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "male",
        phone: "",
        streetAddress: "",
        country: "",
        city: "",
        state: "",
        zipCode: "",
        profilePhoto: null,
        additionalImages: [],
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
        <ModalHeader className={styles.modalHeader}>Add Client</ModalHeader>
        <ModalBody>
          {/* User Details */}
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
            label="Password"
            placeholder="Enter Password"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
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
          <div className={styles.uploadBoxTow}>
            {formData.profilePhoto ? (
              <>
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt="Main"
                  className={styles.uploadedImage}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() => handleMainImageUpload()}
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

          {/* Additional Images with Preview */}
          <div className={styles.additionalImagesContainer}>
            {formData.additionalImages.map((image, index) => (
              <div key={index} className={styles.uploadBox}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Additional ${index}`}
                  className={styles.uploadedImage}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      additionalImages: prev.additionalImages.filter(
                        (_, i) => i !== index
                      ),
                    }))
                  }
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
            Add Client
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddClientModal;
