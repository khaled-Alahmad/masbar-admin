"use client";
import React, { useState } from "react";
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
import { postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";

const AddFqaModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("question", formData.question);
    data.append("answer", formData.answer);

    try {
      const response = await postData("/faqs", data);
      if (response.success) {
        toast.success("fqa added successfully!");

        refreshData();
        onClose();
      } else {
        toast.error("Failed to add fqa.");
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
        <ModalHeader className={styles.modalHeader}>Add Question</ModalHeader>
        <ModalBody>
          {/* Name and Description */}
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

export default AddFqaModal;
