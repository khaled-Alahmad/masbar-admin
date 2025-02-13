"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Divider,
} from "@nextui-org/react";
import styles from "@/assets/css/components/ServiceRequestDetails.module.css";
import { getData } from "@/utils/apiHelper";
import Image from "next/image";
import { currentlyLang, languageKeys } from "@/utils/lang";
import StarRating from "../ui/StarRating";

const ProviderDetailsModal = ({ isOpen, onClose, itemId, onEdit }) => {
  const [services, setServices] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(`/admin/providers/${itemId}`);
        if (response.success) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
      }
    };

    if (isOpen) {
      fetchServiceData();
    } else {
      setServices(null); // Reset services when modal is closed
    }
  }, [isOpen, itemId]);

  if (!services) {
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

  const { user } = services;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setServices(null); // Ensure services are reset on close
        onClose(); // Call the provided onClose function
      }}
      size="3xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>View Provider</ModalHeader>
        <ModalBody>
          {/* Details Section */}
          <div className={`${styles.details}  `}>
            <div className="flex justify-between ">
              <strong>Full Name:</strong>{" "}
              <span>{user.first_name + " " + user.last_name}</span>
            </div>
            <div className="flex justify-between">
              <strong>Phone:</strong> <span>{user.phone_number}</span>
            </div>
            <div className="flex justify-between">
              <strong>Email:</strong> <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <strong>Gender:</strong> <span>{user.gender}</span>
            </div>
            <div className="flex justify-between">
              <strong>Emirate:</strong>{" "}
              <span>{user.emirate.name[currentlyLang]}</span>
            </div>
            {/* new  */}
            <div className="flex justify-between">
              <strong>Completed Orders:</strong>{" "}
              <span className="bg-green-100 text-green-500 p-2 rounded-full">
                {services.completed_orders}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Average Rating:</strong>{" "}
              <span>
                {/* {services.average_rating} */}

                <StarRating rating={services.average_rating} />
              </span>
            </div>
            {/* <div className="flex justify-between">
              <strong>Online:</strong> <span>{services.online}</span>
            </div> */}
            <div className="flex justify-between">
              <strong>Address:</strong> <span>{services.address}</span>
            </div>
            <div className="flex justify-between">
              <strong>Total Reviews:</strong>{" "}
              <span className="bg-green-100 text-green-500 p-2 rounded-full">
                {services.total_reviews}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <strong>Working Now:</strong> <span>{services.working_now}</span>
            </div> */}
            {/* <div className="flex justify-between">
              <strong>Commission:</strong> <span>{services.commission}</span>
            </div> */}
            <div className="flex justify-between">
              <strong>Status:</strong>{" "}
              <span
                className={
                  user.status === "ACTIVE"
                    ? "bg-green-100 text-green-500 rounded-lg p-1"
                    : user.status === "PENDING"
                    ? "bg-orange-100 text-orange-500 rounded-lg p-1"
                    : "bg-red-100 text-red-500 rounded-lg p-1"
                }
              >
                {user.status}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Created At:</strong>{" "}
              <span>{new Date(user.created_at).toLocaleString("EN-us")}</span>
            </div>
            <div className="flex flex-col">
              <strong>Description:</strong> <span>{services.description}</span>
            </div>

            {/* <div className="flex justify-between">
              <strong>order:</strong> <span>{sort}</span>
            </div> */}
          </div>

          {services.documents && (
            <>
              <Divider className="my-4" />
              <div>
                <h4 className="font-bold mb-4">Documents</h4>
                {services.documents.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 border-1 rounded-lg py-2 px-4"
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
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* <Divider className="my-4" /> */}
            </>
          )}

          {services.reviews && (
            <>
              <Divider className="my-4" />
              <div>
                <h4 className="font-bold mb-4">Reviews</h4>
                {services.reviews.map((item, idx) => {
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
                        <p className="flex justify-center items-center align-middle">
                          <span className="text-strong">Rate:</span>{" "}
                          <StarRating rating={item.rate} />
                        </p>
                        <p>
                          <span className="text-strong"> Client Name : </span>
                          {item.client.user.first_name +
                            " " +
                            item.client.user.last_name || "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {services.provider_services && (
            <>
              <Divider className="my-4" />
              <div className="">
                <h4 className="font-bold mb-4">Provider Services</h4>

                {services.provider_services.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className=" border-1 border-gray-300 shadow-lg flex flex-col gap-2 p-2 mt-4 rounded-lg"
                    >
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
                                {item.status}
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
                            <div className="col-span-12  p-4 grid grid-cols-3 gap-6">
                              <p>
                                <span className="font-semibold">
                                  Service Type:
                                </span>{" "}
                                {item.service_type.name[currentlyLang] || "N/A"}
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
                                <span className="font-semibold">Emirate:</span>{" "}
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
          <Divider className="my-4" />
          <div>
            <strong>Avatar</strong>
            {/* <div className={styles.mediaGrid}> */}
            <div className={styles.mediaBox}>
              <img
                // priority
                src={user.avatar || "https://placehold.co/400"}
                // width={0}
                // height={0}
                // objectFit="cover"
                alt={`Media `}
              />
            </div>
            {/* </div> */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Back
          </Button>
          <Button color="primary" onClick={onEdit}>
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProviderDetailsModal;
