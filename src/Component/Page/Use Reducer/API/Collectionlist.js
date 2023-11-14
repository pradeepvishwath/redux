import React, { useState, useEffect, useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { FaFilter } from "react-icons/fa";

import { Checkbox } from "primereact/checkbox";
import {
  API_URL,
  deleteUser,
  getUsers,
} from "../../../../Service/MockAPI/MockAPI";
import { NavLink } from "react-router-dom";

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

// import { AiOutlineArrowLeft } from "react-icons/ai";

import { toast } from "react-toastify";
import "primeicons/primeicons.css";
import { Workform } from "./Collectionform";

// ... other imports ...

// ... other imports ...

const initialState = {
  apiData: [],
  searchText: "",
  selectedItems: [],
  deleteProductDialog: false,
  deleteProductsDialog: false,
  selectedRows: [],
  products: [],
  product: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_API_DATA":
      return { ...state, apiData: action.payload };
    case "SET_SEARCH_TEXT":
      return { ...state, searchText: action.payload };
    case "SET_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload };
    case "SET_DELETE_PRODUCT_DIALOG":
      return { ...state, deleteProductDialog: action.payload };
    case "SET_DELETE_PRODUCTS_DIALOG":
      return { ...state, deleteProductsDialog: action.payload };
    case "SET_SELECTED_ROWS":
      return { ...state, selectedRows: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_PRODUCT":
      return { ...state, product: action.payload };
    default:
      return state;
  }
}

export function Worklist() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [apiData, setAPIData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [product, setProduct] = useState({});
  const formRef = useRef(null);
  const navigate = useNavigate();

  const callGetAPI = async () => {
    try {
      // const resp = await axios.get(API_URL);
      const resp = await getUsers();
      dispatch({ type: "SET_API_DATA", payload: resp.data });

      setAPIData(resp.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
      dispatch({ type: "SET_API_DATA", payload: [] });
      setAPIData([]);
    }
  };

  useEffect(() => {
    callGetAPI();
  }, []);

  // useEffect(() => {
  //   async function callGetAPI() {
  //     try {
  //       const resp = await axios.get(API_URL);
  //       dispatch({ type: "SET_API_DATA", payload: resp.data });
  //     } catch (error) {
  //       console.error("Error fetching table data:", error);
  //       dispatch({ type: "SET_API_DATA", payload: [] });
  //     }
  //   }
  //   callGetAPI();
  // }, []);

  // ... other functions ...

  const updateEdit = async (id) => {
    // dispatch({ type: SET_EDITING, value: true });
    navigate(`/usereducer/${id}`);
  };

  const confirmDeleteSelected = () => {
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
        console.error("Error deleting record:", error);
      }
    }

    const updatedData = apiData.filter(
      (rowData) => !deletedIds.includes(rowData.id)
    );
    setAPIData(updatedData);
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
      // console.log("Record deleted successfully:", response.data);

      const updatedData = apiData.filter((val) => val.id !== product.id);
      setAPIData(updatedData);

      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((row) => row.id !== product.id)
      );

      setDeleteProductDialog(false);
      // setProduct(emptyProduct);

      toast.success("Worker Deleted Successfully!");
    } catch (error) {
      // console.error("Error deleting worker:", error);
      toast.error("Error deleting worker. Please try again later.");
    }
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

  const filterData = (data) => {
    return data.filter((item) => {
      return (
        (item.firstName &&
          item.firstName.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.email &&
          item.email.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.password &&
          item.password.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.cpassword &&
          item.cpassword.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.gender &&
          item.gender.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.language &&
          item.language.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.dob && item.dob.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setSearchText("")
  };

  const actionBodyTemplate = (rowData) => {
    const buttonStyle = {
      marginRight: "10px",
    };

    return (
      <div>

        <React.Fragment>
          <Button
            icon="pi pi-pencil"
            // style={buttonStyle}
            rounded
            outlined
            className=""
            onClick={() => updateEdit(rowData.id)}
            severity="success"
          />
          <Button
            icon="pi pi-trash"
            rounded
            outlined
            severity="danger"
            className="ms-2"
            // style={buttonStyle}
            // onClick={() => handleDeleteSelected(rowData)}
            onClick={() => confirmDeleteProduct(rowData)}
          />
        </React.Fragment>
      </div>
    );
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then((autoTable) => {
        const doc = new jsPDF.default();
        doc.autoTable({
          head: [
            [
              "firstName",
              "E-mail",
              "Phone",
              "Password",
              "Confirm Password",
              "Language",
              "Gender",
              "Date of Birth",
            ],
          ],
          body: apiData.map((row) => [
            row.firstName,
            row.email,
            row.phone,
            row.password,
            row.cpassword,
            row.language,
            row.gender,
            row.dob,
          ]),
        });

        doc.save("Student Details.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(apiData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "users");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "export" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const openNew = () => {
    navigate(`/usereducer`);
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="">
        <Button
          label="New"
          icon="pi pi-plus"
          className="ms-4"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          className="ms-4 mt-2"
          onClick={confirmDeleteSelected}
          disabled={!selectedRows || selectedRows.length === 0}
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
          onClick={() => saveAsExcelFile(false)}
          data-pr-tooltip="CSV"
        />
        <Button
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          className="ms-2"
          rounded
          onClick={exportExcel}
          data-pr-tooltip="XLS"
        />
        <Button
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          className="ms-2"
          rounded
          onClick={exportPdf}
          data-pr-tooltip="PDF"
        />
      </div>
    );
  };
  return (
    <>
      <div className=" mt-5 d-flex justify-content-center">
        <div className="col-md-10 mb-5 card p-3  mt-5">
          <Toolbar
            className=" "
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
        </div>
      </div>

      <div className=" d-flex justify-content-center">
        <div className="col-md-10 mb-5 card p-4  mt-4 shadow ">
          <div className="d-flex justify-content-center">
            <h1 className="me-auto  text-center">User Table</h1>
            <div className="ms-auto">
              <Button className="button me-3 " onClick={handleReset}>
                Clear
                <FaFilter />
              </Button>
              <div className="p-input-icon-left">
              <i className="pi pi-search" />
                <InputText
              
                placeholder="Global Search"
                className="mt-2 pi pi-search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div></div>
          </div>

          <DataTable
            ref={formRef}
            className="mt-5 table-responsive"
            value={filterData(apiData)}
            sortField="price"
            sortOrder={-1}
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={10}
            rowsPerPageOptions={[4, 8, 12, 16]}
            scrollable
            scrollHeight="400px"
            virtualScrollerOptions={{ itemSize: 46 }}
            selectionMode="multiple"
            selection={selectedRows}
            onSelectionChange={(e) => setSelectedRows(e.value)}
            columnResizeMode="expand"
            resizableColumns
            showGridlines
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          >
            <Column selectionMode="multiple" style={{ width: "3em" }} />
            <Column
              field="firstName"
              header="Firstname"
              sortable
              filter
              style={{ width: "13%" }}
            />
            <Column
              field="email"
              header="Email"
              sortable
              filter
              style={{ width: "13%" }}
            />
            <Column
              field="phone"
              header="Phone Number"
              sortable
              filter
              style={{ width: "13%" }}
            />
            <Column
              field="password"
              header="Password"
              sortable
              filter
              style={{ width: "13%" }}
            />
            <Column
              field="cpassword"
              header="Confirm password"
              sortable
              filter
              style={{ width: "13%" }}
            />
            <Column
              field="gender"
              header="Gender"
              sortable
              filter
              style={{ width: "13%" }}
            />
            <Column
              field="language"
              header="Language"
              sortable
              filter
              style={{ width: "13%" }}
            />
            <Column
              field="dob"
              header="Date Of Birth"
              sortable
              filter
              style={{ width: "13%" }}
            />
            <Column
              header="Actions"    krj
              className="text-center p-2"
              body={actionBodyTemplate}
            />
          </DataTable>
        </div>

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
                {selectedRows.length > 1 ? "Workers" : '"Worker\'s Data"'}?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
}
export default Workform;
