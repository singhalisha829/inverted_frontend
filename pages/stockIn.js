import { useState, useEffect } from "react";
import Router from "next/router";
import Head from "next/head";

import Sidebar from "../components/sidebar";
import Dropdown from "../components/dropdown";
import Modal from "../components/modal";
import {
  fetchDropdownUnitList,
  fetchDropdownPartList,
} from "../services/productionOrderService";
import {
  fetchPartsList,
  fetchPartTypeList,
} from "../services/dashboardService";
import List from "../components/stockInList";
import {
  fetchUnitList,
  fetchVendorList,
  addNewLedger,
  fetchPartById,
} from "../services/stockInService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import * as xlsx from "xlsx";
import Header from "../components/header";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StockIn = () => {
  const [partList, setPartList] = useState(null);
  const [unitList, setUnitList] = useState(null);
  const [vendorList, setVendorList] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPage, setShowPage] = useState(false);
  const [newPartList, setNewPartList] = useState([]);
  const [partTypeList, setPartTypeList] = useState(null);
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [partName, setPartName] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const [invoice, setInvoice] = useState("");
  const [vendor, setVendor] = useState(null);
  const [unit, setUnit] = useState(null);
  const [price, setPrice] = useState("");
  const [partId, setPartId] = useState(null);
  const [finalList, setFinalList] = useState([]);
  const [isSubmit, setIsSumbit] = useState(true);

  const notifySuccess = () => toast.success("New Parts Added Successfully");

  useEffect(() => {
    // fetch data only if token is defined or redirect to login
    if (localStorage.getItem("token") != null) {
      const token = localStorage.getItem("token");
      setToken(token);
      fetchPartTypeList(token).then((res) => setPartTypeList(res.data));

      fetchDropdownPartList(token)
        .then((res) => {
          setPartList(res.data.data.output);
        })
        .catch((err) => toast.error(err.message));
      fetchUnitList(token).then((res) => setUnitList(res.data));
      fetchVendorList(token).then((res) => setVendorList(res.data));
      setShowPage(true);
    } else {
      Router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (finalList.length > 0) {
      setIsSumbit(false);
    } else {
      setIsSumbit(true);
    }
  }, [finalList.length]);

  useEffect(() => {
    if (invoice != "" && vendor != null) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [invoice, vendor]);

  // calculate screen size
  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      if (typeof window !== "undefined") {
        function handleResize() {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
      }
    }, []);
    return windowSize;
  }
  const size = useWindowSize();

  // remove the part from list on clicking the trash icon
  const handleDeleteNote = (id) => {
    const newList = newPartList.filter((note) => note.part !== id);
    setNewPartList(newList);

    const newList1 = finalList.filter((note) => note.part !== id);
    setFinalList(newList1);
  };

  // add new part in the list on clicking the check icon
  const submitHandler = () => {
    if (invoice === null || invoice === "") {
      toast.warning("Enter Invoice Number!");
      return;
    } else if (selectedDate === null || selectedDate === "") {
      toast.warning("Enter Date!");
      return;
    } else if (vendor === null || vendor === "") {
      toast.warning("Enter Vendor!");
      return;
    } else if (partName === "" || partName === null) {
      toast.warning("Enter Part Name!");
      return;
    } else if (price === null || price === "") {
      toast.warning("Enter Unit Price!");
      return;
    } else if (quantity === null || quantity === "") {
      toast.warning("Enter Quantity!");
      return;
    } else if (unit === null || unit === "") {
      toast.warning("Enter Unit!");
      return;
    } else {
      const d = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const date = [year, month, d].join("-");

      const data = {
        part: id,
        partName: partName,
        document_id: invoice,
        date: date,
        vendor: vendor,
        quantity: quantity + " " + unit,
        price: price,
        transaction_type: "CREDIT",
        partId: partId,
      };

      const data1 = {
        part: id,
        document_id: invoice,
        date: date,
        vendor: vendor,
        quantity: quantity + " " + unit,
        price: price,
        transaction_type: "CREDIT",
      };
      const newList = [data, ...newPartList];
      const newList1 = [data1, ...finalList];
      setFinalList(newList1);
      setNewPartList(newList);
      cancelHandler();
    }
  };

  // clear the form on clicking the cross icon
  const cancelHandler = () => {
    setPartName(() => "");
    setPrice(() => "");
    setQuantity(() => "");
    setUnit(() => "");
    setPartId("");
  };

  // upload excel file
  const uploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  // submit the whole list on the server
  const submitPartsListHandler = async () => {
    setIsSumbit(true);
    const res = await addNewLedger(finalList, token);
    // console.log("trial",res)

    if (res.status == 200) {
      Router.push("/");
      setIsSumbit(false);
    } else {
      toast.error(res.data.status.description);
      setIsSumbit(false);
    }

    // notifySuccess()
  };

  const fetchPartId = (id) => {
    setId(id);
    fetchPartById(id, token).then((res) => {
      if (res.data.quantity != null || res.data.quantity != undefined) {
        setUnit(res.data.quantity.split(" ")[1]);
      }
      setPartId(res.data.part_id);
      setPartName(res.data.short_description);
    });
  };

  const fetchUnit = (unitType) => {
    // console.log(unitType)
    fetchDropdownUnitList(token, unitType).then((res) => {
      // console.log(res.data);
      setUnitList(res.data.data.output);
    });
  };

  const padding = size.width < "600" ? "1rem" : null;

  // stock in form
  const form = (
    <div className="form_content">
      {size.width > "600" ? (
        <div style={{ width: "15%", textAlign: "center" }}>{partId}</div>
      ) : null}
      <div
        style={{
          width: size.width > "600" ? "30%" : "100%",
          display: "flex",
          justifyContent: "center",
          paddingBottom: padding,
        }}
      >
        {partList ? (
          <Dropdown
            options={partList}
            isPartsList="true"
            searchPlaceholder="Enter Part ID/Name"
            width={size.width > "600" ? "60%" : "90%"}
            name="short_description"
            partTypeList={partTypeList}
            border={true}
            parentCallback={(data) => {
              fetchPartId(data.id);
              fetchUnit(data.unit_type);
            }}
            value={partName}
            minWidth="12rem"
            dropdownWidth={size.width > "600" ? "20vw" : "70vw"}
            dropdownHeight="25rem"
          />
        ) : null}
      </div>

      <div
        style={{
          width: size.width > "600" ? "10%" : "100%",
          display: "flex",
          justifyContent: "center",
          paddingBottom: padding,
        }}
      >
        <input
          style={{ width: size.width > "600" ? "80%" : "90%", height: "3rem" }}
          type="number"
          placeholder={size.width < "600" ? "Enter Unit Price" : "0.00"}
          onChange={(e) => setPrice(e.target.value)}
          onWheel={ event => event.currentTarget.blur() }
          value={price}
        />
      </div>

      <div
        style={{
          width: size.width > "600" ? "30%" : "100%",
          display: "flex",
          justifyContent: "center",
          paddingBottom: padding,
        }}
      >
        <div
          style={{
            display: "flex",
            width: size.width > "600" ? "70%" : "90%",
            border: "#e5e5e5 solid 0.1em",
            borderRadius: "5px",
          }}
        >
          <input
            value={quantity}
            style={{ width: "35%", height: "3rem", border: "none" }}
            className="quantity"
            type="number"
            onWheel={ event => event.currentTarget.blur() }
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
          />
          <div style={{ borderLeft: "#e5e5e5 solid 0.1em" }} />
          {unitList ? (
            <Dropdown
              options={unitList}
              isUnitList="true"
              searchPlaceholder="Search Unit"
              width="60%"
              name="symbol"
              minWidth="9rem"
              no_outline={true}
              parentCallback={(data) => setUnit(data.symbol)}
              value={unit}
              dropdownWidth={size.width > "600" ? "11vw" : "40vw"}
            />
          ) : null}
        </div>
      </div>

      <div
        style={{
          width: size.width > "600" ? "15%" : "90%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {size.width > "600" ? (
          <div className="icons1">
            <FaCheckCircle
              onClick={submitHandler}
              size={30}
              className="check_icon"
            />
            <FaTimesCircle
              size={30}
              onClick={cancelHandler}
              className="cross_icon"
            />
          </div>
        ) : (
          <div className="stockin_buttons" style={{ marginTop: "2rem" }}>
            <button
              className="cancel_button button2 plus expand"
              onClick={cancelHandler}
            >
              Clear
            </button>
            <button
              className="save_button button2 plus expand"
              onClick={submitHandler}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>Inverted</title>
        <link rel="icon" href="/logo icon 2-01.png" />
      </Head>
      {/* {size.width > "600" ? <Sidebar /> : <Header show={true} />} */}
      <div className="stockin_page">
        <ToastContainer />
        <div className="stockin_title">
          <div className="title">Stock In</div>
          <div className="sub_title">Add New Parts to Stock</div>
        </div>

        <div className="stockin_subsection">
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="stockin_subtitle">Your Stock in Items</div>
          </div>

          <div className="stockin_form">
            <div className="form_column">
              {size.width > "600" ? (
                <label style={{ marginBottom: "0.5rem" }}>
                  Invoice Number:
                </label>
              ) : null}
              <input
                style={{
                  width: size.width > "600" ? "60%" : "90%",
                  minWidth: "12rem",
                  height: "3rem",
                }}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="Enter Invoice Number"
              />
            </div>
            <div className="form_column">
              {size.width > "600" ? (
                <label style={{ marginBottom: "0.5rem" }}>Vendor: </label>
              ) : null}
              {vendorList ? (
                <Dropdown
                  options={vendorList}
                  searchPlaceholder="Search Vendor"
                  width={size.width > "600" ? "60%" : "90%"}
                  name="name"
                  minWidth="12rem"
                  border={true}
                  parentCallback={(data) => setVendor(data.id)}
                  dropdownWidth={size.width > "600" ? "15vw" : "70vw"}
                />
              ) : null}
            </div>
            <div className="date_column">
              {size.width > "600" ? (
                <label style={{ marginBottom: "0.5rem" }}>Date:</label>
              ) : null}
              <DatePicker
                placeholderText="Enter Date"
                dateFormat="dd/MM/yyyy"
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                }}
              />
            </div>
          </div>
          {size.width > "600" && showForm ? (
            <div style={{ width: "100%" }}>
              <div className="stockin_list_header">
                <div style={{ width: "15%", textAlign: "center" }}>Part ID</div>
                <div style={{ width: "30%", textAlign: "center" }}>
                  Part Name
                </div>
                <div style={{ width: "10%", textAlign: "center" }}>
                  Unit Price
                </div>
                <div style={{ width: "30%", textAlign: "center" }}>
                  Quantity
                </div>
                <div style={{ width: "15%", textAlign: "center" }}></div>
              </div>
              {showForm ? form : null}
            </div>
          ) : null}
        </div>

        {size.width < "600" && showForm ? (
          <div className="stockin_form2">{form}</div>
        ) : null}

        {size.width < "600" && showForm ? (
          <div
            className="stockin_form2"
            style={{ borderBottom: "#e5e5e5 solid 0.1em" }}
          >
            <div className="stockin_list_header">
              <div style={{ width: "20%", textAlign: "center" }}>Part ID</div>
              <div style={{ width: "30%", textAlign: "center" }}>Part Name</div>
              <div style={{ width: "20%", textAlign: "center" }}>
                Unit Price
              </div>
              <div style={{ width: "20%", textAlign: "center" }}>Quantity</div>
              <div style={{ width: "10%", textAlign: "center" }}></div>
            </div>
          </div>
        ) : null}

        {newPartList.map((l, index) => (
          <List
            key={index}
            id={l.part}
            partDesc={l.partName}
            partId={l.partId}
            quantity={l.quantity}
            unit={l.unit}
            price={l.price}
            deleteNote={(data) => handleDeleteNote(data)}
          />
        ))}
      </div>
      <div className="stock_out_footer" style={{ left: "16.6vw" }}>
        <div className="stock_out_button">
          <button
            className="cancel_button button2"
            onClick={() => {
              Router.back();
            }}
          >
            Cancel
          </button>
          <button
            className="save_button button2"
            onClick={submitPartsListHandler}
            disabled={isSubmit}
          >
            Save
          </button>
        </div>
      </div>

      <Modal show={showModal} modalClosed={() => setShowModal(false)}>
        hiii
        <input type="file" name="file" onChange={(e) => uploadFile(e)} />
      </Modal>
    </div>
  );
};

export default StockIn;
