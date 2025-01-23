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
} from "@nextui-org/react";
import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, putData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";

const EditFqaModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/faqs/${itemId}`);
        if (response.success) {
          const faq = response.data;
          setFormData({
            question: faq.question,
            answer: faq.answer,
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

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("question", formData.question);
    data.append("answer", formData.answer);

    try {
      const response = await putData(`/faqs/${itemId}`, data);
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
        <ModalHeader>Edit FQA</ModalHeader>
        <ModalBody>
          {/* Service Name */}
          <Input
            label="Question"
            placeholder="Enter Question"
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.question}
            onChange={(e) => handleInputChange("question", e.target.value)}
            className={styles.inputField}
          />
          <Textarea
            label="Answer"
            placeholder="Enter answer..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.answer}
            onChange={(e) => handleInputChange("answer", e.target.value)}
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

export default EditFqaModal;
