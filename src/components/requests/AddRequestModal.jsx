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
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import axios from "axios";
import { estimatedHours } from "@/data/data";

const AddRequestModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    title: "test",
    description: "",
    payment_type: "hourly_rate",
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
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([{ id: "", name: "" }]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `https://backend.instahandi.com/api/public/services`
        );
        console.log(response);

        setServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    const fetchClients = async () => {
      try {
        const response = await getData(`/clients`);
        console.log(response);
        response.data?.map((value) => {
          setClients((prev) => [
            ...prev,
            {
              id: value.id,
              name: value.user?.first_name + " " + value.user?.last_name,
            },
          ]);
        });

        // setServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
    fetchClients();
  }, []);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedPhotos = [...formData.images];
      updatedPhotos[index] = file;
      setFormData((prev) => ({ ...prev, images: updatedPhotos }));
    }
  };

  const handleRemoveImage = (index) => {
    const updatedPhotos = [...formData.images];
    updatedPhotos[index] = null;
    setFormData((prev) => ({ ...prev, images: updatedPhotos }));
  };
  // console.log(services);
  // console.log(clients);
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, video: file }));
    }
  };
  const uploadAdditionalPhotos = async (serviceId) => {
    const photoData = new FormData();
    formData.images.forEach((photo, index) => {
      if (photo) {
        photoData.append(`additional_images[${index}]`, photo);
      }
    });

    try {
      await postData(`/service-requests/${serviceId}/upload-images`, photoData);
      toast.success("Photos uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload photos:", error);
      toast.error("Failed to upload photos.");
    }
  };
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

  const handleMainImageUpload = (image) => {
    const updatedPhotos = [...formData.images];
    updatedPhotos[index] = null;
    setFormData((prev) => ({ ...prev, images: updatedPhotos }));
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
        <ModalHeader className={styles.modalHeader}>
          Add Request Service
        </ModalHeader>
        <ModalBody>
          <Select
            label="Service Category"
            placeholder="Select Service"
            variant="bordered"
            // className="min-w-[200px]"
            fullWidth
            radius="sm"
            classNames={{
              mainWrapper: "bg-white rounded-lg",
            }}
            labelPlacement="outside"
            onChange={(e) =>
              setFormData({ ...formData, service_id: e.target.value })
            }
          >
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Client Name"
            placeholder="Select Client"
            variant="bordered"
            // className="min-w-[200px]"
            fullWidth
            radius="sm"
            classNames={{
              mainWrapper: "bg-white rounded-lg",
            }}
            labelPlacement="outside"
            onChange={(e) =>
              setFormData({ ...formData, client_id: e.target.value })
            }
          >
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </Select>
          <DatePicker
            className=" custom-input"
            variant="bordered"
            // size="lg"

            radius="sm"
            placeholder="mm/dd/yyyy"
            labelPlacement="outside"
            label="Service start Date"
            onChange={(e) => setFormData({ ...formData, start_date: e })}
          />
          <DatePicker
            className=" custom-input"
            variant="bordered"
            // size="lg"

            radius="sm"
            placeholder="mm/dd/yyyy"
            labelPlacement="outside"
            label="Desired Completion Date"
            onChange={(e) => setFormData({ ...formData, completion_date: e })}
          />
          <Select
            label="Payment type"
            placeholder="Select Payment type"
            labelPlacement="outside"
            // className="min-w-[200px]"
            fullWidth
            radius="sm"
            classNames={{
              mainWrapper: "bg-white rounded-lg",
            }}
            variant="bordered"
            value={formData.payment_type}
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
              {" "}
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
                label="Estimated Hourly"
                placeholder="Select Estimated Hourly"
                labelPlacement="outside"
                // className="min-w-[200px]"
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
                {estimatedHours.map((value) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  );
                })}
                {/* <SelectItem key="1" value="1-2">
                  1-2
                </SelectItem> */}
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
          {/* Image Upload Section */}
          <p className={styles.sectionTitle}>Main Services Photos</p>
          <small className={styles.sectionSubtitle}>
            Maximum image size is 10MB
          </small>
          {/* Main Image */}
          {/* <p>Main Service Photo</p>
          <div className={styles.uploadBoxTow}>
            {formData.main_image ? (
              <>
                <img
                  src={URL.createObjectURL(formData.main_image)}
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
          </div> */}

          {/* <Tabs aria-label="Upload Options" color="primary">
            <Tab key="photo" title="Upload Photo"> */}
          <div className={styles.imageGrid}>
            {formData.images.map((photo, index) => (
              <div key={index} className={styles.uploadBox}>
                {photo ? (
                  <>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Uploaded"
                      className={styles.uploadedImage}
                    />
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </>
                ) : (
                  <>
                    <label
                      htmlFor={`upload-${index}`}
                      className={styles.uploadLabel}
                    >
                      <FaUpload size={20} />
                      Upload Photo
                    </label>
                    <input
                      id={`upload-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className={styles.hiddenInput}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
          {/* </Tab>
            <Tab key="video" title="Upload Video">
              <div className={styles.videoUpload}>
                <label htmlFor="video-upload" className={styles.uploadLabel}>
                  <FaUpload size={20} />
                  {formData.video ? "Change Video" : "Upload Video"}
                </label>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className={styles.hiddenInput}
                />
              </div>
            </Tab>
          </Tabs> */}
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

export default AddRequestModal;
