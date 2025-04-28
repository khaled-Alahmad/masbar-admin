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
  Switch,
} from "@nextui-org/react";
import Select from "react-select";

import { parseDate } from "@internationalized/date";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { getData, postData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";
import { phoneCode } from "@/data/data";

const AddFreeServiceModal = ({ isOpen, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: {},
    // name: "",
    visible: false,
    link_url: "",
    picture: null,
  });

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
  const handleNameChangeLang = (lang, value, attr) => {
    setFormData((prev) => ({
      ...prev,
      [attr]: {
        ...prev[attr],
        [lang]: value,
      },
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    // data.append("name","test");

    Object.entries(formData.name).forEach(([lang, value]) => {
      data.append(`name[${lang}]`, value);
    });
    
    data.append("visible", formData.visible ? "1" : "0");
    data.append("link_url", formData.link_url);

    if (formData.picture) data.append("image_path", formData.picture);

    // Log the data to inspect before sending
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await postData("/admin/free-services", data);
      if (response.success) {
        toast.success(response.message);

        refreshData();

        setFormData({
          name: {},
          visible: false,
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
  // if (!services) {
  //   return (
  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <ModalContent>
  //         <ModalBody>
  //           <p>Loading...</p>
  //         </ModalBody>
  //       </ModalContent>
  //     </Modal>
  //   );
  // }
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
          Add Free Service
        </ModalHeader>
        <ModalBody>
          {/* Name Fields for Each Language */}
          {/* {languageKeys.map((lang) => ( */}
          {languageKeys.map((lang) => (
            <Input
              key={lang}
              label={`Name (${lang.toUpperCase()})`}
              placeholder={`Enter name in ${lang.toUpperCase()}`}
              labelPlacement="outside"
              // fullWidth
              variant="bordered"
              value={(formData.name && formData.name[lang]) || ""} // Fallback to empty string
              onChange={(e) =>
                handleNameChangeLang(lang, e.target.value, "name")
              }
              className={styles.inputField}
            />
          ))}
          {/* <Input
            label={`Name`}
            placeholder={`Enter Name`}
            labelPlacement="outside"
            required
            fullWidth
            variant="bordered"
            value={formData.name || ""}
            onChange={(e) => handleNameChange("name", e.target.value)}
            className={styles.inputField}
          /> */}
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
          {/* <div className="flex flex-col">
            <label htmlFor="">Visible</label> */}
          <Switch
            size="md"
            color="primary"
            isSelected={formData.visible} // Individual row selection
            onChange={() =>
              setFormData({
                ...formData,
                visible: !formData.visible,
              })
            } // Pass the entire row's original data
          >
            Visible
          </Switch>
          {/* </div> */}
          {/* Image Upload Section */}
          <p className={styles.sectionTitle}> Image</p>
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

export default AddFreeServiceModal;
