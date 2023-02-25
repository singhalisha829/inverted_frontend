import Dropdown from "../../components/dropdown";
import Router from "next/router";
import Head from "next/head";
import Spinner from "../../components/spinner";
import moment from "moment";

import Table from "../../components/table";
import { FaTimes , FaExternalLinkAlt} from "react-icons/fa";
import { useState, useEffect } from "react";

import { fetchLedger,  fetchUnitList ,  addNewLedger, fetchPartById} from "../../services/stockInService";
import { fetchPartTypeList,  fetchPartsList} from "../../services/dashboardService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import List from "../../components/list";

import ReactHtmlTableToExcel from "react-html-table-to-excel";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Ledger = () => {
  const today = new Date();
  const oneMonthAgo=new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const [searchText, setSearchText] = useState(null);
  const [filterOnStatus, setFilterOnStatus] = useState(null);
  const [token, setToken] = useState(null);
  const [transactionType, setTransactionType] = useState("All");
  const [transaction, setTransaction] = useState("All");
  const [ledgerList, setLedgerList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [partList, setPartList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [endDate, setEndDate] = useState(today);
  const [startDate, setStartDate] = useState(oneMonthAgo);
  const [partTypeList,setPartTypeList] = useState([]);
  const [partType,setPartType] = useState("All");
  const [formData,setFormData] = useState({
    part:null,
    date:today,
    quantity:null,
    unit:null,
    transaction_type:null,
    document_id:null
  })

  const transactionTypeList =[
    { name: "Debit", value: "DEBIT" },
    { name: "Credit", value: "CREDIT" },
    { name: "Loss On Line", value: "LINE_LOSS" },
    { name: "Production Return", value: "PROD_RETURN" },
    { name: "Positive Adjustment", value: "ADJ_PLUS" },
    { name: "Negative Adjustment", value: "ADJ_MINUS" },
    { name: "Quality Reject", value: "QUALITY_REJECT" },

  ]

  const columns = [
    {
      accessor1: "transaction_type",
      label: "Transaction Type",
      width: "20%",
      textalign: "center",
    },
    { accessor1: "date", label: "Date", width: "10%", textalign: "center" },
    { accessor1: "part",accessor2:"part_short_description", label: "Part ID", width: "20%", textalign: "center" },
    {
      accessor1: "quantity",
      label: "Quantity",
      width: "10%",
      textalign: "center",
    },
    {
      accessor1: "quantity_left",
      label: "Left Quantity",
      width: "10%",
      textalign: "center",
    },
    {
      accessor1: "document_id",
      label: "Document ID",
      width: "20%",
      textalign: "center",
    },
    {
      accessor1: "created_by",
      label: "Created By",
      width: "10%",
      textalign: "center",
    },
  ];

  const notifySuccessPost = () =>
  toast.success("New Ledger Added Successfully");

  useEffect(() => {
    async function fetch() {
      if (localStorage.getItem("token") != undefined) {
        const token = localStorage.getItem("token");

        //fetch part type list
        const partTypeList = await fetchPartTypeList(token);
        setPartTypeList(partTypeList.data)

        const partList = await fetchPartsList(token);
          setPartList(partList.data);

        const unitList = await fetchUnitList(token);
        setUnitList(unitList.data)

        setToken(token);
      } else {
        Router.push("/login");
      }
    }

    fetch();
  }, []);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    console.log(startDate,endDate)
    if(startDate != null && endDate != null){
      console.log("inside")
    async function fetch() {
        const data={
          start_date:moment(startDate).format('YYYY-MM-DD'),
          end_date:moment(endDate).format('YYYY-MM-DD')
        }
        console.log(data)

        // fetch ledger
        const ledger = await fetchLedger(token,data);
        setLedgerList([...ledger.data.data.output]);
        console.log(ledger.data.data.output)
    }
    fetch();

  }

  },[startDate,endDate])

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
    console.log(formData)
    if (formData.transaction_type === null) {
      toast.warning("Select Status!");
      return;
    } else if (formData.document_id === null) {
      toast.warning("Enter Invoice!");
      return;
    } else if (formData.date === null) {
      toast.warning("Enter Date!");
      return;
    } else if (formData.unit === null) {
      toast.warning("Enter Unit!");
      return;
    } else if (formData.quantity === null) {
      toast.warning("Enter Quantity!");
      return;
    } else {
      setIsButtonDisabled(true);
      console.log(formData.date)
      const date= moment(formData.date).format('YYYY-MM-DD')
      const data = [
        {
          date: date,
          quantity: formData.quantity + " " + formData.unit,
          transaction_type: formData.transaction_type,
          document_id: formData.document_id,
          part: formData.part,
        },
      ];
      const res = await addNewLedger(data, token);

      // fetch list of ledgers again
      if (res.status == 200) {
        async function fetch() {
          const data={
            start_date:moment(startDate).format('YYYY-MM-DD'),
            end_date:moment(endDate).format('YYYY-MM-DD')
          }

          const ledger = await fetchLedger(token,data);
          setLedgerList([...ledger.data.data.output]);
          console.log("After form",ledger.data.data.output)
          setIsButtonDisabled(false);
          notifySuccessPost();
          cancelPartHandler();
        }
        fetch();
    
      } else {
        setIsButtonDisabled(false);
        toast.error(res.data.status.description);
      }
    }
  };

  const cancelPartHandler = () => {
    setShowForm(false);
    setFormData({
      part:null,
      date:today,
      quantity:null,
      unit:null,
      transaction_type:null,
      document_id:null
    })
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleUnit= (data)=>{
    // fetchPartById(data.id, token).then((res) => {
    //   if (res.data.quantity != null || res.data.quantity != undefined) {
    //     setFormData({...formData,unit:res.data.quantity.split(" ")[1]});
    //   }
    // });

    // fetchDropdownUnitList(token, data.unit_type).then((res) => {
    //   setUnitList(res.data.data.output);
    // });
}

  let form = null;

  // ledger form visible on clicking add button
  if (showForm) {
    form = (
      <div className="ledger_form margin_auto">
        <div className="ledger_form_row ledger_form_content">
          <div className="field_width">
            {size.width > "600" ? <div>Status:</div> : null}
              <Dropdown
                searchPlaceholder="Search Status"
                options={transactionTypeList}
                name="name"
                parentCallback={(data) => setFormData({...formData,transaction_type:data.value})}
                width={size.width > "600" ? "70%" : "100%"}
                dropdownWidth={size.width > "600" ? "16vw" : "70vw"}
                border={true}
              />
          </div>
          <div className="field_width">
            {size.width > "600" ? <label>Part:</label> : null}
            <Dropdown
                searchPlaceholder="Search Part ID/Name"
                options={partList}
                isPartsList="true"
                name="short_description"
                parentCallback={(data) => {setFormData({...formData,part:data.id});handleUnit(data)}}
                width={size.width > "600" ? "70%" : "100%"}
                dropdownWidth={size.width > "600" ? "16vw" : "70vw"}
                border={true}
              />
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
              onChange={(e) => setFormData({...formData,document_id:e.target.value})}
              className="ledger_input"
            />
          </div>
          <div className="field_width" style={{paddingRight:'10%'}}>
            {size.width > "600" ? <label>Date:</label> : null}
            <DatePicker
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter Date"
              selected={formData.date}
              onChange={(date) => setFormData({...formData,date:date})}
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
                    ? setFormData({...formData,quantity:''})
                    : setFormData({...formData,quantity:e.target.value});
                }}
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
                parentCallback={(data) => setFormData({...formData,unit:data.symbol})}
                border={true}
                value={formData.unit}
              />
            </div>
          </div>
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

  let content = null;
  if (size.width > "600") {
    content = (
      <div>
      {ledgerList.length>0 ? (
        <Table
          id="ledgerTable"
          columns={columns}
          rows={ledgerList}
          search={searchText}
          filter1={transactionType}
          filterIn1="transaction_type"
          filter2={partType}
          filterIn2="part_type"
          cursor="pointer"
          width="77vw"
        />
      ) : (
        <Spinner />
      )}</div>
    )
  }else{
    content = ledgerList.length>0 ? (
      <List
        rows={ledgerList}
        search={searchText}
        filter={filterOnStatus}
        columns={columns}
      />
    ) : (
      <Spinner />
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
          <span style={{ width: "20%", marginRight: "2rem" }}>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select Date Range"
              onChange={handleDateChange}
            />
          </span>
          <span style={{ width: "15%", marginRight: "2rem" }}>
          <Dropdown
            options={transactionTypeList}
            allItems="true"
            searchPlaceholder="Search Transaction Type"
            name="name"
            width="100%"
            border={true}
            parentCallback={(data) => {
              setTransactionType(data.value);
              setTransaction(data.name);

            }}
            dropdownWidth={size.width > "600" ? "15vw" : "30vw"}
            value={transaction}
          /></span>
          {/* <span style={{ width: "15%", marginRight: "2rem" }}>
           <Dropdown
            options={partTypeList}
            allItems="true"
            searchPlaceholder="Search Status"
            name="name"
            width="100%"
            border={true}
            parentCallback={(data) => {
              setPartType(data.id);
            }}
            dropdownWidth={size.width > "600" ? "15vw" : "30vw"}
            value={partType}
          /></span> */}
          <span className="input-container">
          <input
            placeholder="Search.."
            style={{
              height: "3rem",
              width:'100%'
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
            <FaTimes
              title="Clear"
              color="#3F5575"
              onClick={() => setSearchText("")}
            />
          </span>

           {/* export parts table */}
           <div
            style={{ width: "10rem", marginRight: "1.5rem" }}
          >
            <ReactHtmlTableToExcel
              table="ledgerTable"
              filename="ledger_report"
              sheet="ledger_report"
              buttonText="Export"
              className="export_button"
            />
          </div>

          <div style={{marginTop:'0.5rem',marginLeft:"-2rem"}}>
            <FaExternalLinkAlt size={15} color= "#3F5575"  />
          </div>
        </div>

        <div
          style={{ marginTop: "2rem", justifyContent: "space-between" }}
          className="order_section"
        >
          <div className="order_subtitle">Your Transaction Details</div>
          <div></div>
          <button className="order_button" onClick={() => setShowForm(true)}>
            Add
          </button>
        </div>

        <div className="order_table">
        {form}

        {content}
        </div>

        {size.width < "600" ? (
          <div className="order_list_header">
            <div className="order_list_content" style={{ paddingLeft: "1rem" }}>
              Order Number
            </div>
            <div className="order_list_content">Date</div>
            <div className="order_list_content">Created By</div>
            <div className="order_list_content">Status</div>
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default Ledger;
