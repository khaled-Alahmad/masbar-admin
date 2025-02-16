import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";
import { phoneCode, statusClients } from "@/data/data";
import { default as SelectReact } from "react-select";

const EditClientModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_code: "",
    phone: "",
    password: "",
    status: "",
    picture: null,
    emirate_id: null,
    existingPicture: null,
  });
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
  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/clients/${itemId}`);
        if (response.success) {
          const service = response.data;
          setFormData({
            first_name: service.user.first_name,
            last_name: service.user.last_name,
            email: service.user.email,
            phone_code: service.user.phone_code,
            phone: service.user.phone,
            status: service.user.status,
            picture: null,
            emirate_id: service.emirate_id,
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

    data.append("user[first_name]", formData.first_name);
    data.append("user[last_name]", formData.last_name);
    data.append("user[email]", formData.email);
    data.append("user[password]", formData.password);
    data.append("user[status]", formData.status);
    data.append("user[emirate_id]", formData.emirate_id);

    data.append("user[phone]", formData.phone);
    data.append("user[phone_code]", formData.phone_code);

    if (formData.picture) data.append("user[avatar]", formData.picture);
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(`/admin/clients/${itemId}`, data);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Edit Client</ModalHeader>
        <ModalBody>
          <Input
            label={`First Name `}
            placeholder={`Enter first name `}
            labelPlacement="outside"
            required
            fullWidth
            variant="bordered"
            value={formData.first_name || ""}
            onChange={(e) => handleNameChange("first_name", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Last Name `}
            placeholder={`Enter last name `}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.last_name || ""}
            onChange={(e) => handleNameChange("last_name", e.target.value)}
            className={styles.inputField}
          />
          <div>
            <label className="mb-2">Emirate Name</label>
            <SelectReact
              label="Emirate Name"
              placeholder="Select Emirate Name"
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
                  emirate_id: selectedOption.value,
                })
              }
            />
          </div>
          <Input
            label={`Email`}
            placeholder={`Enter email`}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.email || ""}
            onChange={(e) => handleNameChange("email", e.target.value)}
            className={styles.inputField}
          />
          {/* <Input
            label={`Password`}
            placeholder={`Enter Password`}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.password || ""}
            onChange={(e) => handleNameChange("password", e.target.value)}
            className={styles.inputField}
          /> */}
          <Input
            label={`Phone`}
            placeholder={`Enter Phone`}
            startContent={
              <Select
                variant="underlined"
                size="md"
                selectedKeys={new Set([String(formData.phone_code)])}
                className="max-w-[100px]"
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    phone_code: selectedOption.target.value,
                  })
                }
              >
                {phoneCode.map((value) => {
                  return (
                    <SelectItem key={value.code} value={value.code}>
                      {value.code}
                    </SelectItem>
                  );
                })}
              </Select>
            }
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.phone || ""}
            onChange={(e) => handleNameChange("phone", e.target.value)}
            className={styles.inputField}
          />
          <Select
            // options={phoneCode.map((service) => ({
            //   value: service.code,
            //   label: service.code,
            // }))}
            label="Status"
            labelPlacement="outside"
            placeholder="Status"
            variant="bordered"
            selectedKeys={new Set([String(formData.status)])}
            size="md"
            // className="max-w-[100px]"
            onChange={(selectedOption) =>
              setFormData({
                ...formData,
                status: selectedOption.target.value,
              })
            }
          >
            {statusClients.map((value) => {
              return (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              );
            })}
          </Select>
          {/* Main Image Upload */}
          <p>Client Avatar</p>
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

export default EditClientModal;
