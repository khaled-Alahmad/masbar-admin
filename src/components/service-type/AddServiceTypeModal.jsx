"use client";
import Select from "react-select";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  // Select,
  // SelectItem,
} from "@nextui-org/react";
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";

const AddServiceTypeModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: {},
    description: {},
    job_name: {},
    online_meeting: true,
    is_active: true,
    order: "",
    category_id: null,
    picture: null,
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/service-categories`);
        console.log(response);
        setServices(response.data || []);

        // setServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    // fetchServices();
    fetchClients();
  }, []);
  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, picture: file }));
    }
  };

  const handleNameChange = (lang, value, attr) => {
    setFormData((prev) => ({
      ...prev,
      [attr]: {
        ...prev[attr],
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
    Object.entries(formData.description).forEach(([lang, value]) => {
      data.append(`description[${lang}]`, value);
    });
    Object.entries(formData.job_name).forEach(([lang, value]) => {
      data.append(`job_name[${lang}]`, value);
    });
    data.append("is_active", formData.is_active === true ? 1 : 0);
    data.append("online_meeting", formData.online_meeting === true ? 1 : 0);
    data.append("category_id", formData.category_id);

    if (formData.picture) data.append("image", formData.picture);

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
      const response = await postData("/admin/service-types", data);
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
  if (!services) {
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
      size="5xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>
          Add Service Type
        </ModalHeader>
        <ModalBody>
          <div className={`grid grid-cols-${languageKeys.length + 1} gap-6`}>
            <div>
              <label className="mb-2">Service Category</label>
              <Select
                label="Service Category"
                placeholder="Select Service"
                variant="bordered"
                options={services.map((service) => ({
                  value: service.id,
                  label: service.name[currentlyLang],
                }))}
                // fullWidth
                labelPlacement="outside"
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    category_id: selectedOption.value,
                  })
                }
              />
            </div>

            {languageKeys.map((lang) => (
              <Input
                key={lang}
                label={`Name (${lang.toUpperCase()})`}
                placeholder={`Enter name in ${lang.toUpperCase()}`}
                labelPlacement="outside"
                // fullWidth
                variant="bordered"
                value={(formData.name && formData.name[lang]) || ""} // Fallback to empty string
                onChange={(e) => handleNameChange(lang, e.target.value, "name")}
                className={styles.inputField}
              />
            ))}
            {languageKeys.map((lang) => (
              <Input
                key={lang}
                label={`Description (${lang.toUpperCase()})`}
                placeholder={`Enter Description in ${lang.toUpperCase()}`}
                labelPlacement="outside"
                // fullWidth
                variant="bordered"
                value={
                  (formData.description && formData.description[lang]) || ""
                } // Fallback to empty string
                onChange={(e) =>
                  handleNameChange(lang, e.target.value, "description")
                }
                className={styles.inputField}
              />
            ))}
            {languageKeys.map((lang) => (
              <Input
                key={lang}
                label={`Job Name (${lang.toUpperCase()})`}
                placeholder={`Enter Job Name in ${lang.toUpperCase()}`}
                labelPlacement="outside"
                // fullWidth
                variant="bordered"
                value={(formData.job_name && formData.job_name[lang]) || ""} // Fallback to empty string
                onChange={(e) =>
                  handleNameChange(lang, e.target.value, "job_name")
                }
                className={styles.inputField}
              />
            ))}
            <div className="flex gap-4">
              <Switch
                size="md"
                color="primary"
                isSelected={formData.is_active} // Individual row selection
                onChange={() =>
                  setFormData({ ...formData, is_active: !formData.is_active })
                }
              >
                Status
              </Switch>
              <Switch
                size="md"
                color="primary"
                isSelected={formData.online_meeting} // Individual row selection
                onChange={() =>
                  setFormData({
                    ...formData,
                    online_meeting: !formData.online_meeting,
                  })
                }
              >
                Online
              </Switch>
            </div>

            {/* <Input
            label="Order"
            placeholder="Enter Order..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.order}
            onChange={(e) => handleInputChange("order", e.target.value)}
            className={styles.textareaField}
          /> */}

            {/* Image Upload Section */}
            {/* <p className={styles.sectionTitle}>Main Services Photos</p>
            <small className={styles.sectionSubtitle}>
              Maximum image size is 10MB
            </small> */}
          </div>
          <div>
            <p>Service Type Photo</p>
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

export default AddServiceTypeModal;
