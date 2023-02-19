import { useState, useEffect } from "react";
import Router from "next/router";
import Sidebar from "../components/sidebar";
import Table from "../components/table";
import { useRouter } from "next/router";

import Head from "next/head";
import Header from "../components/header";
import Spinner from "../components/spinner";
import Transactions from "../components/transactions";

import {
  fetchProductionOrderDetails,
  fetchProdOrderPartWiseList,
  fetchPastTransaction,
} from "../services/productionOrderService";
import { unitConversion } from "../services/purchaseOrderService";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "../components/dropdown";
import { FaTimes } from "react-icons/fa";

const OrderDetails = () => {
  const router = useRouter();

  const [orderItem, setOrderItem] = useState();
  const [partsInOrder, setPartsInOrder] = useState();
  const [pastTransactions, setPastTransactions] = useState(null);
  const [token, setToken] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [date, setDate] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [status, setStatus] = useState(null);
  const [productionOrderId, setProductionOrderId] = useState(null);
  const border = useState("#e5e5e5 solid 0.1em");
  const [formData, setFormData] = useState({});
  const [showDetails,setShowDetails] = useState(true);

  const today = new Date();
  const todayDate =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const [productionOrderList, setProductionOrderList] = useState({
    production_order: null,
    date: todayDate,
    production_order_item: [],
  });

  const [column1,setColumn1] = useState([
    {
      accessor1: "part_id",
      label: "Part ID",
      width: "15%",
      textalign: "center",
    },
    {
      accessor1: "short_description",
      label: "Part Description",
      width: "30%",
      textalign: "center",
    },
    {
      accessor1: "quantity_value",
      accessor2: "quantity_symbol",
      label: "Required Quantity",
      width: "20%",
      textalign: "center",
    }
    
  ]);

  useEffect(() => {
    // console.log("form",formData)
  }, [formData]);
  

  useEffect(() => {
      async function fetch(){
        if (localStorage.getItem("token") != undefined) {
        localStorage.setItem("stock_out_list", null);
        const token = localStorage.getItem("token");
        const poId = router.query.id;
        if (poId != undefined || poId != null) {
          setProductionOrderId(poId);
          setProductionOrderList({
            ...productionOrderList,
            production_order: poId,
          });
  
          // fetch order details
          const prodOrderRes = await fetchProductionOrderDetails(token, poId);
            setOrderItem(prodOrderRes.data.data.output[0].production_order_itemss);
            if(prodOrderRes.data.data.output[0].production_order_itemss.length > 0){
              setShowDetails(true);
            }else{
              setShowDetails(false);
            }
            setOrderNumber(prodOrderRes.data.data.output[0].production_order_no);
            setDate(prodOrderRes.data.data.output[0].date);
            setCreatedBy(prodOrderRes.data.data.output[0].created_by);
            setStatus(prodOrderRes.data.data.output[0].status);
  
            if(prodOrderRes.data.data.output[0].status !='Completed'){
              const col = {
                  accessor1: "part_quantity_value",
                  accessor2: "part_quantity_symbol",
                  label: "Available Quantity",
                  width: "20%",
                  textalign: "center",
              }
              setColumn1([...column1,col])
            }
            prodOrderRes.data.data.output[0].production_order_itemss.map((part) => {
              var greater = true;
              if(part.available_qty == null || part.available_qty == undefined){
                greater=false;
              }else{
                if (part.released_quantity_value>0 && part.released_quantity_unit_symbol != part.available_qty_symbol){
                  unitConversion(token,part.released_quantity_unit_symbol,part.available_qty_symbol).then(res=>{
                    if (res.data.status.code == 404) {
                      toast.error(res.data.status.description);
                    } else{const factor=res.data.output[0].conversion_factor;
                      if(part.available_qty * factor < part.released_quantity_value){
                        greater=false;
                      }
                    }
                  })
                }else{
                  if(part.available_qty<part.released_quantity_value){
                    greater=false;
                  }
                }
              }
            
              formData[part.id] = { quantity: null, unit: part.released_quantity_unit_symbol,isGreater:greater };
            });
            setFormData(formData);

            
          // fetch past transaction details
          const pastTransactionRes = await fetchPastTransaction(token, poId)
            if (pastTransactionRes.data.data != undefined) {
              const sorted = [...pastTransactionRes.data.data.output].reverse();
              setPastTransactions(sorted);
            }
  
            // fetch part wise list of production order
          const partWiseListRes = await fetchProdOrderPartWiseList(token, poId);    
          if(!partWiseListRes.data.success){
              toast.error(partWiseListRes.data.status.description);
            }else{
              setPartsInOrder(partWiseListRes.data.data.output.order_items);
            }
          setToken(token);
        }
      } else {
        Router.push("/login");
      }
      }
     
        fetch();
      

   
  }, [router.query.id]);

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

  const handleQuantity = (value, data) => {
    const factorToRequired = 1;
    const factorToAvailable = 1;

    // console.log("handle quantity")


    if(data.available_qty==null || data.available_qty ==undefined){
      quantityGreaterThanAvailable(data.id,formData[data.id].unit)
    }else if(data.released_quantity_unit_symbol != formData[data.id].unit || data.available_qty_symbol != formData[data.id].unit){
      unitConversion(
        token,
        data.released_quantity_unit_symbol,
        formData[data.id].unit
      ).then((res) => {
        if (res.data.status.code == 404) {
          toast.error(res.data.status.description);
        } else{
          factorToRequired=res.data.output[0].conversion_factor;
          unitConversion(token,data.available_qty_symbol,formData[data.id].unit).then(res=>{
            if (res.data.status.code == 404) {
              toast.error(res.data.status.description);
            } else{
              factorToAvailable=res.data.output[0].conversion_factor;
              compareQuantity(data,factorToRequired,factorToAvailable,value,formData[data.id].unit);
            }})
        }})

       
    }else{
      compareQuantity(data,factorToRequired,factorToAvailable,value,formData[data.id].unit);
    }
    // console.log("factor",factorToAvailable,factorToRequired,data.released_quantity_unit_symbol,data.available_qty_symbol,formData[data.id].unit)

    // compare quantity and calculate left quantity
   
  
  };

  const handleUnit = (unit_symbol, data) => {
    const factorToRequired = 1;
    const factorToAvailable=1;
    // console.log("handle unit")
  
    if(data.available_qty==null || data.available_qty ==undefined){
      quantityGreaterThanAvailable(data.id,unit_symbol)
    }else if(formData[data.id].quantity == null || formData[data.id].quantity == undefined || formData[data.id].quantity ==''){
      setFormData({
        ...formData,
        [data.id]: { quantity: formData[data.id].quantity , unit: unit_symbol },
      });
    }
    else if(data.released_quantity_unit_symbol != unit_symbol || data.available_qty_symbol != unit_symbol){
      unitConversion(token, data.released_quantity_unit_symbol, unit_symbol).then(
        (res) => {
          if (res.data.status.code == 404) {
            toast.error(res.data.status.description);
          } else {
            factorToRequired = res.data.output[0].conversion_factor;
            unitConversion(token, data.available_qty_symbol, unit_symbol).then(res=>{
              if (res.data.status.code == 404) {
                toast.error(res.data.status.description);
              } else{
                factorToAvailable=res.data.output[0].conversion_factor;
                compareQuantity(data,factorToRequired,factorToAvailable,formData[data.id].quantity,unit_symbol)
              }})
          }})

          
    }else{
      compareQuantity(data,factorToRequired,factorToAvailable,formData[data.id].quantity,unit_symbol);
    }
    // console.log("factor",factorToAvailable,factorToRequired,data.released_quantity_unit_symbol,data.available_qty_symbol,formData[data.id].unit)
    // compare quantity and calculate left quantity
  };

  const compareQuantity=(data,factorToRequired,factorToAvailable,value,unit)=>{
    // console.log("comp",value,unit,factorToRequired,factorToAvailable)
    if (data.released_quantity_value < value * factorToRequired) {
      quantityGreaterThanRequired(data.id,unit)
    } else if (data.available_qty < value * factorToAvailable) {
         quantityGreaterThanAvailable(data.id,unit)
        } else {
          const left_quantity =
            data.released_quantity_value - value * factorToRequired;
            // console.log("left",left_quantity,factorToRequired)

          setFormData({
            ...formData,
            [data.id]: { quantity: value , unit: unit },
          });
          handleProductionOrder(
            value ,
            data.id,
            data.product_code,
            unit,
            data.product_description,
            data.item_id,
            data.ItemType,
            left_quantity,
            data.released_quantity_unit_symbol
          );
        }   
  }

  const quantityGreaterThanAvailable=(id,unit)=>{
    toast.warning("Entered Quantity exceeds the Available Quantity! ");
    setFormData({ ...formData, [id]: { quantity: "", unit: unit } });
    removeProductionOrderItem(id);
  }

  const quantityGreaterThanRequired=(id,unit)=>{
    toast.warning("Entered Quantity exceeds the Required Quantity! ");
    setFormData({ ...formData, [id]: { quantity: "", unit: unit } });
    removeProductionOrderItem(id);
  }

  const handleBOMQuantity = (value, data) => {
    if (value > data.released_quantity_value) {
      quantityGreaterThanRequired(data.id,'Nos');
    } else if (value > data.available_qty) {
      quantityGreaterThanAvailable(data.id,'Nos')
    } else {
      const left_quantity = data.released_quantity_value - value;
      // console.log(left_quantity);
      setFormData({ ...formData, [data.id]: { quantity: value, unit: "Nos" } });
      handleProductionOrder(
        value,
        data.id,
        data.product_code,
        "Nos",
        data.product_description,
        data.item_id,
        data.ItemType,
        left_quantity,
        "Nos"
      );
    }
  };

  const handleProductionOrder = (
    value,
    id,
    item_name,
    symbol,
    item_description,
    item_id,
    items_type,
    left_qty,
    left_qty_symbol
  ) => {
    var productList = productionOrderList.production_order_item;
    const index = productList.findIndex((el) => el.item_id == item_id);

    if (index == -1) {
      productList.push({
        production_order_items: id,
        quantity: value + " " + symbol,
        item_name: item_name,
        item_id: item_id,
        items_type: items_type,
        item_description: item_description,
        left_qty: left_qty + " " + left_qty_symbol,
      });
    } else {
      productList[index].quantity = value + " " + symbol;
      productList[index].left_qty= left_qty + " " + left_qty_symbol;
    }
    // console.log("product", productList);
    setProductionOrderList({
      ...productionOrderList,
      production_order_item: productList,
    });
    localStorage.setItem(
      "stock_out_list",
      JSON.stringify({
        ...productionOrderList,
        production_order_item: productList,
      })
    );
  };

  const removeProductionOrderItem = (id) => {
    const list = productionOrderList.production_order_item.filter(
      (el) => el.production_order_items != id
    );

    setProductionOrderList({
      ...productionOrderList,
      production_order_item: list,
    });
  };

  const stockOut = () => {
    if (productionOrderList.production_order_item.length > 0) {
      localStorage.setItem("production_order_id", productionOrderId);
      Router.push("/stockOut");
    } else {
      toast.warning("No Items are Added!");
    }
  };

  return (
    <div>
      <Head>
        <title>Inverted</title>
        <link rel="icon" href="/logo icon 2-01.png" />
      </Head>
      {/* {size.width > "600" ? <Sidebar /> : <Header show={true} />} */}
      <div className="order_details_page">
        <ToastContainer />
        <div className="order_title">
          <div className="title">Orders</div>
          <div className="sub_title">Database for all Available Stocks</div>
        </div>
        <div className="order_details">
          <div className="order_header">
            <div
              className="rows"
              style={{ color: "#6B6B6B", marginBottom: "1rem" }}
            >
              <div style={{ width: "25%" }}>Order No.</div>
              <div style={{ width: "25%" }}>Date</div>
              <div style={{ width: "25%" }}>Created By</div>
              <div style={{ width: "25%" }}>Status</div>
            </div>
            <div className="rows" style={{ color: "#3F5575" }}>
              <div style={{ width: "25%" }}>
                {orderNumber ? orderNumber : null}
              </div>
              <div style={{ width: "25%" }}>{date ? date : null}</div>
              <div style={{ width: "25%" }}>{createdBy ? createdBy : null}</div>
              <div style={{ width: "25%" }}>{status=='Created'?<div className="pending_status_style">Created</div>:<div>{status=='Partial Processed'?<div className="partial_status_style">Partially Processed</div>:<div className="completed_status_style">Completed</div>}</div>}</div>
            </div>
          </div>

          {(status == "Completed" || !showDetails)? null : (
            <div className="order_details_subheader">
              Your Orders
              <button onClick={stockOut}>Stock Out</button>
            </div>
          )}
          {(status == "Completed" || !showDetails)? (<div>{showDetails?null:<div className="no_item">No Items Found</div>}</div>) : (<div className="order_detail_table">
          {orderItem ? (
            <div>
              <div className="po_detail_part_header rows">
                <div style={{ width: "10%" }}>TYPE</div>
                <div style={{ width: "15%" }}>ID</div>
                <div style={{ width: "25%" }}>DESCRIPTION</div>
                <div style={{ width: "15%" }}>REQUIRED QUANTITY</div>
                <div style={{ width: "30%" }}>STOCK RELEASED</div>
                <div style={{ width: "5%" }}></div>
              </div>
              {orderItem.map((part, index) => {
                return (
                  <div
                    key={index}
                    className="po_detail_part_rows"
                    style={{ color: "#3F5575" }}
                  >
                    <div style={{ width: "10%" }}>{part.ItemType}</div>
                    <div style={{ width: "15%" }}>{part.product_code}</div>
                    <div style={{ width: "25%" }}>
                      {part.product_description}
                    </div>
                    <div style={{ width: "15%" }}>
                      {part.released_quantity_value}{" "}
                      {part.released_quantity_value == 0
                        ? null
                        : part.released_quantity_unit_symbol}{" "}
                      / {part.quantity_value} {part.quantity_symbol}
                    </div>
                    <div style={{ width: "30%", paddingLeft: "5%" }}>
                      {part.released_quantity_value > 0 ? (
                        <div style={{ display: "flex" }}>
                          {part.ItemType == "BOM" ? (
                            <input
                              type="number"
                              style={{ border: border }}
                              className="quantity_field"
                              placeholder="Enter Quantity"
                              value={formData[part.id].quantity}
                              onChange={(e) => {
                                handleBOMQuantity(e.target.value, part);
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                width: size.width > "600" ? "70%" : "90%",
                                border: "#e5e5e5 solid 0.1em",
                                borderRadius: "5px",
                              }}
                            >
                              <input
                                style={{
                                  width: "70%",
                                  height: "3rem",
                                  border: "none",
                                }}
                                className="quantity"
                                type="number"
                                value={formData[part.id].quantity}
                                onChange={(e) =>
                                  handleQuantity(e.target.value, part)
                                }
                                placeholder="0.00"
                              />
                              <div
                                style={{
                                  borderLeft: "#e5e5e5 solid 0.1em",
                                }}
                              />
                              {part.unit_name_list ? (
                                <Dropdown
                                  options={part.unit_name_list}
                                  isUnitList="true"
                                  placeholder="Unit"
                                  width="30%"
                                  name="symbol"
                                  minWidth="9rem"
                                  no_outline={true}
                                  parentCallback={(data) => {
                                    handleUnit(data.symbol, part);
                                  }}
                                  value={formData[part.id].unit}
                                  dropdownWidth={
                                    size.width > "600" ? "11vw" : "40vw"
                                  }
                                  searchWidth={
                                    size.width > "600" ? "8vw" : "30vw"
                                  }
                                  height="3rem"
                                />
                              ) : null}
                            </div>
                          )}
                          <span
                            className="available_quantity"
                            style={{ textAlign: "left",width:'30%',color:formData[part.id].isGreater?"#33B850":"#EB2129" }}
                          >
                            *{formData[part.id].isGreater?null:<span>Only</span>} {(part.available_qty==null || part.available_qty == undefined)?0:part.available_qty}{" "}
                            {part.available_qty_symbol} available
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div style={{ width: "5%" }}>
                    {part.released_quantity_value > 0 ?<FaTimes
                        title="Clear"
                        className="icon"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            [part.id]: { quantity: "", unit: "" },
                          });
                          removeProductionOrderItem(part.id);
                        }}
                      />:null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Spinner />
          )}
        </div>)}
        </div>

        {showDetails?<div className="parts_in_order">
          {partsInOrder ? (
            <Table
              columns={column1}
              rows={partsInOrder}
              width="100%"
              outOf={false}
            />
          ) : (
            <Spinner />
          )}
        </div>:null}

        {pastTransactions ? (
          <div>
            {pastTransactions.length != 0 ? (
              <div className="past_transaction">
                {" "}
                <div className="transaction_header">Past Transactions</div>
                <div
                  className="transaction_card common"
                  style={{
                    borderBottom: "#e5e5e5 solid 0.01em",
                    color: "#6b6b6b",
                    cursor: "default",
                  }}
                >
                  <div className="common" style={{ width: "33%" }}>
                    DATE
                  </div>
                  <div className="common" style={{ width: "33%" }}>
                    TRANSACTION ID
                  </div>
                  <div className="common" style={{ width: "33%" }}>
                    CREATED BY
                  </div>
                  {/* <div className='common' style={{width:'10%'}}></div> */}
                </div>
                {pastTransactions.map((transaction,index) => (
                  <Transactions
                    key={index}
                    date={transaction.date}
                    transaction_id={transaction.transaction_no}
                    created_by={transaction.created_by}
                    part_details={transaction.part_details}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetails;
