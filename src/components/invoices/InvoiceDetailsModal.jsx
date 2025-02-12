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

const InvoiceDetailsModal = ({ isOpen, onClose, itemId }) => {
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
        const response = await getData(`/admin/invoices/${itemId}`);
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

  const {
    id,
    status,
    address,
    service_request,
    latitude,
    before_comment,
    befor_record,
    after_comment,
    after_record,
    longitude,
    schedule_at,
    finished_at,
    emirate,
    client,
    canceled_by,
    cancel_reason,
    provider,
    service_type,
    images,
    request_filters,
  } = serviceData;
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
        Invoice Details #{id}
        </ModalHeader>
        <ModalBody>
          {/* Service Details Section */}
          <div className={styles.details}>
            <h3 className="font-bold">Service Details</h3>
            <div className="flex justify-between">
              <strong>Status:</strong>{" "}
              {service_request.status === "ACCEPTED" ? (
                <>
                  {" "}
                  <span className={"bg-orange-500 text-white rounded-lg p-1"}>
                    ACCEPTED
                  </span>
                </>
              ) : service_request.status === "SEARCHING" ? (
                <>
                  {" "}
                  <span className={"bg-sky-500 text-white rounded-lg p-1"}>
                    SEARCHING
                  </span>
                </>
              ) : service_request.status === "CANCELLED" ? (
                <>
                  {" "}
                  <span className={"bg-red-500 text-white rounded-lg p-1"}>
                    CANCELLED
                  </span>
                </>
              ) : service_request.status === "FINISHED" ? (
                <>
                  {" "}
                  <span className={"bg-green-500 text-white rounded-lg p-1"}>
                    FINISHED
                  </span>
                </>
              ) : (
                <></> || "N/A"
              )}
            </div>
            {service_request.status === "CANCELLED" && (
              <>
                <div className="flex justify-between">
                  <strong>Cancel Reason:</strong>{" "}
                  <span>{service_request.cancel_reason || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Canceled By:</strong>{" "}
                  <span>{service_request.canceled_by || "N/A"}</span>
                </div>
              </>
            )}
            {service_request.emirate && (
              <>
                <div className="flex justify-between">
                  <strong>Emirate:</strong>{" "}
                  <span>
                    {service_request.emirate.name[currentlyLang] || "N/A"}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <strong>Address:</strong>{" "}
              <span>{service_request.address || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <strong>Scheduled At:</strong>{" "}
              <span>
                {(service_request.schedule_at &&
                  new Date(service_request.schedule_at).toLocaleDateString(
                    "EN-ca"
                  )) ||
                  "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>Finished At:</strong>{" "}
              <span>
                {(service_request.finished_at &&
                  new Date(service_request.finished_at).toLocaleDateString(
                    "EN-ca"
                  )) ||
                  "N/A"}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <strong>Service Type:</strong>{" "}
              <span>{service_type?.name?.en || "N/A"}</span>
            </div> */}
          </div>

          {/* <Divider className="my-4" /> */}

          {/* Client Details Section */}
          {/* <div className={styles.details}>
            <h3 className="font-bold">Client Details</h3>
            <div className="flex gap-4 align-middle text-center">
              <strong>Client Comment:</strong>{" "}
              <span>{before_comment || "N/A"}</span>
            </div>
            {befor_record && (
              <>
                <div className="flex gap-4 align-middle items-center text-center">
                  <strong>Client record:</strong>{" "}
                  <span>
                    {" "}
                    <audio controls>
                      <source src={befor_record} type="audio/mp4" />
                      Your browser does not support the audio element.
                    </audio>
                  </span>
                </div>
              </>
            )}
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
          </div> */}

          {/* {provider && (
            <>
              <Divider className="my-4" />
              <div className={styles.details}>
                <h3 className="font-bold">Provider Details</h3>
                <div className="flex gap-4 align-middle text-center">
                  <strong>Provider Comment:</strong>{" "}
                  <span>{after_comment || "N/A"}</span>
                </div>
                {after_record && (
                  <>
                    <div className="flex gap-4 align-middle items-center text-center">
                      <strong>Provider record:</strong>{" "}
                      <span>
                        {" "}
                        <audio controls>
                          <source src={after_record} type="audio/mp4" />
                          Your browser does not support the audio element.
                        </audio>
                      </span>
                    </div>
                  </>
                )}
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
          )} */}

          <Divider className="my-4" />
          <div className="">
            <h3 className="font-bold mb-2">Invoice Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Invoice ID
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Code
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Fixed Price
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Hourly Price
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Work Time
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Charity
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Tax
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Total
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Total With Tax
                    </th>
                    <th className="border text-nowrap border-gray-300 px-4 py-2 text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.id}
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.code}
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.fixed_price} {serviceData.currency}
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.hourly_price} {serviceData.currency}
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.work_time_formatted}
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.charity} {serviceData.currency}
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.tax} %
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.total} {serviceData.currency}
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      {serviceData.total_with_tax} {serviceData.currency}
                    </td>
                    <td className="border text-nowrap border-gray-300 px-4 py-2">
                      <span
                        className={
                          serviceData.status === "unpaid"
                            ? "bg-red-500 text-white p-1 rounded-lg"
                            : "bg-green-500 text-white p-1 rounded-lg"
                        }
                      >
                        {serviceData.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Divider className="my-4" />

            {/* Payment Details Table */}
            {serviceData.payments.length > 0 && (
              <>
                <h3 className="font-bold mb-2">Payments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Payment ID
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Method
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Amount
                        </th>
                        {/* <th className="border border-gray-300 px-4 py-2 text-left">
                            Currency
                          </th> */}
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Status
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceData.payments.map((payment) => (
                        <tr key={payment.id} className="border-b">
                          <td className="border border-gray-300 px-4 py-2">
                            {payment.id}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {payment.payment_method}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {payment.amount} {payment.currency}
                          </td>
                          {/* <td className="border border-gray-300 px-4 py-2">
                              {payment.currency}
                            </td> */}
                          <td className="border border-gray-300 px-4 py-2">
                            <span
                              className={
                                payment.status === "confirm"
                                  ? "bg-green-500 text-white p-1 rounded-lg"
                                  : "bg-red-500 text-white p-1 rounded-lg"
                              }
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(payment.created_at).toLocaleString(
                              "EN-ca"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Images Section */}
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
        <ServiceTypeDetailsModal
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

export default InvoiceDetailsModal;
