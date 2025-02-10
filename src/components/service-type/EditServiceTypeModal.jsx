import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Divider,
} from "@nextui-org/react";
import Select from "react-select";

import { FaUpload, FaTrashAlt } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { deleteData, getData, postData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";
import AddAddAttributeModal from "./AddAddAttributeModal";
import AddAddAttributeValueModal from "./AddAddAttributeModal";

const EditServiceTypeModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: {},
    description: {},
    job_name: {},
    online_meeting: true,
    is_active: true,
    category_id: null,
    service_attributes: [],

    order: "",
    picture: null,
    existingPicture: null, // Separate field for the existing image URL
  });
  const [loading, setLoading] = useState(false);
  const [showValuesOpen, setShowValuesOpen] = useState({});
  const [addAttribute, setAddAttribute] = useState(false);
  const [addAttributeValue, setAddAttributeValue] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/service-categories`);
        console.log(response);
        setServices(response.data || []);

        // setServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    // fetchServices();
    fetchClients();
  }, []);

  // Fetch existing data for the selected service
  useEffect(() => {
    // if (!isOpen || addAttribute) return;

    const fetchServiceData = async () => {
      if (isOpen || addAttribute || addAttributeValue) {
        setLoading(false);
      } else {
        setLoading(true);
      }
      try {
        const response = await getData(`/admin/service-types/${itemId}`);
        if (response.success) {
          const service = response.data;
          console.log(service);

          setFormData({
            id: service.id,
            name: service.name || {},
            description: service.description || {},
            job_name: service.job_name || {},
            online_meeting: service.online_meeting,
            is_active: service.is_active,
            order: "",
            category_id: service.category?.id,
            picture: null,
            service_attributes: service.service_attributes || [],
            service_attributes_values: service.service_attributes?.values || [],
            existingPicture: service.image || null, // Set existing image URL
          });
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchServiceData();
  }, [isOpen, itemId, addAttribute, addAttributeValue]);
  // Fetch existing service data
  // useEffect(() => {
  //   const fetchServiceData = async () => {
  //     if (formData.id != null) {
  //       setLoading(false);
  //     } else {
  //       setLoading(true);
  //     }
  //     try {
  //       const response = await getData(`/admin/service-types/${itemId}`);
  //       if (response.success) {
  //         setFormData(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load service data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (isOpen) fetchServiceData();
  // }, [isOpen, itemId]);

  // Handle Input Changes
  const handleInputChange = (lang, value, path) => {
    setFormData((prev) => ({
      ...prev,
      [path]: {
        ...prev[path],
        [lang]: value,
      },
    }));
  };

  // Toggle Values Visibility
  const toggleValuesVisibility = (attributeId) => {
    setShowValuesOpen((prev) => ({
      ...prev,
      [attributeId]: !prev[attributeId],
    }));
  };

  const handleEditValue = async (attributeId, valueId, lang, value) => {
    // Update UI first (Optimistic UI)
    setFormData((prev) => ({
      ...prev,
      service_attributes: prev.service_attributes.map((attr) =>
        attr.id === attributeId
          ? {
              ...attr,
              values: attr.values.map((val) =>
                val.id === valueId
                  ? { ...val, value: { ...val.value, [lang]: value } }
                  : val
              ),
            }
          : attr
      ),
    }));

    // Send API request to update the backend
    try {
      const response = await putData(
        `/admin/service-attribute-values/${valueId}`,
        {
          value: {
            ...formData.service_attributes
              .find((attr) => attr.id === attributeId)
              .values.find((val) => val.id === valueId).value,
            [lang]: value,
          },
        }
      );

      if (response.success) {
        // toast.success("Value updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update value.");
    }
  };
  const handleEditAttribute = async (attributeId, lang, value) => {
    // Update UI first (Optimistic UI)
    setFormData((prev) => ({
      ...prev,
      service_attributes: prev.service_attributes.map((attr) =>
        attr.id === attributeId
          ? { ...attr, name: { ...attr.name, [lang]: value } }
          : attr
      ),
    }));

    // Send API request to update the backend
    try {
      const response = await putData(
        `/admin/service-attributes/${attributeId}`,
        {
          name: {
            ...formData.service_attributes.find(
              (attr) => attr.id === attributeId
            ).name,
            [lang]: value,
          },
        }
      );

      if (response.success) {
        // toast.success("Attribute updated successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update attribute."
      );
    }
  };

  // Delete Attribute
  const handleDeleteAttribute = async (attributeId) => {
    try {
      await deleteData(`/admin/service-attributes/${attributeId}`);
      setFormData((prev) => ({
        ...prev,
        service_attributes: prev.service_attributes.filter(
          (attr) => attr.id !== attributeId
        ),
      }));
      toast.success("Attribute deleted!");
    } catch (error) {
      toast.error("Failed to delete attribute.");
    }
  };

  const handleAddValue = async (attributeId) => {
    setSelectedAttribute(attributeId);
    setAddAttributeValue(true);
  };

  // Delete Value
  const handleDeleteValue = async (attributeId, valueId) => {
    try {
      await deleteData(`/admin/service-attribute-values/${valueId}`);
      setFormData((prev) => ({
        ...prev,
        service_attributes: prev.service_attributes.map((attr) =>
          attr.id === attributeId
            ? {
                ...attr,
                values: attr.values.filter((val) => val.id !== valueId),
              }
            : attr
        ),
      }));
      toast.success("Value deleted!");
    } catch (error) {
      toast.error("Failed to delete value.");
    }
  };

  // Handle Input Change for Multi-Language Name
  const handleNameChange = (lang, value, path) => {
    const keys = path.split("."); // Split the path into keys
    setFormData((prev) => {
      const updatedData = { ...prev };
      let currentLevel = updatedData;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          // Set the value on the final key
          currentLevel[key] = value;
        } else {
          // Ensure the intermediate object exists
          const nextKeyIsArray = !isNaN(keys[index + 1]);
          if (!currentLevel[key]) {
            currentLevel[key] = nextKeyIsArray ? [] : {};
          }
          currentLevel = currentLevel[key];
        }
      });

      return updatedData;
    });
  };

  // Handle Main Image Upload
  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        picture: file, // Set the new file
        existingPicture: null, // Remove reference to the existing image
      }));
    }
  };
  const handleSubmit = async () => {
    // Validate attributes and values
    console.log(formData);

    const serviceTypeData = new FormData();
    Object.entries(formData.name).forEach(([lang, value]) => {
      serviceTypeData.append(`name[${lang}]`, value);
    });
    Object.entries(formData.description).forEach(([lang, value]) => {
      serviceTypeData.append(`description[${lang}]`, value);
    });
    Object.entries(formData.job_name).forEach(([lang, value]) => {
      serviceTypeData.append(`job_name[${lang}]`, value);
    });
    serviceTypeData.append("is_active", formData.is_active ? 1 : 0);
    serviceTypeData.append("online_meeting", formData.online_meeting ? 1 : 0);
    serviceTypeData.append(
      "category_id",
      formData.category_id || formData.category?.id
    );

    if (formData.picture) {
      serviceTypeData.append("image", formData.picture);
    }

    try {
      // Step 1: Submit service type data
      const serviceTypeResponse = await putData(
        `/admin/service-types/${itemId}`,
        serviceTypeData
      );

      if (!serviceTypeResponse.success) {
        toast.error("Failed to update service type.");
        return;
      }

      toast.success("Service updated successfully!");
      refreshData();
      onClose();
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred while updating the service.");
    }
  };

  if (loading) {
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
      size="full"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Edit Service</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="mb-2">Service Category</label>
              <Select
                label="Service Category"
                placeholder="Select Service"
                variant="bordered"
                options={services.map((service) => ({
                  value: service.id,
                  label: service.name[currentlyLang],
                }))}
                // fullWidth
                labelPlacement="outside"
                defaultValue={services
                  .map((service) => ({
                    value: service.id,
                    label: service.name[currentlyLang],
                  }))
                  .find((option) => option.value == formData.category_id)}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    category_id: selectedOption.value,
                  })
                }
              />
            </div>

            {languageKeys.map((lang) => (
              <Input
                key={lang}
                label={`Name (${lang.toUpperCase()})`}
                placeholder={`Enter name in ${lang.toUpperCase()}`}
                labelPlacement="outside"
                // fullWidth
                variant="bordered"
                defaultValue={(formData.name && formData.name[lang]) || ""} // Fallback to empty string
                onChange={(e) => handleNameChange(lang, e.target.value, "name")}
                className={styles.inputField}
              />
            ))}
            {languageKeys.map((lang) => (
              <Input
                key={lang}
                label={`Description (${lang.toUpperCase()})`}
                placeholder={`Enter Description in ${lang.toUpperCase()}`}
                labelPlacement="outside"
                // fullWidth
                variant="bordered"
                defaultValue={
                  (formData.description && formData.description[lang]) || ""
                } // Fallback to empty string
                onChange={(e) =>
                  handleNameChange(lang, e.target.value, "description")
                }
                className={styles.inputField}
              />
            ))}
            {languageKeys.map((lang) => (
              <Input
                key={lang}
                label={`Job Name (${lang.toUpperCase()})`}
                placeholder={`Enter Job Name in ${lang.toUpperCase()}`}
                labelPlacement="outside"
                // fullWidth
                variant="bordered"
                defaultValue={
                  (formData.job_name && formData.job_name[lang]) || ""
                } // Fallback to empty string
                onChange={(e) =>
                  handleNameChange(lang, e.target.value, "job_name")
                }
                className={styles.inputField}
              />
            ))}
            <div className="flex gap-4">
              <Switch
                size="md"
                color="primary"
                defaultSelected={formData.is_active} // Individual row selection
                onChange={() =>
                  setFormData({ ...formData, is_active: !formData.is_active })
                }
              >
                Status
              </Switch>
              <Switch
                size="md"
                color="primary"
                defaultSelected={formData.online_meeting} // Individual row selection
                onChange={() =>
                  setFormData({
                    ...formData,
                    online_meeting: !formData.online_meeting,
                  })
                }
              >
                Online
              </Switch>
            </div>

            {/* <Input
            label="Order"
            placeholder="Enter Order..."
            fullWidth
            labelPlacement="outside"
            variant="bordered"
            value={formData.order}
            onChange={(e) => handleInputChange("order", e.target.value)}
            className={styles.textareaField}
          /> */}

            {/* Image Upload Section */}
            {/* <p className={styles.sectionTitle}>Main Services Photos</p>
            <small className={styles.sectionSubtitle}>
              Maximum image size is 10MB
            </small> */}
          </div>
          {/* Main Image Upload */}
          <Divider className="my-4" />
          <h1 className="font-bold">Service Attributes</h1>
          {formData.service_attributes.length > 0 ? (
            <>
              {formData.service_attributes.map((item) => (
                <div
                  key={item.id}
                  className="border-gray-500 border rounded-lg p-4"
                >
                  <div
                    className={`grid grid-cols-${
                      languageKeys.length + 1
                    } gap-4 mb-2`}
                  >
                    {languageKeys.map((lang) => (
                      <Input
                        key={`${item.id}-${lang}`}
                        label={`Attribute Name (${lang.toUpperCase()})`}
                        placeholder={`Enter name in ${lang.toUpperCase()}`}
                        variant="bordered"
                        labelPlacement="outside"
                        value={item.name[lang] || ""}
                        onChange={(e) =>
                          handleEditAttribute(item.id, lang, e.target.value)
                        }
                      />
                    ))}
                    <div className="flex gap-4 justify-stretch align-bottom items-end">
                      <Button
                        color="danger"
                        variant="shadow"
                        onPress={() => handleDeleteAttribute(item.id)}
                      >
                        Delete Attribute
                      </Button>
                      <Button
                        color="primary"
                        variant="shadow"
                        onPress={() => toggleValuesVisibility(item.id)}
                      >
                        {showValuesOpen[item.id]
                          ? "Hide Values"
                          : "Show Values"}
                      </Button>
                    </div>
                  </div>

                  {showValuesOpen[item.id] && (
                    <div>
                      <Divider className="my-4" />

                      <h2 className="mb-4 font-bold">Values:</h2>
                      {item.values && item.values.length > 0 ? (
                        item.values.map((value) => (
                          <div
                            key={value.id}
                            className={`grid grid-cols-${
                              languageKeys.length + 1
                            } gap-4 mb-2`}
                          >
                            {languageKeys.map((lang) => (
                              <Input
                                key={`${value.id}-${lang}`}
                                label={`Value (${lang.toUpperCase()})`}
                                placeholder={`Enter value in ${lang.toUpperCase()}`}
                                variant="bordered"
                                labelPlacement="outside"
                                value={value.value[lang] || ""}
                                onChange={(e) =>
                                  handleEditValue(
                                    item.id,
                                    value.id,
                                    lang,
                                    e.target.value
                                  )
                                }
                              />
                            ))}
                            <div className="flex gap-4 justify-stretch align-bottom items-end">
                              <Button
                                color="danger"
                                variant="shadow"
                                onPress={() =>
                                  handleDeleteValue(item.id, value.id)
                                }
                              >
                                Delete Value
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <p className="my-2"> not exist values</p>
                        </>
                      )}
                      <Button
                        onPress={() => handleAddValue(item.id)}
                        color="success"
                        className={styles.addAttr}
                      >
                        Add Value
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p>No attributes available.</p>
          )}

          <button
            onClick={() => setAddAttribute(true)}
            color="success"
            className={styles.addAttr}
          >
            Add Attribute
          </button>
          <div>
            <p>Main Service Photo</p>
            <div className={styles.uploadBox}>
              {formData.picture ? (
                // If a new file is uploaded
                <>
                  <img
                    src={URL.createObjectURL(formData.picture)}
                    alt="Uploaded Main"
                    className={styles.uploadedImage}
                  />
                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, picture: null }))
                    }
                  >
                    <FaTrashAlt />
                  </button>
                </>
              ) : formData.existingPicture ? (
                // If an existing image URL is available
                <>
                  <img
                    src={formData.existingPicture}
                    alt="Existing Main"
                    className={styles.uploadedImage}
                  />
                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        existingPicture: null,
                      }))
                    }
                  >
                    <FaTrashAlt />
                  </button>
                </>
              ) : (
                // If no image is available
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
        <AddAddAttributeModal
          itemId={formData.id}
          refreshData={refreshData}
          isOpen={addAttribute}
          onClose={() => setAddAttribute(false)}
        />
        <AddAddAttributeValueModal
          itemId={selectedAttribute}
          refreshData={refreshData}
          isOpen={addAttributeValue}
          onClose={() => setAddAttributeValue(false)}
        />
      </ModalContent>
    </Modal>
  );
};

export default EditServiceTypeModal;
