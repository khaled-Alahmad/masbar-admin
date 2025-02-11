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
} from "@nextui-org/react";
import Select from "react-select";

import { parseDate, parseAbsoluteToLocal } from "@internationalized/date";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { languageKeys } from "@/utils/lang";
import { phoneCode, statusClients } from "@/data/data";

const EditAdsModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    // name: {},
    user_id: null,
    message: "",
    status: "in_review",
    start_date: null,
    end_date: null,
    password: "",
    link_url: "",
    picture: null,
    existingPicture: null, // existing picture
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/clients`);
        console.log(response);

        const clientsData = response.data.map((item) => ({
          label: item.user.first_name + " " + item.user.last_name,
          value: item.user.id,
        }));

        setServices(clientsData || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/ads/${itemId}`);
        if (response.success) {
          const service = response.data;
          setFormData({
            user_id: service.user.id,
            message: service.message,
            start_date: service.start_date,
            end_date: service.end_date,
            link_url: service.link_url,
            status: service.status,
            picture: null,
            existingPicture: service.user.avatar || null, // Set existing image URL
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

    data.append("user_id", formData.user_id);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    data.append("message", formData.message);
    data.append("status", formData.status);
    data.append("link_url", formData.link_url);

    if (formData.picture) data.append("image_path", formData.picture);
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(`/admin/ads/${itemId}`, data);
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
  if (!services || !itemId) {
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
        <ModalHeader>Edit Ads</ModalHeader>
        <ModalBody>
          {/* Name Fields for Each Language */}
          {/* {languageKeys.map((lang) => ( */}
          <div>
            <Select
              label="Client Name"
              placeholder="Client Name"
              variant="bordered"
              options={services}
              value={
                services.find((item) => item.value === formData.user_id) || null
              }
              labelPlacement="outside"
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  user_id: selectedOption.value,
                })
              }
            />
          </div>
          <Input
            label={`Message`}
            placeholder={`Enter Message`}
            labelPlacement="outside"
            required
            fullWidth
            variant="bordered"
            value={formData.message || ""}
            onChange={(e) => handleNameChange("message", e.target.value)}
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
          <div>
            <label className="mb-2">Status</label>
            <Select
              label="Status"
              placeholder="Status"
              variant="bordered"
              options={[
                { value: "in_review", label: "In Review" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ]}
              value={
                [
                  { value: "in_review", label: "In Review" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ].find((item) => item.value === formData.status) || null
              }
              labelPlacement="outside"
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  status: selectedOption.value, // Fixed to update 'status'
                })
              }
            />
          </div>
          <DatePicker
            label="Start Date"
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius="md"
            defaultValue={
              formData.start_date
                ? parseAbsoluteToLocal(formData.start_date)
                : null
            }
            placeholder="mm/dd/yyyy"
            onChange={(value) => {
              // Parse the selected date to a `CalendarDate` object
              if (value) {
                const parsedDate = parseDate(value.toString());
                setFormData({ ...formData, start_date: parsedDate });
              }
            }}
          />
          <DatePicker
            label="End Date"
            labelPlacement="outside"
            defaultValue={
              formData.end_date ? parseAbsoluteToLocal(formData.end_date) : null
            }
            variant="bordered"
            size="lg"
            radius="md"
            placeholder="mm/dd/yyyy"
            onChange={(value) => {
              // Parse the selected date to a `CalendarDate` object
              if (value) {
                console.log("value:", value);

                const parsedDate = parseDate(value.toString());
                setFormData({ ...formData, end_date: parsedDate });
              }
            }}
          />
          {/* Main Image Upload */}
          <p>Ads image</p>
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

export default EditAdsModal;
