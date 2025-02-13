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
import Select from "react-select";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, postData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";

const AddReviewModal = ({ isOpen, providerId, onClose, refreshData }) => {
  console.log(providerId);

  const [formData, setFormData] = useState({
    review: "",
    rate: 1,
    provider_id: providerId,
    client_id: null,
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/clients`);
        console.log(response);
        setServices(response.data || []);

        // setServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    // fetchServices();
    fetchClients();
  }, []);
  // Handle Input Change for Text Fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit Updated Data
  const handleSubmit = async () => {
    const data = new FormData();

    // Add sort order
    data.append("review", formData.review);
    data.append("rate", formData.rate);

    data.append("provider_id", providerId);
    data.append("client_id", formData.client_id);

    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await postData(`/admin/service-request-reviews`, data);
      if (response.success) {
        toast.success("item added successfully!");
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
  if (!providerId) {
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
        <ModalHeader>Add Review</ModalHeader>
        <ModalBody>
          {/* Multi-Language Name Fields */}

          {/* Sort Order */}
          <div>
            <label className="mb-2">Client Name</label>
            <Select
              label="Service Category"
              placeholder="Select Service"
              variant="bordered"
              options={services.map((service) => ({
                value: service.id,
                label: service.user.first_name + " " + service.user.last_name,
              }))}
              // fullWidth
              labelPlacement="outside"
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  client_id: selectedOption.value,
                })
              }
            />
          </div>

          <Input
            label="Review"
            placeholder="Enter Review..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.review}
            onChange={(e) => handleInputChange("review", e.target.value)}
            className={styles.textareaField}
          />
          <Input
            label="Rate"
            placeholder="Enter Rate..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            type="number"
            min={1}
            max={5}
            value={formData.rate}
            onChange={(e) => handleInputChange("rate", e.target.value)}
            className={styles.textareaField}
          />
          {/* Main Image Upload */}
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

export default AddReviewModal;
