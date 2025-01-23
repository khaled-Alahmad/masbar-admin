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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaTrashAlt, FaUpload } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { postData, getData } from "@/utils/apiHelper";
import toast from "react-hot-toast";

const AddVendorModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "male",
    phone: "",
    streetAddress: "",
    accountType: "Individual",
    yearsExperience: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    profilePhoto: null,
    additionalImages: [],
    serviceIds: [], // Multi-select service IDs
  });

  const [services, setServices] = useState([]); // To store services for the multi-select dropdown

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getData("/services");
        if (response.success) {
          setServices(response.data || []);
        } else {
          toast.error("Failed to fetch services.");
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    if (isOpen) fetchServices();
  }, [isOpen]);

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

  const handleSubmit = async () => {
    console.log(formData);

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
    data.append("account_type", formData.accountType);
    data.append("years_experience", formData.yearsExperience);

    if (formData.profilePhoto) {
      data.append("user[profile_photo]", formData.profilePhoto);
    }

    formData.serviceIds.forEach((serviceId) => {
      data.append("service_ids[]", serviceId);
    });

    formData.additionalImages.forEach((image, index) => {
      data.append(`additional_images[${index}]`, image);
    });

    try {
      const response = await postData("/vendors", data);
      if (response.success) {
        toast.success("Vendor added successfully!");
        refreshData();
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          gender: "male",
          phone: "",
          streetAddress: "",
          accountType: "Individual",
          yearsExperience: "",
          country: "",
          city: "",
          state: "",
          zipCode: "",
          profilePhoto: null,
          additionalImages: [],
          serviceIds: [], // Multi-select service IDs
        });
        onClose();
      } else {
        toast.error("Failed to add vendor.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong. Please try again.");
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
        <ModalHeader className={styles.modalHeader}>Add Vendor</ModalHeader>
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
            placeholder="Enter street Address"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.streetAddress}
            onChange={(e) => handleInputChange("streetAddress", e.target.value)}
            className={styles.inputField}
          />

          <Input
            label="years Experience"
            placeholder="Enter years Experience"
            labelPlacement="outside"
            fullWidth
            type="number"
            variant="bordered"
            value={formData.yearsExperience}
            onChange={(e) =>
              handleInputChange("yearsExperience", e.target.value)
            }
            className={styles.inputField}
          />

          <Input
            label="country"
            placeholder="Enter country"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label="city"
            placeholder="Enter city"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label="state"
            placeholder="Enter state"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label="zip Code"
            placeholder="Enter zip Code"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            className={styles.inputField}
          />
          <Select
            label="Gender"
            placeholder="Select Gender"
            variant="bordered"
            fullWidth
            selectedKeys={new Set([formData.gender])} // Ensure a Set for compatibility
            onSelectionChange={(selected) => {
              const [value] = selected; // Extract the selected value
              setFormData({ ...formData, gender: value }); // Update the gender in formData
            }}
            className={styles.selectField}
          >
            <SelectItem value="male" key={"male"}>
              Male
            </SelectItem>
            <SelectItem value="female" key={"female"}>
              Female
            </SelectItem>
          </Select>

          <Select
            label="Vendor Type"
            placeholder="Select Vendor Type"
            variant="bordered"
            fullWidth
            selectedKeys={new Set([formData.accountType])} // Ensure a Set for compatibility
            onSelectionChange={(selected) => {
              const [value] = selected; // Extract the selected value
              setFormData({ ...formData, accountType: value }); // Update the accountType in formData
            }}
            className={styles.selectField}
          >
            <SelectItem key="Individual" value="Individual">
              Individual
            </SelectItem>
            <SelectItem key="Company" value="Company">
              Company
            </SelectItem>
          </Select>

          {/* Service Selection */}
          <Select
            label="Services"
            placeholder="Select Services"
            variant="bordered"
            selectionMode="multiple"
            fullWidth
            selectedKeys={new Set(formData.serviceIds)}
            onSelectionChange={(selected) =>
              setFormData({ ...formData, serviceIds: Array.from(selected) })
            }
            className={styles.selectField}
          >
            {services.map((service) => (
              <SelectItem key={service.id} value={String(service.id)}>
                {service.name}
              </SelectItem>
            ))}
          </Select>

          {/* Additional Fields and Image Uploads
          <Input
            label="Street Address"
            placeholder="Enter Street Address"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.streetAddress}
            onChange={(e) => handleInputChange("streetAddress", e.target.value)}
            className={styles.inputField}
          /> */}
          <div className={styles.additionalImagesContainer}>
            {formData.profilePhoto ? (
              <div key="profilePhoto" className={styles.uploadBox}>
                <img
                  src={
                    formData.profilePhoto instanceof File
                      ? URL.createObjectURL(formData.profilePhoto)
                      : formData.profilePhoto
                  }
                  alt="Profile Photo"
                  className={styles.uploadedImage}
                />
                <button
                  className={styles.deleteButton}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      profilePhoto: null,
                    }))
                  }
                >
                  <FaTrashAlt />
                </button>
              </div>
            ) : (
              <>
                <div className={styles.uploadBox}>
                  <label htmlFor="profile_photo" className={styles.uploadLabel}>
                    <FaUpload /> Upload Profile Images
                  </label>
                  <input
                    id="profile_photo"
                    type="file"
                    accept="image/*"
                    // multiple
                    onChange={
                      (e) =>
                        // Array.from(e.target.files).forEach((file) =>
                        handleFileUpload("profilePhoto", e.target.files[0])
                      // )
                    }
                    className={styles.hiddenInput}
                  />
                </div>
              </>
            )}
          </div>
          {/* Additional images */}
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
            Add Vendor
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddVendorModal;
