import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getUsers, deleteUser } from "../../../../Service/MockAPI/MockAPI";
import { useNavigate } from "react-router-dom";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

import "primeicons/primeicons.css";

export function Datalist() {
  const [apiData, setAPIData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  // const [filters] = useState({
  //   name: { value: null },
  //   email: { value: null },
  //   password: { value: null },
  //   confirmPassword: { value: null },
  //   phoneNumber: { value: null },
  //   gender: { value: null },
  //   language: { value: null },
  //   dob: { value: null },
  // });
  // const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  // const [emptyProduct] = useState({});
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [rowDeleted, setRowDeleted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const navigate = useNavigate();
  // const dt = useRef(null);
  const formRef = useRef(null);

  const openNew = () => {
    navigate(`/dataform`);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          className="ms-2"
          onClick={confirmDelete}
          // disabled={!selectedRows || selectedRows.length === 0}
          disabled={!selectedRows || selectedRows.length === 0 || rowDeleted}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="">
        <Button
          type="button"
          icon="pi pi-file"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        />
        <Button
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          className="ms-2"
          rounded
          onClick={exportToExcel}
          data-pr-tooltip="XLS"
        />
        <Button
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          className="ms-2"
          rounded
          onClick={downloadPDF}
          data-pr-tooltip="PDF"
        />
      </div>
    );
  };

  const callGetAPI = async () => {
    try {
      const resp = await getUsers();

      setAPIData(resp.data);
    } catch (error) {
      // console.error("Error fetching table data:", error);
      setAPIData([]);
    }
  };

  useEffect(() => {
    callGetAPI();
  }, []);

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setGlobalFilter("");
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };
  const confirmDelete = () => {
    setDeleteProductsDialog(true);
  };
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const deleteSelectedProducts = async () => {
    const deletedIds = [];
    for (const selectedRow of selectedRows) {
      try {
        // const response = await axios.delete(API_URL + "/" + selectedRow.id);
        const response = await deleteUser(selectedRow.id);
        console.log("Record deleted successfully:", response.data);
        deletedIds.push(selectedRow.id);
      } catch (error) {
        // apiData([])
        // console.error("Error deleting record:", error);
        console.error("Error deleting record:", error);
      }
    }

    const updatedData = apiData.filter(
      (rowData) => !deletedIds.includes(rowData.id)
    );
    setAPIData(updatedData);
    // setDeletedRows(deletedRows.concat(selectedRows));
    toast.success("Deleted successfully!");
    setDeleteProductsDialog(false);
    setSelectedRows([]);
  };

  const deleteProductsDialogFooter = (
    <div className="confirmation-content">
      <button
        type="button"
        className="btn btn-primary bg-transparent ms-2 fs-4 fw-bold text-primary"
        onClick={hideDeleteProductsDialog}
      >
        <CloseIcon /> NO
      </button>
      <button
        type="button"
        className="btn btn-danger ms-2 fs-4 text-light"
        onClick={deleteSelectedProducts}
      >
        <CheckIcon /> YES
      </button>
    </div>
  );

  const header = () => {
    return (
      <div className="d-flex p-toolbar">
        <div>
          <h3 className="text-danger">Worker's Table</h3>
        </div>
        <div className="d-flex justify-content-end">
          <Button className="button me-3 " onClick={handleReset}>
            Clear
            <FaFilter />
          </Button>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              globalFilter={globalFilter}
              value={globalFilter}
              onChange={onGlobalFilterChange}
              placeholder="Global Search"
            />
          </span>
        </div>
      </div>
    );
  };

  const updateEdit = async (id) => {
    navigate(`/dataform/${id}`);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const deleteProduct = async () => {
    try {
      // const response = await axios.delete(API_URL + "/" + product.id);
      const response = await deleteUser(product.id);
      console.log("Record deleted successfully:", response.data);

      const updatedData = apiData.filter((val) => val.id !== product.id);
      setAPIData(updatedData);
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((row) => row.id !== product.id)
      );

      setDeleteProductDialog(false);
      setRowDeleted(true);
      // setProduct(emptyProduct);

      toast.success("Worker Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast.error("Error deleting worker. Please try again later.");
    }
  };

  const handleRowSelect = (e) => {
    setSelectedRows(e.value);
    // setSelectedRows([]);
    setRowDeleted(false);
    console.log("Selected Rows:", e.value);
  };

  const deleteProductDialogFooter = (
    <div className="confirmation-content">
      <button
        type="button"
        className="btn btn-primary bg-transparent ms-2 fs-4 fw-bold text-primary"
        onClick={hideDeleteProductDialog}
      >
        <CloseIcon /> NO
      </button>
      <button
        type="button"
        className="btn btn-danger ms-2 fs-4 text-light"
        onClick={() => deleteProduct(product.id)}
      >
        <CheckIcon /> YES
      </button>
    </div>
  );
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className=""
          onClick={() => updateEdit(rowData.id)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          className="ms-2"
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Workers");
    worksheet.columns = [
      { header: "Name", key: "firstName", width: 15 },
      { header: "Email", key: "email", width: 20 },
      { header: "Password", key: "password", width: 15 },
      { header: "Confirm Password", key: "cpassword", width: 20 },
      { header: "Phone Number", key: "phone", width: 15 },
      { header: "Gender", key: "gender", width: 15 },
      { header: "Language", key: "language", width: 15 },
      { header: "Date of Birth", key: "dob", width: 15 },
    ];

    apiData.forEach((rowData) => {
      worksheet.addRow({
        firstName: rowData.firstName,
        email: rowData.email,
        password: rowData.password,
        cpassword: rowData.cpassword,
        phone: rowData.phone,
        gender: rowData.gender,
        language: rowData.language,
        dob: rowData.dob,
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const fileName = "Workers.xlsx";

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    });
  };

  const downloadPDF = () => {
    console.log("hello");
    const doc = new jsPDF();
    const tableData = apiData.map((rowData) => {
      return [
        rowData.firstName,
        rowData.email,
        rowData.password,
        rowData.cpassword,
        rowData.phone,
        rowData.gender,
        rowData.language,
        rowData.dob,
      ];
    });

    doc.autoTable({
      head: [
        [
          "Name",
          "Email",
          "Password",
          "Confirm Password",
          "Phone Number",
          "Gender",
          "Language",
          "Date of Birth",
        ],
      ],
      body: tableData,
    });

    doc.save("Worker's.pdf");
  };
  const exportCSV = (selectionOnly) => {
    formRef.current.exportCSV({ selectionOnly });
  };

  return (
    <>
      <div className="mt-5 p-4 ">
        <div className="container">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="col-md-10 mb-5 mt-4 ">
          <DataTable
            className="mt-5 ms-2"
            value={apiData}
            ref={formRef}
            sortField="price"
            sortOrder={-1}
            paginator
            rows={5}
            header={header}
            columnResizeMode="expand"
            resizableColumns
            showGridlines
            selectionMode="multiple"
            globalFilter={globalFilter}
            selection={selectedRows}
            onSelectionChange={handleRowSelect}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              selectionMode="multiple"
              // header="#"
              style={{ width: "3rem" }}
            ></Column>
            <Column
              field="firstName"
              header="First Name"
              sortable
              filter
            ></Column>
            <Column field="email" header="Email" filter sortable></Column>
            <Column
              field="phone"
              header="Phone Number"
              filter
              sortable
            ></Column>
            <Column field="password" header="Password" filter sortable></Column>
            <Column
              field="cpassword"
              header="Confirm password"
              filter
              sortable
            ></Column>
            <Column field="gender" header="Gender" filter sortable></Column>
            <Column field="language" header="Language" filter sortable></Column>
            <Column field="dob" header="Date Of Birth" filter sortable></Column>
            <Column
              header="Actions"
              className="text-center p-2"
              body={actionBodyTemplate}
              style={{ minWidth: "8rem" }}
            />
          </DataTable>

          <Dialog
            visible={deleteProductsDialog}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="confirmation-content">
              <WarningAmberOutlinedIcon className="fs-1" />
              {selectedRows.length > 0 && (
                <span className="fs-5 ms-2 mt-4 ">
                  Are you sure you want to delete {selectedRows.length}{" "}
                  {selectedRows.length > 1 ? "Worker" : '"Worker\'s Data"'}?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {product && (
                <span>
                  Are you sure you want to delete <b>{product.firstName}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
}
