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
import { postData, getData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";

const EditVendorModal = ({ isOpen, onClose, refreshData, vendorId }) => {
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
    exstra_address: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    profilePhoto: null,
    additionalImages: [],
    serviceIds: [],
  });

  const [services, setServices] = useState([]);

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

    const fetchVendorDetails = async () => {
      if (!vendorId) return;
      try {
        const response = await getData(`/vendors/${vendorId}`);
        if (response.success) {
          const vendor = response.data;
          setFormData({
            firstName: vendor.user?.first_name || "",
            lastName: vendor.user?.last_name || "",
            email: vendor.user?.email || "",
            gender: vendor.user?.gender || "male",
            phone: vendor.user?.phone || "",
            streetAddress: vendor.user?.location?.street_address || "",
            exstra_address: vendor.user?.location?.exstra_address || "",

            accountType: vendor.account_type || "Individual",
            yearsExperience: vendor.years_experience || "",
            country: vendor.user?.location?.country || "",
            city: vendor.user?.location?.city || "",
            state: vendor.user?.location?.state || "",
            zipCode: vendor.user?.location?.zip_code || "",
            profilePhoto: vendor.user?.profile_photo || null,
            additionalImages: vendor.user?.images || [],
            serviceIds:
              vendor.services?.map((service) => String(service.id)) || [],
          });
        } else {
          toast.error("Failed to fetch vendor details.");
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchServices();
    if (isOpen && vendorId) fetchVendorDetails();
  }, [isOpen, vendorId]);

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
    const data = new FormData();
    data.append("user[first_name]", formData.firstName);
    data.append("user[last_name]", formData.lastName);
    data.append("user[email]", formData.email);
    if (formData.password) data.append("user[password]", formData.password);
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
      if (image instanceof File) {
        data.append(`additional_images[${index}]`, image);
      }
    });

    try {
      const response = vendorId
        ? await putData(`/vendors/${vendorId}`, data)
        : await postData("/vendors", data);

      if (response.success) {
        toast.success(
          vendorId
            ? "Vendor updated successfully!"
            : "Vendor added successfully!"
        );
        refreshData();
        onClose();
      } else {
        toast.error("Failed to save vendor.");
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
        <ModalHeader className={styles.modalHeader}>
          {vendorId ? "Edit Vendor" : "Add Vendor"}
        </ModalHeader>
        <ModalBody>
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
            isDisabled
            variant="bordered"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={styles.inputField}
          />
          {/* <Input
            label="Password"
            placeholder="Enter Password"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={styles.inputField}
          /> */}
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
            label="Street Address 1"
            placeholder="Enter street Address"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.streetAddress}
            onChange={(e) => handleInputChange("streetAddress", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label="Street Address 2"
            placeholder="Enter street Address"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.exstra_address}
            onChange={(e) =>
              handleInputChange("exstra_address", e.target.value)
            }
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
                  src={
                    image instanceof File
                      ? URL.createObjectURL(image)
                      : image.path
                  }
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
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {vendorId ? "Save Changes" : "Add Vendor"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditVendorModal;
