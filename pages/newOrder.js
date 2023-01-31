import Sidebar from "../components/sidebar";
import Dropdown from "../components/dropdown";
import Router from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/header";

import StockOutList from "../components/stockOutList";
import { fetchPartTypeList } from "../services/dashboardService";
import {
  fetchDropdownPartList,
  fetchDropdownUnitList,
} from "../services/productionOrderService";
import { fetchBOMList } from "../services/purchaseOrderService";
import { createProductionOrder } from "../services/productionOrderService";
import {fetchPartById} from '../services/stockInService';

import PurchaseOrderList from "../components/purchaseOrderList";

import { FaSistrix, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewOrder = () => {
  const order_type = [
    { value: "BOM", name: "BOM" },
    { value: "Part", name: "PART" },
  ];

  const [orderType, setOrderType] = useState("Part");
  const [token, setToken] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [showUnit, setShowUnit] = useState(false);
  const [partsList, setPartsList] = useState([]);
  const [bomList, setBOMList] = useState([]);
  const [bomName, setBomName] = useState(null);
  const [partName, setPartName] = useState(null);
  const [unitList, setUnitList] = useState([]);
  const [itemName,setItemName] = useState(null);
  const [unit, setUnit] = useState(null);
  const [newOrderList, setNewOrderList] = useState([]);
  const [partType, setPartType] = useState(null);
  const [emptyList, setEmptyList] = useState([]);
  const [part, setPart] = useState(null);
  const [bom, setBom] = useState(null);
  const [partTypeList, setPartTypeList] = useState([]);
  const [isSubmit, setIsSumbit] = useState(true);

  useEffect(() => {
    // fetch data only if token is defined or redirect to login
    if (localStorage.getItem("token") != undefined) {
      const token = localStorage.getItem("token");
      setToken(token);
      fetchBOMList(token)
        .then((res) => {
          setBOMList(res.data.data.output);
        })
        .catch((err) => toast.error(err.message));

      fetchPartTypeList(token)
        .then((res) => setPartTypeList(res.data))
        .catch((err) => toast.error(err.message));

      fetchDropdownPartList(token)
        .then((res) => {
          setPartsList(res.data.data.output);
        })
        .catch((err) => toast.error(err.message));
    } else {
      router.push("/login");
    }
  }, []);

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

  const submitHandler = () => {
    if (orderType === null || orderType === "") {
      toast.warning("Select Order Type!");
    } else if (quantity === "") {
      toast.warning("Enter Qunatity!");
    } else if (orderType === "Part" && unit === "") {
      toast.warning("Select Unit!");
    } else if (orderType === "BOM") {
      const data = {
        ItemType: orderType,
        item_id: bomName,
        quantity: quantity + " Nos",
        item_name:itemName,
        item_desc: bom,
      };
      setNewOrderList([data, ...newOrderList]);
      cancelHandler();

    } else {
      const data = {
        ItemType: orderType,
        item_id: partName,
        quantity: quantity + " " + unit,
        item_name:itemName,
        item_desc: part,
      };
      setNewOrderList([data, ...newOrderList]);
      cancelHandler();
      setShowUnit(false);

    }

  };

  const cancelHandler = () => {
    // setOrderType('');
    setQuantity(() => "");
    setPartName("");
    setPart('');
    setBomName("");
    setUnit("");
    setPartType("");
  };

  const fetchOrderName = (data) => {
    setToken(localStorage.getItem("token"));
    if (data === "Part") {
      setShowUnit(true);
    } else {
      setShowUnit(false);
    }
  };

  useEffect(() => {
    if (newOrderList.length > 0) {
      setIsSumbit(false);
    } else {
      setIsSumbit(true);
    }
  }, [newOrderList.length]);

  const submitOrder = async () => {
    setIsSumbit(true)
    if (newOrderList.length === 0) {
      toast.warning("Enter Form Details!");
    } else {
      const res = await createProductionOrder(newOrderList, token);

        
        if (res.data.status.code == 404) {
          setIsSumbit(false);
          toast.error(res.data.status.description);
        } else {
        Router.push({pathname:"/orderDetails",query:{id:res.data.status.last_id}});
        setIsSumbit(false);
        cancelHandler();
        }
    }
  };

  const handleDeleteOrder = (index) => {
    newOrderList.splice(index,1);
    setNewOrderList([...newOrderList]);
  };

  const fetchParts = (id) => {
    fetchDropdownPartList(token)
      .then((res) => {
        const list = res.data.data.output.filter((el) => el.part_type == id);
        setPartsList(list);
      })
      .catch((err) => toast.error(err.message));
  };

  const fetchUnit = (unitType) => {
    fetchDropdownUnitList(token, unitType).then((res) => {
      setUnitList(res.data.data.output);
    });
  };

  const handlePartDescription = (data) => {
    setPartName(data.id);
    setPart(data.short_description);
    fetchUnit(data.unit_type);
    const partType = partTypeList.filter((el) => el.id == data.part_type)[0]
      .name;
      fetchPartById(data.id,token).then((res)=>{
        if(res.data.quantity != null || res.data.quantity != undefined){
            setUnit(res.data.quantity.split(' ')[1]);
        }})
        

    setPartType(partType);
  };

  return (
    <div className="layout">
      <Head>
        <title>Inverted</title>
        <link rel="icon" href="/logo icon 2-01.png" />
      </Head>
      {size.width > "600" ? <Sidebar /> : <Header />}
      <div className="new_order_page">
        <ToastContainer />
        <div className="new_order_title">
          <div className="title">Production Order</div>
          <div className="sub_title">Place New Order</div>
        </div>

        {/* <div className="new_order_subsection">
                    <input  style={{width:"70%",height:'3.5rem'}} placeholder="Search.."/>
                    <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>
                </div> */}

        <div className="new_order_form">
          <div className="fields centered">
            {size.width > "600" ? (
              <label style={{ marginBottom: "0.5rem" }}>Order Type:</label>
            ) : null}
            <Dropdown
              options={order_type}
              name="name"
              width={size.width > "600" ? "70%" : "90%"}
              parentCallback={(data) => {
                setOrderType(data.value);
                fetchOrderName(data.value);
              }}
              dropdownWidth={size.width > "600" ? "13vw" : "71vw"}
              searchWidth={size.width > "600" ? "10vw" : "61vw"}
              border={true}
              value={orderType}
              placeholder="Select Order Type"
              height="3.3rem"
            />
          </div>

          {orderType == "Part" ? (
            <div className="fields centered">
              {size.width > "600" ? (
                <label style={{ marginBottom: "0.5rem" }}>Part Type:</label>
              ) : null}
              <Dropdown
                options={partTypeList}
                name="name"
                width={size.width > "600" ? "70%" : "90%"}
                parentCallback={(data) => {
                  fetchParts(data.id);
                  setPartType(data.name);
                }}
                dropdownWidth={size.width > "600" ? "13vw" : "20vw"}
                searchWidth={size.width > "600" ? "10vw" : "12vw"}
                border={true}
                value={partType}
                height="3.3rem"
                placeholder="Select Order Type"
              />
            </div>
          ) : null}

          <div className="fields centered">
            {size.width > "600" ? (
              <label style={{ marginBottom: "0.5rem" }}>
                Order Description:
              </label>
            ) : null}
            {orderType ? (
              <div>
                {orderType == "BOM" ? (
                  <Dropdown
                    options={bomList}
                    name="product_description"
                    width={size.width > "600" ? "70%" : "90%"}
                    parentCallback={(data) => {
                      setBomName(data.id);
                      setBom(data.product_description);
                      setItemName(data.product_code)
                    }}
                    dropdownWidth={size.width > "600" ? "13vw" : "71vw"}
                    searchWidth={size.width > "600" ? "10vw" : "61vw"}
                    border={true}
                    placeholder="Select Order"
                    height="3.3rem"
                  />
                ) : (
                  <Dropdown
                    options={partsList}
                    name="short_description"
                    width={size.width > "600" ? "70%" : "90%"}
                    parentCallback={(data) => {handlePartDescription(data);                      
                      setItemName(data.part_id)}
                    }
                    value={part}
                    dropdownWidth={size.width > "600" ? "15vw" : "71vw"}
                    searchWidth={size.width > "600" ? "12vw" : "61vw"}
                    border={true}
                    placeholder="Select Order"
                    height="3.3rem"
                    searchPlaceholder="Enter Part ID/Name"
                    dropdownHeight="25rem"
                    isPartsList="true"
                  />
                )}
              </div>
            ) : (
              <Dropdown
                options={emptyList}
                width={size.width > "600" ? "70%" : "90%"}
                dropdownWidth={size.width > "600" ? "13vw" : "71vw"}
                searchWidth={size.width > "600" ? "10vw" : "61vw"}
                border={true}
                placeholder="Select Order"
                height="3.3rem"
              />
            )}
          </div>

          <div className="fields centered">
            {size.width > "600" ? (
              <label style={{ marginBottom: "0.5rem" }}>
                Required Quantity:
              </label>
            ) : null}
            {orderType == "Part" ? (
              <div
                style={{
                  display: "flex",
                  width: size.width > "600" ? "100%" : "90%",
                  border: "#e5e5e5 solid 0.1em",
                  borderRadius: "5px",
                }}
              >
                <input
                  value={quantity}
                  style={{ width: "50%", height: "3rem", border: "none" }}
                  className="quantity"
                  type="number"
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                />
                <div style={{ borderLeft: "#e5e5e5 solid 0.1em" }} />
                <Dropdown
                  options={unitList}
                  isUnitList="true"
                  placeholder="Unit"
                  width="50%"
                  name="symbol"
                  minWidth="9rem"
                  no_outline={true}
                  parentCallback={(data) => setUnit(data.symbol)}
                  value={unit}
                  dropdownWidth={size.width > "600" ? "11vw" : "40vw"}
                  searchWidth={size.width > "600" ? "8vw" : "30vw"}
                  height="3rem"
                />
              </div>
            ) : (
              <input
                type="number"
                value={quantity}
                style={{
                  height: "3.3rem",
                  width: size.width > "600" ? "70%" : "90%",
                }}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
              />
            )}
          </div>
          <div className="new_order_form_footer">
            {size.width > "600" ? (
              <div className="form_icons">
                <FaCheckCircle
                  onClick={() => {
                    submitHandler();
                    setOrderType("Part");
                  }}
                  size={30}
                  className="check_icon"
                />
                <FaTimesCircle
                  size={30}
                  onClick={() => {
                    cancelHandler();
                    setOrderType("");
                  }}
                  className="cross_icon"
                />
              </div>
            ) : (
              <div className="stockin_buttons">
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

        <div style={{marginBottom:'10rem'}}>{newOrderList.map((l,index) => (
          <PurchaseOrderList
            key={index}
            order_type={l.ItemType}
            quantity={l.quantity}
            order_name={l.item_name}
            desc={l.item_desc}
            deleteOrder={() => handleDeleteOrder(index)}
          />
        ))}</div>

        <div className="stock_out_footer">
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
              onClick={submitOrder}
              disabled={isSubmit}
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
