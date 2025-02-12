"use client";
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Select from "react-select";

import { FaPlus, FaFileExport } from "react-icons/fa";
import { getData, deleteData, postData, putData } from "@/utils/apiHelper";
import styles from "@/assets/css/ServicesTable.module.css";
import {
  Input,
  Button,
  Checkbox,
  Spinner,
  DateRangePicker,
  Image,
  Switch,
} from "@nextui-org/react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import ArrowRight from "@/assets/icons/ArrowRight";
import ArrowLeft from "@/assets/icons/ArrowLeft";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { languageKeys } from "@/utils/lang";
import AddServiceTypeModal from "@/components/service-type/AddServiceTypeModal";
import EditServiceTypeModal from "@/components/service-type/EditServiceTypeModal";
import ServiceTypeDetailsModal from "@/components/service-type/ServiceTypeDetailsModal";
import AddClientModal from "@/components/clients/AddClientModal";
import EditClientModal from "@/components/clients/EditClientModal";
import ClientDetailsModal from "@/components/clients/ClientDetailsModal";
import { useRouter, useSearchParams } from "next/navigation";
import AddProviderModal from "@/components/providers/AddProviderModal";
import EditProviderModal from "@/components/providers/EditProviderModal";
import ProviderDetailsModal from "@/components/providers/ProviderDetailsModal";
import ServiceRequestReviewsModal from "@/components/service-request-reviews/ServiceRequestReviewsModal";

