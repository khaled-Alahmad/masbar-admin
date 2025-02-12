"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Avatar,
  Badge,
} from "@nextui-org/react";
import styles from "@/assets/css/components/ServiceRequestDetails.module.css";
import { getData } from "@/utils/apiHelper";
import Image from "next/image";
import { currentlyLang } from "@/utils/lang";
import ClientDetailsModal from "../clients/ClientDetailsModal";
import ProviderDetailsModal from "../providers/ProviderDetailsModal";
import ServiceTypeDetailsModal from "../service-type/ServiceTypeDetailsModal";
import EditClientModal from "../clients/EditClientModal";
import EditServiceTypeModal from "../service-type/EditServiceTypeModal";
import EditProviderModal from "../providers/EditProviderModal";
import ServiceRequestDetailsModal from "../service-requests/ServiceRequestDetailsModal";

const ServiceRequestReviewsModal = ({ isOpen, onClose, itemId }) => {
  const [serviceData, setServiceData] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDetailsClientModalOpen, setDetailsClientModalOpen] = useState(false);
  const [isDetailsProviderModalOpen, setDetailsProviderModalOpen] =
    useState(false);

  const [isDetailsServiceModalOpen, setDetailsServiceModalOpen] =
    useState(false);
  const [isDetailsClientEditModalOpen, setDetailsClientEditModalOpen] =
    useState(false);
  const [isDetailsProviderEditModalOpen, setDetailsProviderEditModalOpen] =
    useState(false);

  const [isDetailsServiceEditModalOpen, setDetailsServiceEditModalOpen] =
    useState(false);
  const openToEditClient = () => {
    console.log("id to deleted :"), id;

    // setSelectedItemId(id);
    setDetailsClientModalOpen(false);
    setDetailsClientEditModalOpen(true);
  };
  const openToEditProvider = () => {
    console.log("id to deleted :"), id;

    // setSelectedItemId(id);
    setDetailsProviderModalOpen(false);
    setDetailsProviderEditModalOpen(true);
  };
  const openToEditService = () => {
    console.log("id to deleted :"), id;

    // setSelectedItemId(id);
    setDetailsServiceModalOpen(false);
    setDetailsServiceEditModalOpen(true);
  };
  const handleDetailsClientClick = (id) => {
    setSelectedItemId(id);
    setDetailsClientModalOpen(true);
  };
  const handleDetailsProviderClick = (id) => {
    setSelectedItemId(id);
    setDetailsProviderModalOpen(true);
  };
  const handleDetailsServiceClick = (id) => {
    setSelectedItemId(id);
    setDetailsServiceModalOpen(true);
  };
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getData(
          `/admin/service-request-reviews/${itemId}`
        );
        if (response.success) {
          setServiceData(response.data);
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
      }
    };

    if (isOpen) fetchServiceData();
    else setServiceData(null); // Reset on close
  }, [isOpen, itemId]);

  if (!serviceData) {
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

  const { id, rate, review, client, created_at, provider, service_request } =
    serviceData;
  console.log(serviceData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setServiceData(null); // Reset data when closing modal
        onClose();
      }}
      size="5xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>
          Service Request Reviews #{id}
        </ModalHeader>
        <ModalBody>
          {/* Service Details Section */}
          <div className={styles.details}>
            <h3 className="font-bold">Service Details</h3>

            <div className="flex justify-between">
              <strong>Rate:</strong> <span>{rate || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <strong>Review:</strong> <span>{review || "N/A"}</span>
            </div>

            <div className="flex justify-between">
              <strong>Created At:</strong>{" "}
              <span>
                {(created_at &&
                  new Date(created_at).toLocaleDateString("EN-ca")) ||
                  "N/A"}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <strong>Service Type:</strong>{" "}
              <span>{service_type?.name?.en || "N/A"}</span>
            </div> */}
          </div>

          <Divider className="my-4" />

          {/* Client Details Section */}
          <div className={styles.details}>
            <h3 className="font-bold">Client Details</h3>

            <div className="flex items-center gap-4 border-1 rounded-lg py-2 px-4">
              <Avatar src={client?.user?.avatar || "/default-avatar.png"} />
              <div className="flex flex-1 justify-between">
                <strong>
                  {client?.user?.first_name} {client?.user?.last_name}
                </strong>
                <p>Email: {client?.user?.email || "N/A"}</p>
                <p>Phone: {client?.user?.phone_number || "N/A"}</p>
                <p
                  onClick={() => handleDetailsClientClick(client?.id)} // Ensure this is correct
                  className=" text-blue-700 underline color-primary cursor-pointer"
                >
                  Show More
                </p>
              </div>
            </div>
          </div>

          {provider && (
            <>
              <Divider className="my-4" />
              {/* Provider Details Section */}
              <div className={styles.details}>
                <h3 className="font-bold">Provider Details</h3>

                <div className="flex items-center gap-4 border-1 rounded-lg py-2 px-4">
                  <Avatar
                    src={provider?.user?.avatar || "/default-avatar.png"}
                  />
                  <div className="flex flex-1 justify-between">
                    <strong>
                      {provider?.user?.first_name} {provider?.user?.last_name}
                    </strong>
                    <p>Email: {provider?.user?.email || "N/A"}</p>
                    <p>Phone: {provider?.user?.phone_number || "N/A"}</p>
                    <p
                      onClick={() => handleDetailsProviderClick(provider?.id)} // Ensure this is correct
                      className="underline  text-blue-700 color-primary cursor-pointer"
                    >
                      Show More
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          <Divider className="my-4" />
          {service_request && (
            <>
              <h3 className="font-bold">Service Request</h3>
              {/* {service_request.map((item, idx) => { */}
              {/* return (
                  <> */}
              <div className={styles.details}>
                <div className="flex items-center gap-4 border-1 rounded-lg py-2 px-4">
                  {/* <Avatar
                          src={
                            item.provider?.user?.avatar || "/default-avatar.png"
                          }
                        /> */}
                  <div className="flex flex-1 justify-between">
                    <p>
                      Status:
                      {service_request.status === "ACCEPTED" ? (
                        <>
                          {" "}
                          <span
                            className={
                              "bg-orange-500 text-white rounded-lg p-1"
                            }
                          >
                            ACCEPTED
                          </span>
                        </>
                      ) : service_request.status === "SEARCHING" ? (
                        <>
                          {" "}
                          <span
                            className={"bg-sky-500 text-white rounded-lg p-1"}
                          >
                            SEARCHING
                          </span>
                        </>
                      ) : service_request.status === "CANCELLED" ? (
                        <>
                          {" "}
                          <span
                            className={"bg-red-500 text-white rounded-lg p-1"}
                          >
                            CANCELLED
                          </span>
                        </>
                      ) : service_request.status === "FINISHED" ? (
                        <>
                          {" "}
                          <span
                            className={"bg-green-500 text-white rounded-lg p-1"}
                          >
                            FINISHED
                          </span>
                        </>
                      ) : (
                        <></> || "N/A"
                      )}
                    </p>

                    <p>Address: {service_request.address || "N/A"}</p>
                    <p>
                      Finished At:{" "}
                      {new Date(service_request.finished_at).toLocaleDateString(
                        "EN-ca"
                      ) || "N/A"}
                    </p>
                    <p
                      onClick={() =>
                        handleDetailsServiceClick(service_request.id)
                      } // Ensure this is correct
                      className="underline   text-blue-700 color-primary cursor-pointer"
                    >
                      Show More
                    </p>
                  </div>
                </div>
              </div>
              {/* </>
                );
              })} */}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
        <ClientDetailsModal
          isOpen={isDetailsClientModalOpen}
          onClose={() => setDetailsClientModalOpen(false)}
          itemId={selectedItemId}
          onEdit={openToEditClient}
        />
        <ProviderDetailsModal
          isOpen={isDetailsProviderModalOpen}
          onClose={() => setDetailsProviderModalOpen(false)}
          itemId={selectedItemId}
          onEdit={openToEditProvider}
        />
        <ServiceRequestDetailsModal
          isOpen={isDetailsServiceModalOpen}
          onClose={() => setDetailsServiceModalOpen(false)}
          itemId={selectedItemId}
          onEdit={openToEditService}
        />
        <EditClientModal
          // refreshData={fetchServices}
          isOpen={isDetailsClientEditModalOpen}
          itemId={selectedItemId}
          onClose={() => setDetailsClientEditModalOpen(false)}
        />
        <EditServiceTypeModal
          // refreshData={fetchServices}
          isOpen={isDetailsServiceEditModalOpen}
          itemId={selectedItemId}
          onClose={() => setDetailsServiceEditModalOpen(false)}
        />
        <EditProviderModal
          // refreshData={fetchServices}
          isOpen={isDetailsProviderEditModalOpen}
          itemId={selectedItemId}
          onClose={() => setDetailsProviderEditModalOpen(false)}
        />
      </ModalContent>
    </Modal>
  );
};

export default ServiceRequestReviewsModal;
