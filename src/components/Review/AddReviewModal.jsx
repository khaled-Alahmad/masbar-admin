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
} from "@nextui-org/react";
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";

const AddReviewModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    order_id: "",
    client_id: "",
    review: "",
    rating: 0, // default rating is 0
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const [services, setServices] = useState([{ id: "", code: "" }]);
  const [clients, setClients] = useState([{ id: "", name: "" }]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getData(`/orders`);
        // console.log(response);
        response.data?.map((value) => {
          setServices((prev) => [
            ...prev,
            {
              id: value.id,
              code: value.code,
            },
          ]);
        });
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    const fetchClients = async () => {
      try {
        const response = await getData(`/clients`);
        // console.log(response);
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
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("rating", formData.rating);
    data.append("review", formData.review);
    data.append("client_id", formData.client_id);
    data.append("order_id", formData.order_id);

    try {
      const response = await postData("/vendor-reviews", data);
      if (response.success) {
        toast.success("vendor reviews added successfully!");

        refreshData();
        onClose();
      } else {
        toast.error("Failed to add vendor reviews.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormData({
        question: "",
        answer: "",
      });
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
        <ModalHeader className={styles.modalHeader}>Add Review</ModalHeader>
        <ModalBody>
          {/* Name and Description */}
          <Select
            label="Job"
            placeholder="Select Job"
            variant="bordered"
            // className="min-w-[200px]"
            fullWidth
            radius="sm"
            classNames={{
              mainWrapper: "bg-white rounded-lg",
            }}
            labelPlacement="outside"
            onChange={(e) =>
              setFormData({ ...formData, order_id: e.target.value })
            }
          >
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.code}
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
          <Input
            label="Rating"
            placeholder="Enter rating"
            labelPlacement="outside"
            fullWidth
            type="number"
            min={0}
            variant="bordered"
            value={formData.rating}
            onChange={(e) => handleInputChange("rating", e.target.value)}
            className={styles.inputField}
          />
          <Textarea
            label="Review"
            placeholder="Enter Review..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.review}
            onChange={(e) => handleInputChange("review", e.target.value)}
            className={styles.textareaField}
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

export default AddReviewModal;
