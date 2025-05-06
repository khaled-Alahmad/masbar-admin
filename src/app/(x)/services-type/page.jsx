"use client";
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
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

const ServicesTypeTable = () => {
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

  const [filters, setFilters] = useState({
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
      const response = await getData("/admin/service-types", {
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
      await deleteData(`/admin/service-types/${selectedItemId}`);
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
  const handleEdit = async (rowData, status) => {
    try {
      // Toggle the is_active value
      // const updatedActiveStatus = !rowData.is_active;
      // const online_meeting = !rowData.online_meeting;
      let updatedIsActive, updatedOnlineMeeting;
      if (status === "is_active") {
        updatedIsActive = !rowData.is_active;
      } else if (status === "online_meeting") {
        updatedOnlineMeeting = !rowData.online_meeting;
      }
      // If online is true, set the online_meeting value to true

      // const online_meeting = !rowData.online_meeting;

      // Update the data on the server
      const response = await putData(`/admin/service-types/${rowData.id}`, {
        // ...rowData,
        is_active: updatedIsActive,
        online_meeting: updatedOnlineMeeting,
      });

      // Show success message if API call is successful
      if (response.success) {
        toast.success(response.data.message || "Status updated successfully!");
        // Update the local state to reflect the change
        // setData((prevData) =>
        //   prevData.map((item) =>
        //     item.id === rowData.id
        //       ? { ...item, is_active: updatedActiveStatus }
        //       : item
        //   )
        // );
        fetchServices(); // Refresh the data
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
  const columnsForLang = languageKeys.flatMap((lang) => [
    {
      header: `Name (${lang.toUpperCase()})`,
      accessorKey: `name.${lang}`, // Access the specific language field
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.original.name[lang]}</span>
        </div>
      ),
    },

    {
      header: `Job Name (${lang.toUpperCase()})`,
      accessorKey: `job_name.${lang}`, // Access the specific language field
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.original.job_name[lang]}</span>
        </div>
      ),
    },
    {
      header: `Tag name (${lang.toUpperCase()})`,
      accessorKey: `tag_name.${lang}`, // Access the specific language field
      cell: ({ row }) => (
        <div className="flex items-center">
          <span
            style={{
              backgroundColor: row.original.tag_color || "transparent",
              padding: "2px 8px",
              borderRadius: "4px",
              color: row.original.tag_color ? "#fff" : "inherit",
            }}
          >
            {row.original.tag_name[lang] || ""}
          </span>
        </div>
      ),
    },
  ]);

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
      header: "Service Type Image",
      accessorKey: "picture",
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            src={row.original.image}
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
      header: "Online",
      accessorKey: "online_meeting",
      cell: ({ row }) => (
        <Switch
          size="sm"
          color="primary"
          isSelected={row.original.online_meeting} // Individual row selection
          onChange={() => handleEdit(row.original, "online_meeting")} // Pass the entire row's original data
        />
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
    {
      header: "Active",
      accessorKey: "is_active",
      cell: ({ row }) => (
        <Switch
          size="sm"
          color="primary"
          isSelected={row.original.is_active} // Individual row selection
          onChange={() => handleEdit(row.original, "is_active")} // Pass the entire row's original data
        />
      ),
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
        Services Type
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
                        //  label="Loading data..."
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
                  <td className="hover:bg-transparent " colSpan={10}>
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

      <AddServiceTypeModal
        refreshData={fetchServices}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditServiceTypeModal
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
      <ServiceTypeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        itemId={selectedItemId}
        onEdit={openToEdit}
      />
    </div>
  );
};

export default ServicesTypeTable;
