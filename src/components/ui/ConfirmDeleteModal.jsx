"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import styles from "@/assets/css/components/ConfirmDeleteModal.module.css";

const ConfirmDeleteModal = ({ isOpen, text, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" backdrop="blur">
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>
          <span className={styles.emoji}>😓</span>
        </ModalHeader>
        <ModalBody>
          <p className={styles.confirmText}>{text || ""}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            className={styles.deleteButton}
            onPress={onDelete}
            color="danger"
          >
            Delete
          </Button>
          <Button
            className={styles.cancelButton}
            onPress={onClose}
            variant="light"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
