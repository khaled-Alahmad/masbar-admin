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
import { languageKeys } from "@/utils/lang";
import Select from "react-select";

const EditReviewModal = ({
  isOpen,
  providerId,
  onClose,
  itemId,
  refreshData,
}) => {
  const [formData, setFormData] = useState({
    review: "",
    rate: 1,
    provider_id: null,
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
  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(
          `/admin/service-request-reviews/${itemId}`
        );
        if (response.success) {
          const service = response.data;
          setFormData({
            review: service.review,
            rate: service.rate,
            provider_id: service.provider?.id,
            client_id: service.client?.id,
          });
        }
        console.log(formData);
      } catch (error) {
        console.error("Failed to load items data:", error);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId]);

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

    data.append("provider_id", formData.provider_id);
    data.append("client_id", formData.client_id);

    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(
        `/admin/provider-documents/${itemId}`,
        data
      );
      if (response.success) {
        toast.success("item updated successfully!");
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
  if (!itemId || !services) {
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
        <ModalHeader>Edit Review</ModalHeader>
        <ModalBody>
          <div>
            <label className="mb-2">Client Name</label>
            <Select
              label="Client Name"
              placeholder="Client Name"
              variant="bordered"
              options={services.map((service) => ({
                value: service.id,
                label: service.user.first_name + " " + service.user.last_name,
              }))}
              defaultValue={services
                .map((service) => ({
                  value: service.id,
                  label: service.user.first_name + " " + service.user.last_name,
                }))
                .find((option) => option.value == formData.client_id)}
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

export default EditReviewModal;
