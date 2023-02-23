import Dropdown from "../../components/dropdown";
import Router from "next/router";
import Head from "next/head";
import OrderList from "../../components/orderList";

import Table from '../../components/table';
import {FaTimes} from 'react-icons/fa';
import { useState, useEffect } from "react";

import { fetchProductionOrderList } from "../../services/productionOrderService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Ledger = ()=> {

    
    const [searchText,setSearchText]= useState(null);
    const [filterOnStatus,setFilterOnStatus]= useState(null);
    const [token,setToken]= useState(null);
    const [orderType,setOrderType]= useState('All');
    const [productionOrderList,setProductionOrderList]= useState(null);
    const [showForm,setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const [quantity, setQuantity] = useState(null);
  const [unit, setUnit] = useState(null);
  const [price, setPrice] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [partId, setPartId] = useState(null);
  const [vendorList, setVendorList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [isButtonDisabled,setIsButtonDisabled] = useState(false);




    const status=[{name:'Completed',id:'Completed'},{name:'Partially Processed',id:'Partial Processed'},{name:'Created',id:'Created'}]

    const columns = [
        { accessor1: 'production_order_no', label: 'Order Number' ,width:"20%", textalign:"center"},
        { accessor1: 'date' ,label: 'Date' ,width:"20%", textalign:"center"},
        { accessor1: 'created_by', label: 'Created By',width:"30%" , textalign:"center"}, 
        { accessor1: 'status',prefix:'<div className="status_style" >',suffix:'</div>', label: 'Status',width:"30%" , textalign:"center"},  
      ];

    // calculate screen size
    function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
      
        useEffect(() => {
      
          if (typeof window !== 'undefined') {
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

    //   submit new ledger only if all values are entered
  const submitPartHandler = async () => {
    setLoading(true);
    if (selectedStatus === null) {
      toast.warning("Enter Status!");
      return;
    } else if (invoice === null) {
      toast.warning("Enter Invoice!");
      return;
    } else if (selectedDate === null) {
      toast.warning("Enter Date!");
      return;
    } else if (unit === null) {
      toast.warning("Enter Unit!");
      return;
      // }else if(price === null){
      //     toast.warning("Enter Price!")
      //     return;
    } else if (quantity === null) {
      toast.warning("Enter Quantity!");
      return;
      // }else if(vendor === null){
      //     toast.warning("Enter Vendor!")
      //     return;
    } else {
        setIsButtonDisabled(true);
      const date =
        selectedDate.getFullYear() +
        "-" +
        (selectedDate.getMonth() + 1) +
        "-" +
        selectedDate.getDate();

      const formData = [
        {
          date: date,
          quantity: quantity + " " + unit,
          transaction_type: selectedStatus,
          vendor: vendor,
          document_id: invoice,
          part: partId,
        },
      ];
      const res = await addNewLedger(formData, token)
    //   console.log("res",res);
        
          // fetch list of ledgers again
if(res.status == 200){
    fetchLedgerByPartId(ledgerPart, token)
    .then((res) => {
        const sorted = [...res.data.data.output].reverse();
        setLedger(sorted);
    })
    .catch((err) => toast.error(err.message));
    fetchPartByPartId(ledgerPart, token).then((res) => {
        setPartId(res.data[0].id);
        setShortDescription(res.data[0].short_description);
        setlongDescription(res.data[0].long_description);
        setPartQuantity(res.data[0].quantity);
        setUnit(res.data[0].quantity.split(" ")[1]);
      });
      setIsButtonDisabled(false);
  notifySuccessPost();
  cancelPartHandler()
}else{
    setIsButtonDisabled(false);
    toast.error(res.data.status.description);

}
        

        
    }
  };

    let form = null;

  // ledger form visible on clicking add button
  if (showForm) {
    form = (
      <div className="ledger_form">
        <div className="ledger_form_row ledger_form_content">
          <div className="field_width">
            {size.width > "600" ? <div>Status:</div> : null}
            <div>
              <Dropdown
                searchPlaceholder="Search Status"
                options={status}
                name="name"
                parentCallback={(data) => setSelectedStatus(data.value)}
                width={size.width > "600" ? "70%" : "100%"}
                dropdownWidth={size.width > "600" ? "16vw" : "70vw"}
                searchWidth={size.width > "600" ? "13vw" : "60vw"}
                height="3rem"
                border={true}
              />
            </div>
          </div>
          <div className="field_width">
            {size.width > "600" ? <label>Document ID:</label> : null}
            <input
              style={{
                marginTop: "0",
                height: "3rem",
                width: size.width > "600" ? "70%" : "100%",
              }}
              placeholder="Enter Document ID"
              onChange={(e) => setInvoice(e.target.value)}
              className="ledger_input"
            />
          </div>
          <div className="field_width">
            {size.width > "600" ? <label>Date:</label> : null}
            <DatePicker
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter Date"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          <div className="field_width">
            {size.width > "600" ? <label>Quantity:</label> : null}
            <div style={{ display: "flex" }} className="ledger_input">
              <input
                type="number"
                style={{
                  marginTop: "0",
                  width: "50%",
                  height: "3rem",
                  marginRight: size.width > "600" ? "1rem" : "0.5rem",
                }}
                onChange={(e) => {
                  e.target.value < 0
                    ? setQuantity("")
                    : setQuantity(e.target.value);
                }}
                placeholder="0.00"
                value={quantity}
              />
              <Dropdown
                width="50%"
                searchPlaceholder="Search Unit"
                isUnitList="true"
                options={unitList}
                name="symbol"
                dropdownWidth={size.width > "600" ? "11vw" : "55vw"}
                searchWidth={size.width > "600" ? "8vw" : "47vw"}
                height="3rem"
                parentCallback={(data) => setUnit(data.symbol)}
                border={true}
                value={unit}
              />
            </div>
          </div>
          {/* {['DEBIT','CREDIT',null].includes(selectedStatus)?<div className='field_width'>{size.width>'600'?<label>Price:</label>:null}
                <input placeholder="Enter Price" style={{marginTop:'0', height:"3rem"}} type="number" className='ledger_input'
                onChange={(e)=>setPrice(e.target.value)}/></div>:null} */}

          {/* {selectedStatus != 'LOSS'?<div className="field_width">
               {size.width>'600'?<div> Vendor:</div>:null}
                <Dropdown width={size.width>'600'?'70%':'100%'} placeholder='Select Vendor' name="name" options={vendorList} height="3rem"
            parentCallback={(data)=>setVendor(data.id)} dropdownWidth={size.width>'600'?'16vw':'70vw'} searchWidth={size.width>'600'?'13vw':'60vw'} border={true}/></div>:null} */}
        </div>
        <div className="ledger_form_footer">
          <div className="ledger_button">
            <button
              className="cancel_button button2 expand"
              onClick={() => {
                cancelPartHandler();
              }}
            >
              Cancel
            </button>
            <button
            disabled={isButtonDisabled}
              className="save_button button2 expand"
              onClick={submitPartHandler}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            <div className="order_page">
                <div className="order_title">
                <div className="title">Ledger</div>
                     <div className="sub_title">Database for all Ledgers</div>
                    </div> 
                <div className="order_section">
                    <Dropdown options={status} allItems="true"  placeholder="Select Status" name="name" width="15vw" height="3.5rem" border={true}
                    parentCallback={(data)=>{setFilterOnStatus(data.id);setOrderType(data.name)}} dropdownWidth={size.width>'600'?'15vw':'30vw'} searchWidth={size.width>'600'?'12vw':'22vw'} backGround="#F6F7FB" value={orderType}/>
                    <input placeholder="Search.." style={{height:'3.5rem',marginLeft:'2rem',width:'70%',background:"#F6F7FB"}} value={searchText} onChange={(e)=>setSearchText(e.target.value)}/><div><FaTimes className="clear_icon" title="Clear" onClick={()=>setSearchText('')}/></div>
                </div>

                <div style={{marginTop:'2rem',justifyContent:'space-between'}} className="order_section">
                    <div className="order_subtitle">Your Transaction Details</div>
                    <div></div>
                    <button className="order_button" onClick={()=>setShowForm(true)}>Add</button>
                </div>

                
                
                {size.width<'600'?<div className="order_list_header">
                  <div className="order_list_content" style={{paddingLeft:'1rem'}}>Order Number</div>
                  <div className="order_list_content">Date</div>
                  <div className="order_list_content">Created By</div>
                  <div className="order_list_content">Status</div>
                </div>:null}

                {form}

                     

                     
                     </div>
        </div>
  );
}

export default Ledger;
