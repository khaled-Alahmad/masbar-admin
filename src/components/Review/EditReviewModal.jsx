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
  SelectItem,
  Select,
} from "@nextui-org/react";
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, putData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";

const EditReviewModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    order_id: "",
    client_id: "",
    review: "",
    rating: 0, // default rating is 0
  });
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/vendor-reviews/${itemId}`);
        if (response.success) {
          const faq = response.data;
          setFormData({
            client_id: faq.client_id,
            order_id: faq.order_id,
            review: faq.review,
            rating: faq.rating,
          });
        }
      } catch (error) {
        console.error("Failed to load fqa data:", error);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId]);

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
      const response = await putData(`/vendor-reviews/${itemId}`, data);
      if (response.success) {
        toast.success("fqa updated successfully!");
        refreshData();
        onClose();
      } else {
        toast.error("Failed to update fqa.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong.");
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
        <ModalHeader>Edit Review</ModalHeader>
        <ModalBody>
          {/* <Select
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
          </Select> */}
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

export default EditReviewModal;
