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
import { getData, postData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";

const EditProviderServicePricesModal = ({
  isOpen,
  providerId,
  onClose,
  itemId,
  refreshData,
}) => {
  console.log(providerId);

  const [formData, setFormData] = useState({
    emirate_id: null,
    status: "active",
    fixed_price: 0,
    hourly_price: 0,

    provider_service_id: itemId,
  });

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(
          `/admin/provider-service-prices/${itemId}`
        );
        if (response.success) {
          const service = response.data;
          setFormData({
            emirate_id: service.emirate_id,
            status: service.status,
            fixed_price: service.fixed_price,
            hourly_price: service.hourly_price,

            provider_service_id: service.provider_service_id,
          });
        }
      } catch (error) {
        console.error("Failed to load items data:", error);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/emirates`);
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
    data.append("emirate_id", formData.emirate_id);
    data.append("hourly_price", formData.hourly_price);
    data.append("fixed_price", formData.fixed_price);
    data.append("provider_service_id", itemId);
    data.append("status", formData.status);

    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(
        `/admin/provider-service-prices/${itemId}`,
        data
      );
      if (response.success) {
        toast.success("item update successfully!");
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
        <ModalHeader>Edit Provider Service Price</ModalHeader>
        <ModalBody>
          {/* Multi-Language Name Fields */}

          {/* Sort Order */}
          <div>
            <label className="mb-2">Emirate Name</label>
            <Select
              label="Emirate Name"
              placeholder="Select Emirate Name"
              variant="bordered"
              options={services.map((service) => ({
                value: service.id,
                label: service.name[currentlyLang],
              }))}
              defaultValue={services
                .map((service) => ({
                  value: service.id,
                  label: service.name[currentlyLang],
                }))
                .find((option) => option.value == formData.emirate_id)}
              // fullWidth
              labelPlacement="outside"
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  emirate_id: selectedOption.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2">Status</label>
            <Select
              label="Status"
              placeholder="Status"
              variant="bordered"
              options={[
                { value: "inactive", label: "Inactive" },
                { value: "active", label: "Active" },
              ]}
              value={
                [
                  { value: "inactive", label: "Inactive" },
                  { value: "active", label: "Active" },
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

          <Input
            label="Fixed Price"
            placeholder="Enter Fixed Price..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            type="number"
            min={0}
            // max={5}
            value={formData.fixed_price}
            onChange={(e) => handleInputChange("fixed_price", e.target.value)}
            className={styles.textareaField}
          />
          <Input
            label="Hourly Price"
            placeholder="Enter Hourly Price..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            type="number"
            min={0}
            // max={5}
            value={formData.hourly_price}
            onChange={(e) => handleInputChange("hourly_price", e.target.value)}
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

export default EditProviderServicePricesModal;
