import React, { useEffect, useState } from "react";
import {
  Modal,
  DatePicker,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import Select from "react-select";

import { parseDate, parseAbsoluteToLocal } from "@internationalized/date";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { languageKeys } from "@/utils/lang";
import { phoneCode, statusClients } from "@/data/data";

const EditFreeServiceModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    name: "",
    visible: false,
    link_url: "",
    picture: null,
    existingPicture: null, // existing picture
  });

  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/free-services/${itemId}`);
        if (response.success) {
          const service = response.data;
          setFormData({
            name: service.name,
            visible: service.visible,
            link_url: service.link_url,
            picture: null,
            existingPicture: service.image_path || null, // Set existing image URL
          });
        }
      } catch (error) {
        console.error("Failed to load service data:", error.message);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId]);

  // Handle Input Change for Text Fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Input Change for Multi-Language Name
  const handleNameChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

    data.append("name", formData.name);
    data.append("visible", formData.visible ? "1" : "0");
    data.append("link_url", formData.link_url);

    if (formData.picture) data.append("image_path", formData.picture);
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(`/admin/free-services/${itemId}`, data);
      if (response.success) {
        toast.success(response.message);
        refreshData();
        onClose();
      } else {
        toast.error("Failed to update service.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message);
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
        <ModalHeader>Edit Free Service</ModalHeader>
        <ModalBody>
          {/* Name Fields for Each Language */}
          {/* {languageKeys.map((lang) => ( */}

          <Input
            label={`Name`}
            placeholder={`Enter Name`}
            labelPlacement="outside"
            required
            fullWidth
            variant="bordered"
            value={formData.name || ""}
            onChange={(e) => handleNameChange("name", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Link Url`}
            placeholder={`Link Url`}
            labelPlacement="outside"
            required
            fullWidth
            type="url"
            variant="bordered"
            value={formData.link_url || ""}
            onChange={(e) => handleNameChange("link_url", e.target.value)}
            className={styles.inputField}
          />
          {/* <div>
            <label htmlFor="">Visible</label> */}
          <Switch
            size="md"
            color="primary"
            isSelected={formData.visible} // Individual row selection
            onChange={() =>
              setFormData({
                ...formData,
                visible: !formData.visible,
              })
            } // Pass the entire row's original data
          >
            Visible
          </Switch>
          {/* </div> */}
          {/* Main Image Upload */}
          <p> image</p>
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

export default EditFreeServiceModal;
