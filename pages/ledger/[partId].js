import Router from "next/router";
import Head from "next/head";
import { useState, useEffect} from "react";
import { useRouter } from "next/router";

import { FaFileContract, FaArrowLeft} from "react-icons/fa";
import Table from "../../components/table";
import Dropdown from "../../components/dropdown";
import {
  fetchPartByPartId,
  fetchLedgerByPartId,
  fetchVendorList,
  fetchUnitList,
  addNewLedger,
} from "../../services/stockInService";
import LedgerCard from "../../components/ledgerCard";

import Spinner from "../../components/spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const Ledger = () => {
  const router = useRouter();
  const today = new Date();


  const [showForm, setShowForm] = useState(false);
  const [ledger, setLedger] = useState(null);
  const [showLedger, setShowLedger] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [vendorList, setVendorList] = useState(null);
  const [unitList, setUnitList] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [shortDescription, setShortDescription] = useState(null);
  const [longDescription, setlongDescription] = useState(null);
  const [partQuantity, setPartQuantity] = useState(null);
  const [cardFilter, setCardFilter] = useState([]);


  const [partId, setPartId] = useState(router.query.partId);
  const [ledgerPart, setLedgerPart] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState(null);
  const [transaction, setTransaction] = useState("All Transaction Types");
  const [isButtonDisabled,setIsButtonDisabled] = useState(false);
  const [formData, setFormData] = useState({
    part: null,
    date: today,
    quantity: null,
    unit: null,
    transaction_type: null,
    document_id: null,
  });

  const [showPage, setShowPage] = useState(false);

  const columns = [
    { accessor1: "transaction_type", label: "Transaction Type", width: "18%", textalign: "center" },
    { accessor1: "date", label: "Date", width: "20%", textalign: "center" },
    {
      accessor1: "quantity",
      accessor2:"colored_quantity",
      label: "Quantity",
      width: "15%",
      textalign: "center",
    }, {
      accessor1: "quantity_left",
      label: "Balance Quantity",
      width: "17%",
      textalign: "center",
    },
    {
      accessor1: "document_id",
      accessor2:"vendor",
      label: "Document ID",
      width: "15%",
      textalign: "center",
    },
    {
      accessor1: "created_by",
      label: "Created By",
      width: "15%",
      textalign: "center",
    },
  ];

  const transactionTypes ={
    "DEBIT":"Stock Out" ,
    "CREDIT": "Stock In" ,
    "LINE_LOSS" : "Loss On Line" ,
    "PROD_RETURN": "Production Return"  ,
    "ADJ_PLUS": "Positive Adjustment"  ,
    "ADJ_MINUS": "Negative Adjustment" ,
    "QUALITY_REJECT": "Quality Reject" ,

 }

  const notifySuccessPost = () =>
    toast.success("New Ledger Added Successfully");
    // console.log(router.query)

  useEffect(() => {
    // fetch data only if token is defined or redirect to login
    if (localStorage.getItem("token") != null) {
      const token = localStorage.getItem("token");
      const partId = router.query.partId;
      setToken(token);
      if (partId != null || partId != undefined) {
        setLedgerPart(partId);
        fetchPartByPartId(partId, token).then((res) => {
          setShortDescription(res.data[0].short_description);
          setlongDescription(res.data[0].long_description);
          setPartQuantity(res.data[0].quantity);
          setFormData({...formData,part:res.data[0].id,unit:res.data[0].quantity.split(" ")[1]})
        });

        fetchVendorList(token).then((res) => {
          setVendorList(res.data);
        });
        fetchUnitList(token).then((res) => setUnitList(res.data));
        fetchLedgerByPartId(partId, token).then((res) => {
          var ledger_list=[];
          res.data.data.output.map((ledger_item)=>{
            var item=ledger_item;
          item.transaction_type = transactionTypes[ledger_item.transaction_type]
          ledger_list.push(item)
          })

          setLedger(ledger_list);
          setShowLedger(true);
          setShowPage(true);
        });
      }
    } else {
      Router.push("/login");
    }
  }, [router.query.partId]);

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

  //   submit new ledger only if all values are entered
  const submitPartHandler = async () => {
    setLoading(true);
        setIsButtonDisabled(true);
      const date =moment(formData.date).format('YYYY-MM-DD')

      const data = [
        {
          date: date,
          quantity: formData.quantity + " " + formData.unit,
          transaction_type: formData.transaction_type,
          document_id: formData.document_id,
          part: formData.part,
        },
      ];

      // console.log(formData)
      const res = await addNewLedger(data, token)
        
          // fetch list of ledgers again
if(res.status == 200){
    fetchLedgerByPartId(ledgerPart, token)
    .then((res) => {
      var ledger_list=[]
      res.data.data.output.map((ledger_item)=>{
        var item=ledger_item;
        item.transaction_type = transactionTypes[ledger_item.transaction_type]
        ledger_list.push(item)
      })
        setLedger(ledger_list);
    })
    .catch((err) => toast.error(err.message));
    fetchPartByPartId(ledgerPart, token).then((res) => {
        setPartId(res.data[0].id);
        setShortDescription(res.data[0].short_description);
        setlongDescription(res.data[0].long_description);
        setPartQuantity(res.data[0].quantity);
        setFormData({...formData,unit:res.data[0].quantity.split(" ")[1]})
      });
      setIsButtonDisabled(false);
  notifySuccessPost();
  cancelPartHandler()
}else{
    setIsButtonDisabled(false);
    toast.error(res.data.status.description);

}
        

  };

  // search feature in cards list
  const searchCard = (event) => {
    const search = event.target.value;
    // console.log(search);
    if (search !== undefined) {
      const filterTable = ledger.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(search.toLowerCase())
        )
      );
      setCardFilter([...filterTable]);
    } else {
      setLedger([...ledger]);
      setCardFilter([...ledger]);
    }
  };

  // cancel button of ledger form
  const cancelPartHandler = () => {
    setShowForm(false);
    setFormData({...formData,
      date: today,
      quantity: null,
      transaction_type: null,
      document_id: null,
    });
  };

  const status = [
    { name: "Loss on Line", value: "LINE_LOSS" },
    { name: "Production Return", value: "PROD_RETURN" },
    { name: "Positive Adjustment", value: "ADJ_PLUS" },
    { name: "Negative Adjustment", value: "ADJ_MINUS" },
    { name: "Quality Reject", value: "QUALITY_REJECT" },
  ];
  const searchStatusList = [
    { name: "Stock In", value: "Stock In" },
    { name: "Stock Out", value: "Stock Out" },
    { name: "Loss on Line", value: "Loss on Line" },
    { name: "Production Return", value: "Production Return" },
    { name: "Positive Adjustment", value: "Positive Adjustment" },
    { name: "Negative Adjustment", value: "Negative Adjustment" },
    { name: "Quality Reject", value: "Quality Reject" },
  ];

  
  console.log("status", transaction,searchStatus);
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
                parentCallback={(data) => 
                  setFormData({ ...formData, transaction_type: data.value })
                }
                width={size.width > "600" ? "70%" : "100%"}
                dropdownWidth={size.width > "600" ? "16vw" : "70vw"}
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
              onChange={(e) =>
                setFormData({ ...formData, document_id: e.target.value })
              }
              className="ledger_input"
            />
          </div>
          <div className="field_width">
            {size.width > "600" ? <label>Date:</label> : null}
            <DatePicker
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter Date"
              selected={formData.date}
              onChange={(date) =>  setFormData({ ...formData, date: date })}
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
                    ? setFormData({ ...formData, quantity: "" })
                    : setFormData({ ...formData, quantity: e.target.value });
                }}
                onWheel={ event => event.currentTarget.blur() }
                placeholder="0.00"
                value={formData.quantity}
              />
              <Dropdown
                width="50%"
                searchPlaceholder="Search Unit"
                isUnitList="true"
                options={unitList}
                name="symbol"
                dropdownWidth={size.width > "600" ? "11vw" : "55vw"}
                parentCallback={(data) => setFormData({ ...formData, unit: data.symbol })}
                border={true}
                value={formData.unit}
              />
            </div>
          </div>
          {/* {['DEBIT','CREDIT',null].includes(selectedStatus)?<div className='field_width'>{size.width>'600'?<label>Price:</label>:null}
                <input placeholder="Enter Price" style={{marginTop:'0', height:"3rem"}} type="number" className='ledger_input'
                onChange={(e)=>setPrice(e.target.value)}/></div>:null} */}

          {/* {selectedStatus != 'LOSS'?<div className="field_width">
               {size.width>'600'?<div> Vendor:</div>:null}
                <Dropdown width={size.width>'600'?'70%':'100%'} placeholder='Select Vendor' name="name" options={vendorList} height="3rem"
            parentCallback={(data)=>setVendor(data.id)} dropdownWidth={size.width>'600'?'16vw':'70vw'} border={true}/></div>:null} */}
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
              disabled={!formData.quantity || !formData.part || !formData.document_id || !formData.unit || !formData.transaction_type || isButtonDisabled}
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

  // load page only after fetching all apis
  let ledgerPage = <Spinner />;
  if (showPage) {
    ledgerPage = (
      <div>
        <Head>
          <title>Inverted</title>
          <link rel="icon" href="/logo icon 2-01.png" />
        </Head>
        {/* {size.width > "600" ? <Sidebar /> : <Header show="true" />} */}
        <div className="ledger_page">
          <ToastContainer />
          <div className="part_details">
            <div style={{ width: "20%",display:'flex' }}>
              {ledgerPart ? (
                <div className="part_id1">
                  #{ledgerPart}
                </div>
              ) : null}
            </div>
            <div className="part_desc" style={{ width: "60%" }}>
              <div className="desc_title">
                <div style={{ display: "flex" }}>
                  <FaFileContract />
                  {shortDescription ? shortDescription : null}{" "}
                </div>
              </div>
              <div className="ledger_longdesc">
                {longDescription ? longDescription : null}
              </div>
            </div>

            <div className="ledger_quantity" style={{ width: "20%" }}>
              {partQuantity ? partQuantity : null}
            </div>
          </div>

          <div className="body">
            <div className="body_header">
              <div className="ledger_title" style={{width:"20%"}} onClick={()=>Router.back()}><FaArrowLeft title="Back" style={{marginRight:'10px'}}/>Ledger</div>
              {/* <input placeholder="Search.." value={searchText} 
                        className="ledger_search" 
                        onChange={(e) => {setSearchText(e.target.value);searchCard(e)}}/>
                        <FaTimes size={15} className="ledger_clear_icon" title="Clear" onClick={()=>setSearchText('')}/> */}
              <div  style={{width:'60%'}}>
              <Dropdown
                allItems="All Transaction Types"
                searchPlaceholder="Search Transaction Types"
                options={searchStatusList}
                name="name"
                parentCallback={(data) => {setSearchStatus(data.value);setTransaction(data.name)}}
                width={size.width > "600" ? "40%" : "60%"}
                dropdownWidth={size.width > "600" ? "16vw" : "70vw"}
                border={true}
                value={transaction}
              /></div>
              <div style={{width:"20%",display:'flex',justifyContent:'end'}}>
              <button
                onClick={() => {
                  setShowForm(true);
                }}
              >
                Add
              </button></div>
            </div>

            <div className="ledger_table">
              {form}

              {size.width > "600" ? (
                <div>
                  {ledger ? (
                    <Table
                      key={ledger.length}
                      rows={ledger}
                      columns={columns}
                      search={searchText}
                      width="77vw"
                      filter={searchStatus}
                      filterIn="transaction_type"
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          {size.width < "600" ? (
            <div className="ledger_cards_list">
              <div className="ledger_card_header">
                <div style={{ width: "25%" }} className="card_items">
                  Status
                </div>
                <div style={{ width: "15%" }} className="card_items">
                  Date
                </div>
                <div style={{ width: "15%" }} className="card_items">
                  Quantity
                </div>
                <div style={{ width: "25%" }} className="card_items">
                  Vendor
                </div>
                <div style={{ width: "20%" }} className="card_items">
                  Document ID
                </div>
              </div>
              {searchText != undefined
                ? cardFilter.map((card,index) => (
                    <LedgerCard
                      key={index}
                      status={card.transaction_type}
                      date={card.date}
                      quantity={card.quantity}
                      vendor={card.vendor_name}
                    />
                  ))
                : ledger.map((card,index) => (
                    <LedgerCard
                      key={index}
                      status={card.transaction_type}
                      date={card.date}
                      quantity={card.quantity}
                      vendor={card.vendor_name}
                      documentId={card.document_id}
                    />
                  ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return <div>{ledgerPage}</div>;
};

export default Ledger;
