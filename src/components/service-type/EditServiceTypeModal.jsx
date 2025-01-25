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
} from "@nextui-org/react";
import Select from "react-select";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";

const EditServiceTypeModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    name: {},
    description: {},
    job_name: {},
    online_meeting: true,
    is_active: true,
    order: "",
    category_id: null,
    picture: null,
    existingPicture: null, // Separate field for the existing image URL
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      try {
        const response = await getData(`/admin/service-types/${itemId}`);
        if (response.success) {
          const service = response.data;
          console.log(service);

          setFormData({
            name: service.name || {},
            description: service.description || {},
            job_name: service.job_name || {},
            online_meeting: service.online_meeting,
            is_active: service.is_active,
            order: "",
            category_id: service.category?.id,
            picture: null,
            existingPicture: service.image || null, // Set existing image URL
          });
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId]);

  // Handle Input Change for Text Fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Input Change for Multi-Language Name
  const handleNameChange = (lang, value, attr) => {
    setFormData((prev) => ({
      ...prev,
      [attr]: {
        ...prev[attr],
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

    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(
        `/admin/service-types/${itemId}`,
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
  if (!services || loading) {
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
        <ModalHeader>Edit Service</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-3 gap-6">
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
                defaultValue={services
                  .map((service) => ({
                    value: service.id,
                    label: service.name[currentlyLang],
                  }))
                  .find((option) => option.value === formData.category_id)}
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
                defaultValue={(formData.name && formData.name[lang]) || ""} // Fallback to empty string
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
                defaultValue={
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
                defaultValue={
                  (formData.job_name && formData.job_name[lang]) || ""
                } // Fallback to empty string
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
                defaultSelected={formData.is_active} // Individual row selection
                onChange={() =>
                  setFormData({ ...formData, is_active: !formData.is_active })
                }
              >
                Status
              </Switch>
              <Switch
                size="md"
                color="primary"
                defaultSelected={formData.online_meeting} // Individual row selection
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
          {/* Main Image Upload */}
          <div>
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
                      setFormData((prev) => ({
                        ...prev,
                        existingPicture: null,
                      }))
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

export default EditServiceTypeModal;
