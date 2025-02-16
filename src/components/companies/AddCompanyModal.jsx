"use client";
import React, { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  SelectItem,
  DatePicker,
} from "@nextui-org/react";
import Select from "react-select";

import { parseDate } from "@internationalized/date";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";
import { phoneCode, typeProvider } from "@/data/data";

const AddCompanyModal = ({ isOpen, onClose, refreshData }) => {
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

    data.append("owner_id", formData.owner_id);
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("type", formData.type);
    data.append("commission", formData.commission);
    data.append("phone_number", formData.phone_number);
    data.append("providers_count", formData.providers_count);

    // if (formData.picture) data.append("image_path", formData.picture);

    // Log the data to inspect before sending
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await postData("/admin/companies", data);
      if (response.success) {
        toast.success(response.message);
        refreshData();
        setFormData({
          owner_id: null,
          name: "",
          address: "",
          type: "citizen",
          commission: "",
          phone_number: "",
          providers_count: "",
        });
        onClose();
      } else {
        toast.error("Failed to add companies.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message);
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
      size="xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>Add Company</ModalHeader>
        <ModalBody>
          {/* Name Fields for Each Language */}
          {/* {languageKeys.map((lang) => ( */}
          <div>
            <label className="mb-2">Provider Name</label>
            <Select
              label="Provider Name"
              placeholder="Client Name"
              variant="bordered"
              options={services}
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

export default AddCompanyModal;
