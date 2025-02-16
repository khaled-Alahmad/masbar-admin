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
  Select,
  SelectItem,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { default as SelectReact } from "react-select";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";
import { phoneCode, typeProvider } from "@/data/data";

const AddProviderModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    // name: {},
    first_name: "",
    last_name: "",
    email: "",
    phone_code: "",
    phone: "",
    gender: "male",
    password: "",
    type: "",
    emirate_id: null,

    picture: null,
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
  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, picture: file }));
    }
  };

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

    data.append("user[first_name]", formData.first_name);
    data.append("user[last_name]", formData.last_name);
    data.append("user[email]", formData.email);
    data.append("user[password]", formData.password);
    data.append("user[phone]", formData.phone);
    data.append("user[gender]", formData.gender);
    data.append("user[emirate_id]", formData.emirate_id);

    data.append("type", formData.type);

    data.append("user[phone_code]", formData.phone_code);

    if (formData.picture) data.append("user[avatar]", formData.picture);

    // Log the data to inspect before sending
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await postData("/admin/providers", data);
      if (response.success) {
        toast.success(response.message);
        refreshData();
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone_code: "",
          phone: "",
          password: "",
          type: "",
          picture: null,
        });
        onClose();
      } else {
        toast.error("Failed to add service.");
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
        <ModalHeader className={styles.modalHeader}>Add Provider</ModalHeader>
        <ModalBody>
          {/* Name Fields for Each Language */}
          {/* {languageKeys.map((lang) => ( */}
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
          <RadioGroup
            label="Gender"
            value={formData.gender}
            onValueChange={(value) => handleNameChange("gender", value)} // Pass `value` correctly
          >
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </RadioGroup>
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
          <Input
            label={`Password`}
            placeholder={`Enter Password`}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.password || ""}
            onChange={(e) => handleNameChange("password", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Phone`}
            placeholder={`Enter Phone`}
            startContent={
              <Select
                // options={phoneCode.map((service) => ({
                //   value: service.code,
                //   label: service.code,
                // }))}
                variant="underlined"
                size="md"
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
          <div>
            <label className="mb-2">Type</label>
            <SelectReact
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
          {/* Image Upload Section */}
          <p className={styles.sectionTitle}>Provider Avatar</p>
          {/* <small className={styles.sectionSubtitle}>
            Maximum image size is 10MB
          </small> */}
          {/* <p>Main Service Photo</p> */}
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

export default AddProviderModal;
