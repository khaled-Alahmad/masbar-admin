import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Divider,
  Image,
} from "@nextui-org/react";
import { FaUpload, FaTrashAlt, FaPlus } from "react-icons/fa";
import styles from "@/assets/css/components/ServiceCategories.module.css";
import { deleteData, getData, putData } from "@/utils/apiHelper";
import toast from "react-hot-toast";
import { currentlyLang, languageKeys } from "@/utils/lang";
import { phoneCode, statusClients } from "@/data/data";
import StarRating from "../ui/StarRating";
import EditDocumentModal from "./EditDocumentModal";
import AddDocumentModal from "./AddDocumentModal";
import AddReviewModal from "./AddReviewModal";
import EditReviewModal from "./EditReviewModal";
import AddProviderServiceModal from "./AddProviderServiceModal";
import EditProviderServiceModal from "./EditProviderServiceModal";
import AddProviderServicePricesModal from "./AddProviderServicePricesModal";
import EditProviderServicePricesModal from "./EditProviderServicePricesModal";

const EditProviderModal = ({ isOpen, onClose, itemId, refreshData }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_code: "",
    phone: "",
    password: "",
    status: "",
    picture: null,
    documents: [],
    reviews: [],
    provider_services: [],
    gender: "male",
    existingPicture: null,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editDocument, setEditDocument] = useState(false);
  const [addDocument, setAddDocument] = useState(false);
  const [addReview, setAddReview] = useState(false);
  const [addProviderService, setAddProviderService] = useState(false);
  const [editProviderService, setEditProviderService] = useState(false);

  const [addProviderServicePrice, setAddProviderServicePrice] = useState(false);
  const [editProviderServicePrice, setEditProviderServicePrice] =
    useState(false);

  const [editReview, setEditReview] = useState(false);

  // Fetch existing data for the selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      if (
        isOpen ||
        editDocument ||
        addDocument ||
        addReview ||
        editReview ||
        addProviderService ||
        editProviderService ||
        addProviderServicePrice ||
        editProviderServicePrice
      ) {
        setLoading(false);
      } else {
        setLoading(true);
      }
      try {
        const response = await getData(`/admin/providers/${itemId}`);
        if (response.success) {
          const service = response.data;
          setFormData({
            first_name: service.user.first_name,
            last_name: service.user.last_name,
            email: service.user.email,
            phone_code: service.user.phone_code,
            phone: service.user.phone,
            gender: service.user.gender,
            status: service.user.status,
            documents: service.documents,
            reviews: service.reviews,
            provider_services: service.provider_services,
            picture: null,
            existingPicture: service.user.avatar || null, // Set existing image URL
          });
        }
      } catch (error) {
        console.error("Failed to load service data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchServiceData();
  }, [
    isOpen,
    itemId,
    editDocument,
    addDocument,
    addReview,
    editReview,
    addProviderService,
    editProviderService,
    addProviderServicePrice,
    editProviderServicePrice,
  ]);

  // Handle Input Change for Text Fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Input Change for Multi-Language Name
  const handleNameChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleDeleteDocument = async (attributeId) => {
    try {
      await deleteData(`/admin/provider-documents/${attributeId}`);
      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.filter((attr) => attr.id !== attributeId),
      }));
      toast.success("item deleted!");
    } catch (error) {
      toast.error("Failed to delete attribute.");
    }
  };
  const handleDeleteReview = async (attributeId) => {
    try {
      await deleteData(`/admin/service-request-reviews/${attributeId}`);
      setFormData((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((attr) => attr.id !== attributeId),
      }));
      toast.success("item deleted!");
    } catch (error) {
      toast.error("Failed to delete attribute.");
    }
  };
  const handleDeleteProvider = async (attributeId) => {
    try {
      await deleteData(`/admin/provider-services/${attributeId}`);
      setFormData((prev) => ({
        ...prev,
        provider_services: prev.provider_services.filter(
          (attr) => attr.id !== attributeId
        ),
      }));
      toast.success("item deleted!");
    } catch (error) {
      toast.error("Failed to delete attribute.");
    }
  };
  const handleDeleteProviderPrice = async (attributeId) => {
    try {
      await deleteData(`/admin/provider-service-prices/${attributeId}`);

      setFormData((prev) => ({
        ...prev,
        provider_services: prev.provider_services.map((service) => ({
          ...service,
          providerServicePrices: service.providerServicePrices
            ? service.providerServicePrices.filter(
                (attr) => attr.id !== attributeId
              )
            : [],
        })),
      }));

      toast.success("Item deleted!");
    } catch (error) {
      toast.error("Failed to delete attribute.");
    }
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

  // Submit Updated Data
  const handleSubmit = async () => {
    const data = new FormData();

    data.append("user[first_name]", formData.first_name);
    data.append("user[last_name]", formData.last_name);
    data.append("user[email]", formData.email);
    data.append("user[password]", formData.password);
    data.append("user[status]", formData.status);
    data.append("user[gender]", formData.gender);

    data.append("user[phone]", formData.phone);
    data.append("user[phone_code]", formData.phone_code);

    if (formData.picture) data.append("user[avatar]", formData.picture);
    console.log("Data to be sent:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await putData(`/admin/providers/${itemId}`, data);
      if (response.success) {
        toast.success(response.message);
        refreshData();
        onClose();
      } else {
        toast.error("Failed to update service.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message);
    }
  };
  if (loading || !itemId || !formData.first_name) {
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
      size="5xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>Edit Provider</ModalHeader>
        <ModalBody>
          <Input
            label={`First Name `}
            placeholder={`Enter first name `}
            labelPlacement="outside"
            required
            fullWidth
            variant="bordered"
            value={formData.first_name || ""}
            onChange={(e) => handleNameChange("first_name", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Last Name `}
            placeholder={`Enter last name `}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.last_name || ""}
            onChange={(e) => handleNameChange("last_name", e.target.value)}
            className={styles.inputField}
          />
          <Input
            label={`Email`}
            placeholder={`Enter email`}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.email || ""}
            onChange={(e) => handleNameChange("email", e.target.value)}
            className={styles.inputField}
          />
          <RadioGroup
            label="Gender"
            value={formData.gender}
            onValueChange={(value) => handleNameChange("gender", value)} // Pass `value` correctly
          >
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </RadioGroup>
          {/* <Input
            label={`Password`}
            placeholder={`Enter Password`}
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.password || ""}
            onChange={(e) => handleNameChange("password", e.target.value)}
            className={styles.inputField}
          /> */}
          <Input
            label={`Phone`}
            placeholder={`Enter Phone`}
            startContent={
              <Select
                variant="underlined"
                size="md"
                selectedKeys={new Set([String(formData.phone_code)])}
                className="max-w-[100px]"
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    phone_code: selectedOption.target.value,
                  })
                }
              >
                {phoneCode.map((value) => {
                  return (
                    <SelectItem key={value.code} value={value.code}>
                      {value.code}
                    </SelectItem>
                  );
                })}
              </Select>
            }
            labelPlacement="outside"
            fullWidth
            variant="bordered"
            value={formData.phone || ""}
            onChange={(e) => handleNameChange("phone", e.target.value)}
            className={styles.inputField}
          />
          <Select
            // options={phoneCode.map((service) => ({
            //   value: service.code,
            //   label: service.code,
            // }))}
            label="Status"
            labelPlacement="outside"
            placeholder="Status"
            variant="bordered"
            selectedKeys={new Set([String(formData.status)])}
            size="md"
            // className="max-w-[100px]"
            onChange={(selectedOption) =>
              setFormData({
                ...formData,
                status: selectedOption.target.value,
              })
            }
          >
            {statusClients.map((value) => {
              return (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              );
            })}
          </Select>
          {/* new edits  */}

          {formData.documents && (
            <>
              <Divider className="my-4" />
              <div>
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold mb-4">Documents</h4>
                  <Button
                    color="primary"
                    radius="sm"
                    onClick={() => {
                      setSelectedItem(formData.documents[0]);
                      setAddDocument(true);
                    }}
                    className={styles.addButton}
                    startContent={<FaPlus />}
                  >
                    Add Document
                  </Button>
                  {/* <span>Add New</span> */}
                </div>
                {formData.documents.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 border-1 rounded-lg py-2 px-4 mt-4"
                    >
                      <div className="flex flex-1 justify-between p-4">
                        <p>
                          {/* {" "} */}
                          <span className="text-strong"> Name:</span>{" "}
                          {item.name || "N/A"}
                        </p>
                        <p>
                          {/* {" "} */}
                          <span className="text-strong">Status:</span>{" "}
                          {item.status || "N/A"}
                        </p>
                        <a
                          href={item.path}
                          target="_blank"
                          // onClick={() => handleDetailsClientClick(client?.id)} // Ensure this is correct
                          className=" text-blue-700 underline color-primary cursor-pointer"
                        >
                          Show
                        </a>
                        <div className="flex gap-4 cursor-pointer">
                          <Image
                            src="/images/icons/edit.svg"
                            className={styles.icon}
                            onClick={() => {
                              setSelectedItem(item);
                              setEditDocument(true);
                            }}
                          />
                          <Image
                            src="/images/icons/trash.svg"
                            onClick={() => handleDeleteDocument(item.id)}
                            className={styles.icon}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* <Divider className="my-4" /> */}
            </>
          )}

          {formData.reviews && (
            <>
              <Divider className="my-4" />
              <div>
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold mb-4">Reviews</h4>
                  {/* <Button
                    color="primary"
                    radius="sm"
                    onClick={() => {
                      setSelectedItem(formData.documents[0]);
                      setAddReview(true);
                    }}
                    className={styles.addButton}
                    startContent={<FaPlus />}
                  >
                    Add Review
                  </Button> */}
                </div>
                {formData.reviews.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 border-1 rounded-lg py-2 px-4"
                    >
                      <div className="flex flex-1 justify-between p-4">
                        <p>
                          <span className="text-strong"> Review:</span>{" "}
                          {item.review || "N/A"}
                        </p>
                        <div className="flex justify-center items-center align-middle">
                          <span className="text-strong">Rate:</span>{" "}
                          <StarRating rating={item.rate} />
                        </div>
                        <p>
                          <span className="text-strong"> Client Name : </span>
                          {item.client.user.first_name +
                            " " +
                            item.client.user.last_name || "N/A"}
                        </p>
                        <div className="flex gap-4 cursor-pointer">
                          <Image
                            src="/images/icons/edit.svg"
                            className={styles.icon}
                            onClick={() => {
                              setSelectedItem(item);
                              setEditReview(true);
                            }}
                          />
                          <Image
                            src="/images/icons/trash.svg"
                            onClick={() => handleDeleteReview(item.id)}
                            className={styles.icon}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {Array.isArray(formData.provider_services) &&
            formData.provider_services.length > 0 && (
              <>
                <Divider className="my-4" />
                <div className="">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold mb-4">Provider Services</h4>
                    <Button
                      color="primary"
                      radius="sm"
                      onClick={() => {
                        setSelectedItem(formData.provider_services[0]);
                        setAddProviderService(true);
                      }}
                      className={styles.addButton}
                      startContent={<FaPlus />}
                    >
                      Add Provider Service
                    </Button>
                  </div>
                  {formData.provider_services?.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className=" border-1 border-gray-300 shadow-lg flex flex-col gap-2 p-2 mt-4 rounded-lg"
                      >
                        <div className="flex justify-end align-middle items-center cursor-pointer gap-2">
                          <Image
                            src="/images/icons/trash.svg"
                            onClick={() => handleDeleteProvider(item.id)}
                            className={styles.icon}
                          />
                          <Image
                            src="/images/icons/edit.svg"
                            className={`${styles.icon} cursor-pointer`}
                            onClick={() => {
                              setSelectedItem(item);
                              setEditProviderService(true);
                            }}
                          />
                          <Button
                            color="primary"
                            radius="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setAddProviderServicePrice(true);
                            }}
                            className={styles.addButton}
                            startContent={<FaPlus />}
                          >
                            Add Provider Price
                          </Button>
                        </div>
                        <div className="flex gap-4 justify-between">
                          <p className="text-strong">active:</p>{" "}
                          <span>{item.active ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-strong">status:</p>{" "}
                          <span>
                            {item.status === "approved" ? (
                              <>
                                <span className="bg-green-100 text-green-500 rounded-lg p-1">
                                  {item.status}
                                </span>{" "}
                              </>
                            ) : item.status === "in_review" ? (
                              <>
                                <span className="bg-orange-100 text-orange-500 rounded-lg p-1">
                                  In Review
                                </span>{" "}
                              </>
                            ) : item.status === "stoped" ? (
                              <>
                                <span className="bg-slate-100 text-slate-500 rounded-lg p-1">
                                  {item.status}
                                </span>{" "}
                              </>
                            ) : item.status === "rejected" ? (
                              <>
                                <span className="bg-red-100 text-red-500 rounded-lg p-1">
                                  {item.status}
                                </span>{" "}
                              </>
                            ) : (
                              <></>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-strong">Cancellation:</p>{" "}
                          <span>{item.cancellation_fee ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-strong">Cancellation Amount:</p>{" "}
                          <span>{item.cancellation_fee_amount}</span>
                        </div>
                        {item.providerServicePrices.map((value, id) => {
                          return (
                            <div
                              key={id}
                              className="grid grid-cols-12 mt-4 gap-4 border rounded-lg py-2 px-4"
                            >
                              <div className="flex col-span-12 justify-end align-middle items-center cursor-pointer gap-2">
                                <Image
                                  src="/images/icons/trash.svg"
                                  onClick={() =>
                                    handleDeleteProviderPrice(value.id)
                                  }
                                  className={styles.icon}
                                />
                                <Image
                                  src="/images/icons/edit.svg"
                                  className={`${styles.icon} cursor-pointer`}
                                  onClick={() => {
                                    setSelectedItem(value);
                                    setEditProviderServicePrice(true);
                                  }}
                                />
                              </div>
                              <div className="col-span-12  p-4 grid grid-cols-3 gap-6">
                                <p>
                                  <span className="font-semibold">
                                    Service Type:
                                  </span>{" "}
                                  {item.service_type.name[currentlyLang] ||
                                    "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Fixed Price:
                                  </span>{" "}
                                  {value.fixed_price || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Hourly Price:
                                  </span>{" "}
                                  {value.hourly_price || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Emirate:
                                  </span>{" "}
                                  {value.emirate?.name[currentlyLang] || "N/A"}
                                </p>
                                <p>
                                  <span className="font-semibold">Status:</span>{" "}
                                  {value.status == "active" ? (
                                    <>
                                      {" "}
                                      <span className="bg-green-100 text-green-500 rounded-lg p-1">
                                        {" "}
                                        {value.status}
                                      </span>
                                    </>
                                  ) : (
                                    (
                                      <>
                                        <span className="bg-red-100 text-red-500 rounded-lg p-1">
                                          {" "}
                                          {value.status}
                                        </span>
                                      </>
                                    ) || "N/A"
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {/* <Divider className="my-4" /> */}
                </div>
              </>
            )}
          {/* *************** */}
          {/* Main Image Upload */}
          <p>Provider Avatar</p>
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
                    setFormData((prev) => ({ ...prev, existingPicture: null }))
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
          <EditDocumentModal
            itemId={selectedItem && selectedItem.id}
            providerId={selectedItem && selectedItem.provider_id}
            refreshData={refreshData}
            isOpen={editDocument}
            onClose={() => setEditDocument(false)}
          />
          <AddDocumentModal
            itemId={selectedItem && selectedItem.id}
            providerId={selectedItem && selectedItem.provider_id}
            refreshData={refreshData}
            isOpen={addDocument}
            onClose={() => setAddDocument(false)}
          />
          <AddReviewModal
            itemId={selectedItem && selectedItem.id}
            providerId={selectedItem && selectedItem.provider_id}
            refreshData={refreshData}
            isOpen={addReview}
            onClose={() => setAddReview(false)}
          />
          <AddProviderServiceModal
            itemId={selectedItem && selectedItem.id}
            providerId={selectedItem && selectedItem.provider_id}
            refreshData={refreshData}
            isOpen={addProviderService}
            onClose={() => setAddProviderService(false)}
          />
          <EditProviderServiceModal
            itemId={selectedItem && selectedItem.id}
            providerId={selectedItem && selectedItem.provider_id}
            refreshData={refreshData}
            isOpen={editProviderService}
            onClose={() => setEditProviderService(false)}
          />
          <AddProviderServicePricesModal
            itemId={selectedItem && selectedItem.id}
            providerId={selectedItem && selectedItem.provider_id}
            refreshData={refreshData}
            isOpen={addProviderServicePrice}
            onClose={() => setAddProviderServicePrice(false)}
          />
          <EditProviderServicePricesModal
            itemId={selectedItem && selectedItem.id}
            providerId={selectedItem && selectedItem.provider_id}
            refreshData={refreshData}
            isOpen={editProviderServicePrice}
            onClose={() => setEditProviderServicePrice(false)}
          />
          <EditReviewModal
            itemId={selectedItem && selectedItem.id}
            providerId={selectedItem && selectedItem.provider_id}
            refreshData={refreshData}
            isOpen={editReview}
            onClose={() => setEditReview(false)}
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

export default EditProviderModal;
