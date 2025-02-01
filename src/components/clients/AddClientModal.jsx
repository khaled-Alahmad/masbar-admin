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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { languageKeys } from "@/utils/lang";
import { phoneCode } from "@/data/data";

const AddClientModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    // name: {},
    first_name: "",
    last_name: "",
    email: "",
    phone_code: "",
    phone: "",
    password: "",

    picture: null,
  });

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, picture: file }));
    }
  };

  const handleNameChange = (att, value) => {
    setFormData((prev) => ({
      ...prev,
      [att]: value,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();

    data.append("user[first_name]", formData.first_name);
    data.append("user[last_name]", formData.last_name);
    data.append("user[email]", formData.email);
    data.append("user[password]", formData.password);
    data.append("user[phone]", formData.phone);
    data.append("user[phone_code]", formData.phone_code);

    if (formData.picture) data.append("user[avatar]", formData.picture);

    // Log the data to inspect before sending
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await postData("/admin/clients", data);
      if (response.success) {
        toast.success(response.message);
        refreshData();
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_code: "",
          phone: "",
          password: "",

          picture: null,
        });
        onClose();
      } else {
        toast.error("Failed to add service.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message);
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
          {/* Name Fields for Each Language */}
          {/* {languageKeys.map((lang) => ( */}
          <Input
            label={`First Name `}
            placeholder={`Enter first name `}
            labelPlacement="outside"
            required
            fullWidth
            variant="bordered"
            value={formData.first_name || ""}
            onChange={(e) => handleNameChange("first_name", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Last Name `}
            placeholder={`Enter last name `}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.last_name || ""}
            onChange={(e) => handleNameChange("last_name", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Email`}
            placeholder={`Enter email`}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.email || ""}
            onChange={(e) => handleNameChange("email", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Password`}
            placeholder={`Enter Password`}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.password || ""}
            onChange={(e) => handleNameChange("password", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Phone`}
            placeholder={`Enter Phone`}
            startContent={
              <Select
                // options={phoneCode.map((service) => ({
                //   value: service.code,
                //   label: service.code,
                // }))}
                variant="underlined"
                size="md"
                className="max-w-[100px]"
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    phone_code: selectedOption.target.value,
                  })
                }
              >
                {phoneCode.map((value) => {
                  return (
                    <SelectItem key={value.code} value={value.code}>
                      {value.code}
                    </SelectItem>
                  );
                })}
              </Select>
            }
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.phone || ""}
            onChange={(e) => handleNameChange("phone", e.target.value)}
            className={styles.inputField}
          />

          {/* Image Upload Section */}
          <p className={styles.sectionTitle}>Client Avatar</p>
          {/* <small className={styles.sectionSubtitle}>
            Maximum image size is 10MB
          </small> */}
          {/* <p>Main Service Photo</p> */}
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

export default AddClientModal;
