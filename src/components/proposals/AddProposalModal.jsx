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

const AddProposalModal = ({
  isOpen,
  onClose,
  refreshData,
  service_request_id = null,
}) => {
  const [formData, setFormData] = useState({
    service_request_id: service_request_id != null ? service_request_id : "",
    vendor_id: "",
    payment_type: "hourly_rate",
    estimated_hours: "",
    price: "",
    message: "",
  });
  const [services, setServices] = useState([{ id: "", name: "" }]);
  const [clients, setClients] = useState([{ id: "", name: "" }]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getData(`/service-requests`);
        console.log(response.data);
        response.data?.map((value) => {
          setServices((prev) => [
            ...prev,
            {
              id: value.id,
              name: value.code,
            },
          ]);
        });
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    const fetchClients = async () => {
      try {
        const response = await getData(`/vendors`);
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
  // console.log(services);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("formData:", formData);

    const data = new FormData();
    data.append("message", formData.message);
    data.append("service_request_id", formData.service_request_id);

    data.append("payment_type", formData.payment_type);
    data.append("estimated_hours", formData.estimated_hours);
    data.append("price", formData.price);
    data.append("vendor_id", formData.vendor_id);

    try {
      const response = await postData("/proposals", data);
      if (response.success) {
        toast.success("proposals added successfully!");

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
        message: "",

        payment_type: "",
        estimated_hours: "",
        price: "",
        service_request_id: "",
        vendor_id: "",
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
        <ModalHeader className={styles.modalHeader}>Add Proposal</ModalHeader>
        <ModalBody>
          <Select
            label="Service Request"
            isDisabled={service_request_id != null ? true : false}
            placeholder="Select Service"
            selectedKeys={new Set([String(formData.service_request_id)])}

            variant="bordered"
            // className="min-w-[200px]"
            fullWidth
            radius="sm"
            classNames={{
              mainWrapper: "bg-white rounded-lg",
            }}
            labelPlacement="outside"
            onChange={(e) =>
              setFormData({ ...formData, service_request_id: e.target.value })
            }
          >
            {services.map((service, index) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Vendor Name"
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
              setFormData({ ...formData, vendor_id: e.target.value })
            }
          >
            {clients.map((client, index) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </Select>

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
                {estimatedHours.map((value, index) => {
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
            label="Message"
            placeholder="Message..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
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

export default AddProposalModal;
