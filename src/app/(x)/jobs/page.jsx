"use client";
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaPlus, FaFileExport } from "react-icons/fa";
import { getData, deleteData } from "@/utils/apiHelper";
import styles from "@/assets/css/ServicesTable.module.css";
import {
  Input,
  Button,
  Checkbox,
  DatePicker,
  Spinner,
  DateRangePicker,
  Image,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import ArrowRight from "@/assets/icons/ArrowRight";
import ArrowLeft from "@/assets/icons/ArrowLeft";
import EditServiceModal from "@/components/service-categories/EditServiceModal";
import AddFqaModal from "@/components/fqa/AddFqaModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { exportSingleRow, exportToExcel } from "@/utils/ExcelFun";
import EditFqaModal from "@/components/fqa/EditFqaModal";
import AddRequestModal from "@/components/requests/AddRequestModal";
import EditRequestModal from "@/components/requests/EditRequestModal";
import ServiceRequestDetailsModal from "@/components/requests/ServiceRequestDetailsModal";
import AddClientModal from "@/components/Clients/AddClientModal";
import EditClientModal from "@/components/Clients/EditClientModal";
import ClientDetailsModal from "@/components/Clients/ClientDetailsModal";
import AddVendorModal from "@/components/Vendors/AddVendorModal";
import EditVendorModal from "@/components/Vendors/EditVendorModal";
import VendorDetailsModal from "@/components/Vendors/VendorDetailsModal";
import JobDetailsModal from "@/components/Jobs/JobDetailsModal";

const JobsTable = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState(new Set());

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    created_at_from: null,
    created_at_to: null,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getData("/orders", {
        page: page,
        limit: limit,
        ...filters,
      });
      setData(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      console.error("Failed to fetch jobs requests:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDetailsClick = (id) => {
    console.log("id to view details:", id); // Add a console log for debugging
    setSelectedItemId(id);
    setDetailsModalOpen(true);
  };
  useEffect(() => {
    fetchServices();
  }, [page, filters]);

  const handleDeleteClick = (id) => {
    setSelectedItemId(id);
    setIsDeleteModalOpen(true);
  };
  const handleAddClick = (id) => {
    setSelectedItemId(id);
    setAddModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteData(`/orders/${selectedItemId}`);
      setIsDeleteModalOpen(false);
      toast.success("Deleted Job successful!");
      fetchServices();
    } catch (error) {
      console.error("Failed to delete Jobs:", error);
    }
  };
  const toggleRowSelection = (id) => {
    const updatedSelection = new Set(selectedRows);
    updatedSelection.has(id)
      ? updatedSelection.delete(id)
      : updatedSelection.add(id);
    setSelectedRows(updatedSelection);
  };

  const exportCheckedRows = () => {
    const rowsToExport = data.filter((row) => selectedRows.has(row.id));
    if (rowsToExport.length <= 0) {
      toast.error("No rows selected for export");
    } else {
      exportToExcel(rowsToExport, "jobs");
    }
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
          isSelected={selectedRows.has(row.original.id)}
          onChange={() => toggleRowSelection(row.original.id)}
        />
      ),
    },
    {
      header: "Client Name",
      cell: ({ row }) => {
        return `${
          row?.original?.service_request?.client?.user?.first_name +
          " " +
          row?.original?.service_request?.client?.user?.last_name
        }
        `;
      },
    },
    {
      header: "Vendor Name",
      cell: ({ row }) => {
        return `${
          row?.original?.vendor?.user?.first_name +
          " " +
          row?.original?.vendor?.user?.last_name
        }
        `;
      },
    },
    {
      header: "Service Name",
      cell: ({ row }) => {
        return `${row?.original?.service_request?.service?.name}
        `;
      },
    },
    {
      header: "Final fees",
      cell: ({ row }) => {
        return `${row?.original?.price}$
        `;
      },
    },

    {
      header: "Date added",
      accessorKey: "start_date",
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date);

        // const formattedTime = new Intl.DateTimeFormat("en-US", {
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   hour12: true,
        // }).format(date);

        return (
          <span>
            {formattedDate.replace(/\//g, " \\ ")}
            {/* 2024-01-01 */}
            {/* •{" "} */}
            {/* {formattedTime.toLowerCase()} */}
          </span>
        );
      },
    },

    {
      header: "Action",
      cell: ({ row }) => (
        <div className={styles.actions}>
          {/* <img
            src="./images/icons/edit.svg"
            className={styles.icon}
            onClick={() => handleAddClick(row.original?.id)}
          /> */}
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

          <Image
            src="/images/icons/eye.svg"
            className={styles.icon}
            onClick={() => handleDetailsClick(row.original?.id)} // Ensure this is correct
          />
        </div>
      ),
    },
  ];
  const openToEdit = () => {
    // console.log("id to deleted :"), id;

    // setSelectedItemId(id);
    setDetailsModalOpen(false);
    setAddModalOpen(true);
  };
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
      <h2>Jobs</h2>
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
          <DateRangePicker
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
          </Button>
        </div>
        <div className={styles.buttons}>
          <Button
            color="primary"
            radius="sm"
            // onClick={() => setIsModalOpen(true)}
            className={styles.addButton}
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
              >
                <path
                  opacity="0.4"
                  d="M4 7.375L14 7.375C16.2091 7.375 18 9.16586 18 11.375V15.375C18 17.5841 16.2091 19.375 14 19.375H4C1.79086 19.375 2.7141e-07 17.5841 1.74846e-07 15.375L0 11.375C-9.65645e-08 9.16586 1.79086 7.375 4 7.375Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.46967 9.84467C5.17678 10.1376 5.17678 10.6124 5.46967 10.9053L8.46967 13.9053C8.76256 14.1982 9.23744 14.1982 9.53033 13.9053L12.5303 10.9053C12.8232 10.6124 12.8232 10.1376 12.5303 9.84467C12.2374 9.55178 11.7626 9.55178 11.4697 9.84467L9.75 11.5643L9.75 1.375C9.75 0.960786 9.41421 0.625 9 0.625C8.58579 0.625 8.25 0.960786 8.25 1.375L8.25 11.5643L6.53033 9.84467C6.23744 9.55178 5.76256 9.55178 5.46967 9.84467Z"
                  fill="white"
                />
              </svg>
            }
          >
            Export Report
          </Button>
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
      {loading ? (
        <div className={"loading"}>
          <Spinner size="lg" label="Loading data..." color="primary" />
        </div>
      ) : data.length === 0 ? (
        // No Data State
        <div className={"noData"}>
          <p>No jobs found!</p>
        </div>
      ) : (
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
            </table>
          </div>
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
              <ArrowRight className={styles.icon} />
            </Button>
          </div>
        </>
      )}

      {/* <AddVendorModal
        refreshData={fetchServices}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditVendorModal
        refreshData={fetchServices}
        isOpen={isAddModalOpen}
        vendorId={selectedItemId}
        onClose={() => setAddModalOpen(false)}
      /> */}
      <ConfirmDeleteModal
        text={"Are You Sure delete This job?"}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
      />
      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        itemId={selectedItemId}
        onEdit={openToEdit}
      />
    </div>
  );
};

export default JobsTable;
