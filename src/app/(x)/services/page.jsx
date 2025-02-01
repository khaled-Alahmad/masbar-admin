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
  Spinner,
  DateRangePicker,
  Image,
} from "@nextui-org/react";
import AddServiceModal from "@/components/service-categories/AddServiceModal";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import ArrowRight from "@/assets/icons/ArrowRight";
import ArrowLeft from "@/assets/icons/ArrowLeft";
import EditServiceModal from "@/components/service-categories/EditServiceModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import ServiceDetailsModal from "@/components/service-categories/ServiceDetailsModal";
import { languageKeys } from "@/utils/lang";

const ServicesTable = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false);

  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState(new Set());

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [filters, setFilters] = useState({
    search: "",
    created_at_from: null,
    sort_order: "asc", // true for ascending, false for descending

    created_at_to: null,
  });
  const toggleSortOrder = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sort_order: prevFilters.sort_order === "asc" ? "desc" : "asc", // Toggle between asc and desc
    }));
  };
  const handleDetailsClick = (id) => {
    setSelectedItemId(id);
    setDetailsModalOpen(true);
  };
  const fetchServices = async () => {
    if (data.length > 0) {
      setLoadingFilter(true);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const response = await getData("/admin/service-categories", {
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
      await deleteData(`/admin/service-categories/${selectedItemId}`);
      setIsDeleteModalOpen(false);
      toast.success("Deleted service successful!");
      fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };
  // Handle Row Selection
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
  const columnsForLang = languageKeys.map((lang) => ({
    header: `Name (${lang.toUpperCase()})`,
    accessorKey: `name.${lang}`, // Access the specific language field
    cell: ({ row }) => (
      <div className="flex items-center">
        {/* <img
          src={row.original.main_image}
          alt={row.original.name[lang]}
          style={{
            height: "2rem",
            width: "2rem",
            marginRight: "0.5rem",
            objectFit: "cover",
          }}
        /> */}
        <span>{row.original.name[lang]}</span>
      </div>
    ),
  }));
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
    ...columnsForLang,
    {
      header: "Service Image",
      accessorKey: "picture",
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            src={row.original.picture}
            alt={row.original.name}
            style={{
              height: "2rem",
              width: "2rem",
              marginRight: "0.5rem",
              objectFit: "cover",
            }}
          />
        </div>
      ),
    },
    {
      header: "Order",
      accessorKey: "sort",
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
        Services Categories
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
          <Button onPress={toggleSortOrder} radius="sm" color="primary">
            {filters.sort_order === "asc" ? "Asc" : "Desc"}
          </Button>
          <Button
            color="primary"
            radius="sm"
            onClick={() => setIsModalOpen(true)}
            className={styles.addButton}
            startContent={<FaPlus />}
          >
            Add Service
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
            {/* Loading State */}
            {loading ? (
              <tbody>
                <tr className="not-hover">
                  <td colSpan={7}>
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
                  <td colSpan={7}>
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

      <AddServiceModal
        refreshData={fetchServices}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditServiceModal
        refreshData={fetchServices}
        isOpen={isAddModalOpen}
        itemId={selectedItemId}
        onClose={() => setAddModalOpen(false)}
      />
      <ConfirmDeleteModal
        text={"Are You Sure delete This Service ?"}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
      />
      <ServiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        itemId={selectedItemId}
        onEdit={openToEdit}
      />
    </div>
  );
};

export default ServicesTable;
