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
import FaqDetailsModal from "@/components/fqa/FaqDetailsModal";

const FaqsTable = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState(new Set());

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const openToEdit = () => {
    // console.log("id to deleted :"), id;

    // setSelectedItemId(id);
    setDetailsModalOpen(false);
    setAddModalOpen(true);
  };
  const [filters, setFilters] = useState({
    search: "",
    created_at_from: null,
    created_at_to: null,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getData("/faqs", {
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
    }
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
      await deleteData(`/faqs/${selectedItemId}`);
      setIsDeleteModalOpen(false);
      toast.success("Deleted fqa successful!");
      fetchServices();
    } catch (error) {
      console.error("Failed to delete fqa:", error);
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
      exportToExcel(rowsToExport, "fqa");
    }
  };
  const handleDetailsClick = (id) => {
    // console.log("id to view details:", id); // Add a console log for debugging
    setSelectedItemId(id);
    setDetailsModalOpen(true);
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
      header: "Question text",
      accessorKey: "question",
      cell: ({ getValue }) => {
        const text = getValue() || ""; // Ensure it handles undefined or null values
        const words = text.split(" ");
        return words.length > 7 ? `${words.slice(0, 7).join(" ")}...` : text; // Show the full text if it's 7 words or fewer
      },
    },
    {
      header: "Question Answer",
      accessorKey: "answer",
      cell: ({ getValue }) => {
        const text = getValue() || "";
        const words = text.split(" ");
        return words.length > 7 ? `${words.slice(0, 7).join(" ")}...` : text; // Show the full text if it's 7 words or fewer
      },
    },
    {
      header: "Service Date",
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
        <div className={styles.actions}>
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
            onClick={() => handleDetailsClick(row.original?.id)} // Ensure this is correct
            className={styles.icon}
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
    setFilters({ ...filters,search:"", created_at_from: null, created_at_to: null });
  };
  return (
    <div className={styles.container}>
      <h2>FQA</h2>
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
            onPress={() => setIsModalOpen(true)}
            className={styles.addButton}
            startContent={<FaPlus />}
          >
            Add Question
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
          <p>No services found!</p>
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

      <AddFqaModal
        refreshData={fetchServices}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditFqaModal
        refreshData={fetchServices}
        isOpen={isAddModalOpen}
        itemId={selectedItemId}
        onClose={() => setAddModalOpen(false)}
      />
      <ConfirmDeleteModal
        text={"Are You Sure delete This Question ?"}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
      />
      <FaqDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        itemId={selectedItemId}
        onEdit={openToEdit}
      />
    </div>
  );
};

export default FaqsTable;
