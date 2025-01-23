import * as XLSX from "xlsx";

export const exportSingleRow = (row) => {
    exportToExcel([row], "single_row");
};

export const exportToExcel = (rows, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};