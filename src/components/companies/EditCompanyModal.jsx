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
import { phoneCode, statusClients, typeProvider } from "@/data/data";

const EditCompanyModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    // name: {},
    owner_id: null,
    name: "",
    address: "",
    type: "citizen",
    commission: "",
    phone_number: "",
    providers_count: "",
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/providers`);
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
        const response = await getData(`/admin/companies/${itemId}`);
        if (response.success) {
          const service = response.data;
          setFormData({
            owner_id: service.owner.user_id,
            name: service.name,
            address: service.address,
            type: service.type,

            commission: service.commission,
            phone_number: service.phone_number,
            providers_count: service.providers_count,
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

    data.append("owner_id", formData.owner_id);
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("type", formData.type);
    data.append("commission", formData.commission);
    data.append("phone_number", formData.phone_number);
    data.append("providers_count", formData.providers_count);

    if (formData.picture) data.append("image_path", formData.picture);
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(`/admin/companies/${itemId}`, data);
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
        <ModalHeader>Edit Company</ModalHeader>
        <ModalBody>
          <div>
            <label className="mb-2">Provider Name</label>
            <Select
              label="Provider Name"
              placeholder="Client Name"
              variant="bordered"
              options={services}
              value={
                services.find((item) => item.value === formData.owner_id) ||
                null
              }
              // fullWidth

              labelPlacement="outside"
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  owner_id: selectedOption.value,
                })
              }
            />
          </div>
          <div>
            <label className="mb-2">Type</label>
            <Select
              label="Type"
              placeholder="Select Type"
              variant="bordered"
              options={typeProvider}
              // fullWidth
              value={
                typeProvider.find((item) => item.value === formData.type) ||
                null
              }
              labelPlacement="outside"
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  type: selectedOption.value,
                })
              }
            />
          </div>
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
            label={`Phone Number`}
            placeholder={`Enter Phone Number`}
            labelPlacement="outside"
            required
            fullWidth
            variant="bordered"
            value={formData.phone_number || ""}
            onChange={(e) => handleNameChange("phone_number", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Commission`}
            placeholder={`Enter Commission`}
            labelPlacement="outside"
            required
            fullWidth
            variant="bordered"
            type="number"
            min={0}
            value={formData.commission || ""}
            onChange={(e) => handleNameChange("commission", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Providers Count`}
            placeholder={`Enter Providers Count`}
            labelPlacement="outside"
            type="number"
            min={0}
            required
            fullWidth
            variant="bordered"
            value={formData.providers_count || ""}
            onChange={(e) =>
              handleNameChange("providers_count", e.target.value)
            }
            className={styles.inputField}
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

export default EditCompanyModal;
