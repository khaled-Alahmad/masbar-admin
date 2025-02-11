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
import { phoneCode } from "@/data/data";

const AddAdsModal = ({ isOpen, onClose, refreshData }) => {
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

    data.append("user_id", formData.user_id);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    data.append("message", formData.message);
    data.append("status", formData.status);
    data.append("link_url", formData.link_url);

    if (formData.picture) data.append("image_path", formData.picture);

    // Log the data to inspect before sending
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await postData("/admin/ads", data);
      if (response.success) {
        toast.success(response.message);
        refreshData();
        setFormData({
          user_id: null,
          message: "",
          status: "in_review",
          start_date: null,
          end_date: null,
          password: "",
          link_url: "",
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
        <ModalHeader className={styles.modalHeader}>Add Ads</ModalHeader>
        <ModalBody>
          {/* Name Fields for Each Language */}
          {/* {languageKeys.map((lang) => ( */}
          <div>
            {/* <label className="mb-2">Client Name</label> */}
            <Select
              label="Client Name"
              placeholder="Client Name"
              variant="bordered"
              options={services}
              // fullWidth

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
          <DatePicker
            label="Start Date"
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius="md"
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
            variant="bordered"
            size="lg"
            radius="md"
            placeholder="mm/dd/yyyy"
            onChange={(value) => {
              // Parse the selected date to a `CalendarDate` object
              if (value) {
                const parsedDate = parseDate(value.toString());
                setFormData({ ...formData, end_date: parsedDate });
              }
            }}
          />
          {/* Image Upload Section */}
          <p className={styles.sectionTitle}>Ads Image</p>
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

export default AddAdsModal;