const ServiceRequestReviews = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState(new Set());

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [clients, setClients] = useState([]);
  const [provider, setProvider] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("client_id");
  const id_provider = searchParams.get("provider_id");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getData(`/admin/clients`);
        console.log(response);
        const clientOptions = response.data.map((item) => ({
          label: `${item.user.first_name} ${item.user.last_name}`,
          value: String(item.id), // Ensure value is a string
        }));

        // Add the "All" option at the beginning
        const allOption = { label: "All", value: null };
        setClients([allOption, ...clientOptions]); // Prepend the "All" option
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    const fetchProvider = async () => {
      try {
        const response = await getData(`/admin/providers`);
        console.log(response);
        const clientOptions = response.data.map((item) => ({
          label: `${item.user.first_name} ${item.user.last_name}`,
          value: String(item.id), // Ensure value is a string
        }));

        // Add the "All" option at the beginning
        const allOption = { label: "All", value: null };
        setProvider([allOption, ...clientOptions]); // Prepend the "All" option
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    // fetchServices();
    fetchClients();
    fetchProvider();
  }, []);
  const [filters, setFilters] = useState({
    client_id: id || null,
    provider_id: id_provider || null,
    search: "",
    sort_order: "asc", // true for ascending, false for descending
    created_at_from: null,
    created_at_to: null,
  });
  const handleDetailsClick = (id) => {
    setSelectedItemId(id);
    setDetailsModalOpen(true);
  };
  const toggleSortOrder = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sort_order: prevFilters.sort_order === "asc" ? "desc" : "asc", // Toggle between asc and desc
    }));
  };
  const fetchServices = async () => {
    if (data.length > 0) {
      setLoadingFilter(true);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const response = await getData("/admin/service-request-reviews", {
        page: page,
        limit: limit,
        ...filters,
      });
      setData(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
      setLoadingFilter(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, filters]);

  const handleDeleteClick = (id) => {
    // console.log("id to deleted :"), id;

    setSelectedItemId(id);
    setIsDeleteModalOpen(true);
  };
  const handleAddClick = (id) => {
    // console.log("id to deleted :"), id;

    setSelectedItemId(id);
    setAddModalOpen(true);
  };
  const openToEdit = () => {
    // console.log("id to deleted :"), id;

    // setSelectedItemId(id);
    setDetailsModalOpen(false);
    setAddModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteData(`/admin/service-request-reviews/${selectedItemId}`);
      setIsDeleteModalOpen(false);
      toast.success("Deleted service successful!");
      fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };
  const handleSelectChange = (selectedOption, type) => {
    const newId = selectedOption ? selectedOption.value : null;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: newId,
    }));

    // Build URL with both client_id and provider_id if available
    const queryParams = new URLSearchParams();
    if (type === "client_id" && newId) queryParams.set("client_id", newId);
    if (type === "provider_id" && newId) queryParams.set("provider_id", newId);

    // Preserve the existing filter
    const otherFilter =
      type === "client_id" ? filters.provider_id : filters.client_id;
    if (otherFilter)
      queryParams.set(
        type === "client_id" ? "provider_id" : "client_id",
        otherFilter
      );

    router.push(`/service-request-reviews?${queryParams.toString()}`);
  };
  // Handle Row Selection
  const toggleRowSelection = (id) => {
    const updatedSelection = new Set(selectedRows);
    updatedSelection.has(id)
      ? updatedSelection.delete(id)
      : updatedSelection.add(id);
    setSelectedRows(updatedSelection);
  };
  const handleEdit = async (rowData) => {
    try {
      // Toggle the is_active value
      const updatedActiveStatus = !rowData.is_active;

      // Update the data on the server
      const response = await putData(`/admin/providers/${rowData.id}`, {
        ...rowData,
        is_active: updatedActiveStatus,
      });

      // Show success message if API call is successful
      if (response.success) {
        toast.success(response.data.message || "Status updated successfully!");
        // Optionally, refresh the data or update the local state here
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating the status.");
    }
  };

  const exportCheckedRows = () => {
    const rowsToExport = data.filter((row) => selectedRows.has(row.id));
    if (rowsToExport.length <= 0) {
      toast.error("No rows selected for export");
    } else {
      exportToExcel(rowsToExport, "services");
    }
  };

  const exportSingleRow = (row) => {
    exportToExcel([row], "single_row");
  };

  const exportToExcel = (rows, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  // const columnsForLang = languageKeys.flatMap((lang) => [
  //   {
  //     header: `Name (${lang.toUpperCase()})`,
  //     accessorKey: `name.${lang}`, // Access the specific language field
  //     cell: ({ row }) => (
  //       <div className="flex items-center">
  //         <span>{row.original.name[lang]}</span>
  //       </div>
  //     ),
  //   },

  //   {
  //     header: `Job Name (${lang.toUpperCase()})`,
  //     accessorKey: `job_name.${lang}`, // Access the specific language field
  //     cell: ({ row }) => (
  //       <div className="flex items-center">
  //         <span>{row.original.job_name[lang]}</span>
  //       </div>
  //     ),
  //   },
  // ]);
  const handleRequestShow = (id) => {
    router.push(`/service-requests?id=${id}`);
  };
  const columns = [
    {
      header: ({ table }) => (
        <Checkbox
          color="primary"
          isSelected={selectedRows.size === data.length && data.length > 0}
          isIndeterminate={
            selectedRows.size > 0 && selectedRows.size < data.length
          }
          onChange={() => {
            const allSelected = selectedRows.size === data.length;
            const updatedSelection = new Set();
            if (!allSelected) {
              data.forEach((row) => updatedSelection.add(row.id));
            }
            setSelectedRows(updatedSelection);
          }}
        />
      ),
      accessorKey: "id",

      cell: ({ row }) => (
        <Checkbox
          color="primary"
          isSelected={selectedRows.has(row.original.id)} // Individual row selection
          onChange={() => toggleRowSelection(row.original.id)}
        />
      ),
    },
    // ...columnsForLang,
    {
      header: "Review",
      accessorKey: "review",
    },
    {
      header: "Rate",
      accessorKey: "rate",
    },
    {
      header: "Provider Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            src={
              row.original.provider?.user?.avatar || "https://placehold.co/400"
            }
            alt={row.original?.provider?.user?.first_name}
            style={{
              height: "2rem",
              width: "2rem",
              marginRight: "0.5rem",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <p>
            {row.original?.provider?.user?.first_name +
              " " +
              row.original?.provider?.user?.last_name}
          </p>
        </div>
      ),
    },
    {
      header: "Client Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            src={
              row.original.client?.user?.avatar || "https://placehold.co/400"
            }
            alt={row.original?.client?.user?.first_name}
            style={{
              height: "2rem",
              width: "2rem",
              marginRight: "0.5rem",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <p>
            {row.original?.client?.user?.first_name +
              " " +
              row.original?.client?.user?.last_name}
          </p>
        </div>
      ),
    },

    {
      header: "Date Added",
      accessorKey: "created_at",
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date);

        const formattedTime = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(date);

        return (
          <span>
            {formattedDate.replace(/\//g, " \\ ")} •{" "}
            {formattedTime.toLowerCase()}
          </span>
        );
      },
    },
    // {
    //   header: "Active",
    //   accessorKey: "is_active",
    //   cell: ({ row }) => (
    //     <Switch
    //       size="sm"
    //       color="primary"
    //       isSelected={row.original.is_active} // Individual row selection
    //       onChange={() => handleEdit(row.original)} // Pass the entire row's original data
    //     />
    //   ),
    // },
    {
      header: "Action",
      cell: ({ row }) => (
        <div
          className={styles.actions}
          style={{
            display: "flex",
            gap: "1rem",
            width: "150px", // تأكد من أن العرض مناسب
            position: "sticky",
            right: 0,
            // background: "#fff", // خلفية ثابتة
            zIndex: 1, // أولوية العرض
          }}
        >
          <Image
            src="/images/icons/edit.svg"
            className={styles.icon}
            onClick={() => handleAddClick(row.original?.id)}
          />
          <Image
            src="/images/icons/trash.svg"
            onClick={() => handleDeleteClick(row.original?.id)}
            className={styles.icon}
          />

          {/* <img
            src="./images/icons/export.svg"
            className={styles.icon}
            onClick={() => exportSingleRow(row.original)}
          /> */}
          {/* <Image
            src="/images/icons/menu.svg"
            onClick={() => handleRequestShow(row.original?.id)}
            className={styles.icon}
          /> */}
          <Image
            src="/images/icons/eye.svg"
            className={styles.icon}
            onClick={() => handleDetailsClick(row.original?.id)} // Ensure this is correct
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const clearDateRange = () => {
    setFilters({
      ...filters,
      search: "",
      created_at_from: null,
      created_at_to: null,
    });
  };
  return (
    <div className={styles.container}>
      <h2>
        Service Request Reviews
        {loadingFilter && (
          // <tr>
          //   <td colSpan={7}>
          // <div className={"loading al"}>
          <Spinner size="sm" color="primary" className="ms-2" />
          // </div>
          //   </td>
          // </tr>
        )}
      </h2>
      <div className={styles.header}>
        <div className={styles.filters}>
          <Input
            label="Search"
            placeholder="Search..."
            className="min-w-[200px] custom-input"
            type="text"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            labelPlacement="outside"
            radius="sm"
            variant="bordered"
          />
          <div>
            <label className=" text-sm">Client Name</label>
            <Select
              // menuIsOpen
              label="Client Name"
              placeholder="Select Client"
              classNamePrefix="react-select"
              className="min-w-[200px] custom-input mt-1"
              variant="bordered"
              theme={"primary"}
              value={clients.filter((option) => option.value == id)}
              options={clients}
              labelPlacement="outside"
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "client_id")
              }
            />
          </div>
          <div>
            <label className=" text-sm">Provider Name</label>
            <Select
              // menuIsOpen
              label="Provider Name"
              placeholder="Select Provider"
              classNamePrefix="react-select"
              className="min-w-[200px] custom-input mt-1"
              variant="bordered"
              theme={"primary"}
              value={provider.filter((option) => option.value == id_provider)}
              options={provider}
              labelPlacement="outside"
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "provider_id")
              }
            />
          </div>
          {/* <DateRangePicker
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            label="Date"
            aria-label="Select date range"
            className="min-w-[200px] custom-input"
            // className={styles.dateRangePicker}
            value={{
              start: filters.created_at_from,
              end: filters.created_at_to,
            }}
            onChange={(range) => {
              // Update state with date strings only
              setFilters({
                ...filters,
                created_at_from: range.start ? range.start : null,
                created_at_to: range.end ? range.end : null,
              });
            }}
          />
          <Button
            className={styles.clearButton}
            onPress={clearDateRange}
            variant="ghost"
            color="default"
          >
            Clear
          </Button> */}
        </div>
        <div className={styles.buttons}>
          <Button onPress={toggleSortOrder} radius="sm" color="primary">
            {filters.sort_order === "asc" ? "Asc" : "Desc"}
          </Button>

          {/* <Button
            color="primary"
            radius="sm"
            onClick={() => setIsModalOpen(true)}
            className={styles.addButton}
            startContent={<FaPlus />}
          >
            Add Reviews
          </Button> */}
          <Button
            radius="sm"
            className={styles.exportButton}
            onClick={exportCheckedRows}
            startContent={<FaFileExport />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {/* {loading ? (
        <div className={"loading"}>
          <Spinner size="lg" label="Loading data..." color="primary" />
        </div>
      ) : data.length === 0 ? (
        // No Data State
        <div className={"noData"}>
          <p>No services found!</p>
        </div>
      ) : ( */}
      {/* // Table */}
      <>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {loading ? (
              <tbody>
                <tr className="not-hover">
                  <td colSpan={10}>
                    <div className={"loading al"}>
                      <Spinner
                        size="lg"
                        // label="Loading data..."
                        color="primary"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : data.length === 0 ? (
              // No Data State
              <tbody>
                <tr className="not-hover">
                  <td className="hover:bg-transparent" colSpan={10}>
                    <div className={"noData"}>
                      <p>No data found!</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {data.length > 0 && (
          <>
            <div className={styles.pagination}>
              <Button
                className={styles.paginationBtn}
                isDisabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                {/* <img src="./images/icons/arrow_left.svg" className={styles.icon} /> */}
                <ArrowLeft className={styles.icon} />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={page === i + 1 ? styles.activePage : ""}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <Button
                className={styles.paginationBtn}
                isDisabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {/* <img src="./images/icons/arrow_right.svg" className={styles.icon} /> */}
                <ArrowRight className={styles.icon} />
              </Button>
            </div>
          </>
        )}
      </>

      <AddProviderModal
        refreshData={fetchServices}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditProviderModal
        refreshData={fetchServices}
        isOpen={isAddModalOpen}
        itemId={selectedItemId}
        onClose={() => setAddModalOpen(false)}
      />
      <ConfirmDeleteModal
        text={"Are You Sure delete This Client?"}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
      />
      <ServiceRequestReviewsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        itemId={selectedItemId}
        onEdit={openToEdit}
      />
    </div>
  );
};

export default ServiceRequestReviews;
