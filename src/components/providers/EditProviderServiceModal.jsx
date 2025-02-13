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

const EditProviderServiceModal = ({
  isOpen,
  providerId,
  itemId,
  onClose,
  refreshData,
}) => {
  console.log(providerId);

  const [formData, setFormData] = useState({
    active: false,
    status: "",
    cancellation_fee: false,
    cancellation_fee_amount: 0,
    service_type_id: null,
    provider_id: providerId,
  });

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/provider-services/${itemId}`);
        if (response.success) {
          const service = response.data;
          setFormData({
            active: service.active,
            status: service.status,
            cancellation_fee: service.cancellation_fee,
            cancellation_fee_amount: service.cancellation_fee_amount,
            service_type_id: service.service_type_id,
            provider_id: service.provider_id,
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
        const response = await getData(`/admin/service-types`);
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
    data.append("service_type_id", formData.service_type_id);
    data.append("cancellation_fee", formData.cancellation_fee ? "1" : "0");
    data.append("cancellation_fee_amount", formData.cancellation_fee_amount);

    data.append("provider_id", providerId);
    data.append("active", formData.active ? "1" : "0");
    data.append("status", formData.status);

    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(
        `/admin/provider-services/${itemId}`,
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
        <ModalHeader>Add Provider Service</ModalHeader>
        <ModalBody>
          {/* Multi-Language Name Fields */}

          {/* Sort Order */}
          <div>
            <label className="mb-2">Service Type</label>
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
                  service_type_id: selectedOption.value,
                })
              }
            />
          </div>
          <div>
            <label className="mb-2">Active</label>

            <Switch
              size="sm"
              color="primary"
              isSelected={formData.active} // Individual row selection
              onChange={() =>
                setFormData({ ...formData, active: !formData.active })
              } // Pass the entire row's original data
            />
          </div>
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
          <div>
            <label className="mb-2">Cancellation</label>

            <Switch
              size="sm"
              color="primary"
              isSelected={formData.cancellation_fee} // Individual row selection
              onChange={() =>
                setFormData({
                  ...formData,
                  cancellation_fee: !formData.cancellation_fee,
                })
              } // Pass the entire row's original data
            />
          </div>

          <Input
            label="Cancellation Amount"
            placeholder="Enter Cancellation Amount..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            type="number"
            min={0}
            // max={5}
            value={formData.cancellation_fee_amount}
            onChange={(e) =>
              handleInputChange("cancellation_fee_amount", e.target.value)
            }
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

export default EditProviderServiceModal;
