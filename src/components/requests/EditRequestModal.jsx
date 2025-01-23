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
  Textarea,
  Tab,
  Tabs,
  Select,
  SelectItem,
  DatePicker,
} from "@nextui-org/react";
import {
  parseDate,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, putData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import axios from "axios";

const EditRequestModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    title: "سس",
    description: "",
    payment_type: "hourly_rate",
    estimated_hours: "",
    price: "",
    service_id: "",
    client_id: "",
    start_date: "",
    completion_date: "",
    street_address: "",
    exstra_address: "",
    country: "",
    city: "",
    state: "",
    zip_code: "",
    images: [], // New photos uploaded by the user
  });

  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `https://backend.instahandi.com/api/public/services`
        );
        // console.log(response);

        setServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);
  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/service-requests/${itemId}`);
        if (response.success) {
          const service = response.data;
          const startDate = service.start_date;

          const completionDate = service.completion_date;

          console.log("Parsed Start Date:", startDate);
          console.log("Parsed Completion Date:", completionDate);
          setFormData({
            title: service.title,
            description: service.description,
            payment_type: service.payment_type,
            estimated_hours: service.estimated_hours,
            price: service.price,
            service_id: service.service_id,
            client_id: service.client.id,
            start_date: startDate, // Set the parsed date
            completion_date: completionDate, // Set the parsed date
            street_address: service.location.street_address,
            exstra_address: service.location.exstra_address,
            country: service.location.country,
            city: service.location.city,
            state: service.location.state,
            zip_code: service.location.zip_code,
            images: service.images || [], // Array of existing photos URLs
          });
          // setDate(service.start_date);
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId]);
  if (formData) {
    console.log(formData);
  }
  if (!services?.length || !formData) {
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

  // Handle Input Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit Updated Data
  const handleSubmit = async () => {
    console.log("formData:", formData);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);

    data.append("payment_type", formData.payment_type);
    data.append("estimated_hours", formData.estimated_hours);
    data.append("price", formData.price);
    data.append("service_id", formData.service_id);
    data.append("client_id", formData.client_id);
    data.append("start_date", formData.start_date);
    data.append("completion_date", formData.completion_date);
    data.append("street_address", formData.street_address);
    data.append("exstra_address", formData.exstra_address);
    data.append("country", formData.country);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("zip_code", formData.zip_code);

    try {
      const response = await postData("/service-requests", data);
      if (response.success) {
        toast.success("Service requests added successfully!");
        const serviceId = response.data.id; // Assuming ID is returned
        await uploadAdditionalPhotos(serviceId);
        refreshData();
        onClose();
      } else {
        toast.error("Failed to add service.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormData({
        title: "test",
        description: "",
        payment_type: "",
        estimated_hours: "",
        price: "",
        service_id: "",
        client_id: "",
        start_date: null,
        completion_date: null,
        street_address: "",
        exstra_address: "",
        country: "",
        city: "",
        state: "",
        zip_code: "",

        images: [null, null, null, null],
      });
    }
  };
  const handleDeletePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      deletedPhotos: [...(prev.deletedPhotos || []), photoId], // Ensure deletedPhotos is iterable
      existing_photos: prev.existing_photos.filter(
        (photo) => photo.id !== photoId
      ),
    }));
  };

  const handleRecoverPhoto = (photoId) => {
    if (formData.deletedPhotos.includes(photoId)) {
      const recoveredPhoto = formData.existing_photos.find(
        (photo) => photo.id === photoId
      );
      setFormData((prev) => ({
        ...prev,
        deletedPhotos: prev.deletedPhotos.filter((id) => id !== photoId),
        existing_photos: [...prev.existing_photos, recoveredPhoto],
      }));
    }
  };

  const uploadAdditionalPhotos = async (serviceId) => {
    const photoData = new FormData();

    // Append only valid image files
    formData.images.forEach((photo, index) => {
      if (photo instanceof File) {
        photoData.append(`additional_images[${index}]`, photo);
      }
    });

    try {
      const response = await postData(
        `/service-requests/${serviceId}/upload-images`,
        photoData
      );
      if (response.success) {
        toast.success("Photos uploaded successfully!");
      } else {
        console.error("Failed to upload photos:", response.errors);
        toast.error("Failed to upload photos.");
      }
    } catch (error) {
      console.error("Failed to upload photos:", error);
      toast.error("Failed to upload photos.");
    }
  };

  // Handle New Image Upload
  const handleNewPhotoUpload = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, file], // Add new file to the images array
      }));
    }
  };

  // Handle Removing Image
  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
        <ModalHeader>Edit Service</ModalHeader>
        <ModalBody>
          <Select
            label="Service Category"
            placeholder="Select Service"
            variant="bordered"
            selectedKeys={new Set([String(formData.service_id)])}
            fullWidth
            radius="sm"
            classNames={{
              mainWrapper: "bg-white rounded-lg",
            }}
            labelPlacement="outside"
            onSelectionChange={(selected) => {
              const [value] = selected;
              setFormData({ ...formData, service_id: Number(value) });
            }}
          >
            {services.map((service) => (
              <SelectItem key={String(service.id)} value={String(service.id)}>
                {service.name}
              </SelectItem>
            ))}
          </Select>

          <DatePicker
            defaultValue={
              formData.start_date
                ? parseAbsoluteToLocal(formData.start_date)
                : null
            }
            className="custom-input"
            variant="bordered"
            radius="sm"
            placeholder="Select a date"
            labelPlacement="outside"
            label="Service Start Date"
            onChange={(value) => {
              if (value) {
                const parsedDate = parseDate(value.toString());
                setFormData({ ...formData, start_date: parsedDate });
              }
            }}
            formatOptions={{
              dateStyle: "medium",
            }}
          />

          <DatePicker
            defaultValue={
              formData.completion_date
                ? parseAbsoluteToLocal(formData.completion_date)
                : null
            }
            className="custom-input"
            variant="bordered"
            radius="sm"
            placeholder="Select a date"
            labelPlacement="outside"
            label="Desired Completion Date"
            onChange={(value) => {
              if (value) {
                const parsedDate = parseDate(value.toString());
                setFormData({ ...formData, completion_date: parsedDate });
              }
            }}
            formatOptions={{
              dateStyle: "medium",
            }}
          />

          <Select
            label="Payment type"
            selectedKeys={new Set([String(formData.payment_type)])}
            placeholder="Select Payment type"
            labelPlacement="outside"
            // className="min-w-[200px]"
            fullWidth
            radius="sm"
            classNames={{
              mainWrapper: "bg-white rounded-lg",
            }}
            variant="bordered"
            onChange={(e) =>
              setFormData({ ...formData, payment_type: e.target.value })
            }
          >
            <SelectItem key="flat_rate" value="flat_rate">
              Flat Rate
            </SelectItem>
            <SelectItem key="hourly_rate" value="hourly_rate">
              Hourly Rate
            </SelectItem>
          </Select>
          {formData.payment_type === "hourly_rate" ? (
            <>
              <Input
                label="Hourly rate"
                placeholder="Hourly rate"
                type="number"
                labelPlacement="outside"
                fullWidth
                variant="bordered"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={styles.inputField}
              />
              <Select
                label="Estimated time"
                placeholder="Select Estimated time"
                labelPlacement="outside"
                value={formData.estimated_hours}
                fullWidth
                radius="sm"
                classNames={{
                  mainWrapper: "bg-white rounded-lg",
                }}
                variant="bordered"
                onChange={(e) =>
                  setFormData({ ...formData, estimated_hours: e.target.value })
                }
              >
                <SelectItem key="1" value="1-2">
                  1-2
                </SelectItem>
                <SelectItem key="2" value="2-3">
                  2-3
                </SelectItem>
              </Select>
            </>
          ) : (
            <>
              <Input
                label="Flat rate"
                placeholder="Flat rate"
                type="number"
                labelPlacement="outside"
                fullWidth
                variant="bordered"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={styles.inputField}
              />
            </>
          )}

          <Textarea
            label="Service description"
            placeholder="Service description..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className={styles.textareaField}
          />
          <Input
            label="Country"
            placeholder="Enter Country"
            // type="number"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label="City"
            placeholder="Enter City"
            // type="number"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label="State"
            placeholder="Enter State"
            // type="number"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label="Address 1"
            placeholder="Address 1"
            // type="number"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.street_address}
            onChange={(e) =>
              handleInputChange("street_address", e.target.value)
            }
            className={styles.inputField}
          />
          <Input
            label="Address 2"
            placeholder="Address 2"
            // type="number"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.exstra_address}
            onChange={(e) =>
              handleInputChange("exstra_address", e.target.value)
            }
            className={styles.inputField}
          />
          <Input
            label="Postal code"
            placeholder="Postal code"
            // type="number"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.zip_code}
            onChange={(e) => handleInputChange("zip_code", e.target.value)}
            className={styles.inputField}
          />

          <p>Photos</p>
          <div className={styles.imageGrid}>
            {formData.images.map((image, index) => (
              <div key={index} className={styles.uploadBox}>
                {/* Check if the image has a 'path' property (existing image from server) */}
                {image?.path ? (
                  <img
                    src={image.path}
                    alt={`Photo ${index + 1}`}
                    className={styles.uploadedImage}
                  />
                ) : image instanceof Blob ? (
                  // For newly uploaded files
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`New Photo`}
                    className={styles.uploadedImage}
                  />
                ) : null}
                <button onClick={() => handleRemovePhoto(index)}>
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            {/* Add new photo input */}
            <div className={styles.uploadBox}>
              <label htmlFor="new-photo-upload" className={styles.uploadLabel}>
                <FaUpload size={20} /> Upload Photo
              </label>
              <input
                id="new-photo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleNewPhotoUpload(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
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

export default EditRequestModal;
