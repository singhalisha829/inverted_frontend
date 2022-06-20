import Router from 'next/router';
import Head from 'next/head';
import { useState, useEffect,useRef} from 'react';

import Sidebar from '../components/sidebar';
import { FaFileContract, FaPlus, FaTrashAlt, FaSistrix } from 'react-icons/fa';
import Table from '../components/table';
import Dropdown from '../components/dropdown';
import Header from '../components/header';
import { fetchPartByPartId, fetchLedgerByPartId, fetchVendorList, fetchUnitList, addNewLedger } from '../services/ledgerService';

import Spinner from '../components/spinner';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ledger =(props)=>{
    
    const [showForm, setShowForm]= useState(false);
    const [ledger,setLedger]= useState(null);
    const [showLedger, setShowLedger] = useState(false);

    const[selectedDate, setSelectedDate]= useState(null);
    const [vendorList, setVendorList]= useState(null);
    const [unitList, setUnitList]= useState(null);
    const [searchText, setSearchText]= useState(null);
    const [shortDescription, setShortDescription]= useState(null);
    const [longDescription, setlongDescription]= useState(null);
    const [partQuantity, setPartQuantity]= useState(null);


    const [selectedStatus,setSelectedStatus]=useState(null);
    const [invoice,setInvoice]=useState(null);
    const [quantity,setQuantity]=useState(null);
    const [unit, setUnit]= useState(null);
    const [price,setPrice]=useState(null);
    const [vendor,setVendor]=useState(null);
    const [partId, setPartId]= useState(null);
    const [ledgerPart, setLedgerPart] = useState(null);
    const [token,setToken] = useState(null);

    const [showPage, setShowPage]= useState(false);

    
    const columns = [
        {accessor1: 'status', label: 'Status' ,width:"15%", textalign:"center"},
        {accessor1: 'date' ,label: 'Date',width:"25%", textalign:"center" },
        {accessor1: 'quantity', label: 'Quantity',width:"25%" , textalign:"center"},
        {accessor1:'vendor_name', label:'Vendor',width:"26%", textalign:"center"},
        {accessor1:'edit', width:"10%"}  
      ];

      const notifySuccessPost = () => toast.success("New Ledger Added Successfully");


    useEffect(()=>{
    // fetch data only if token is defined or redirect to login
    if(localStorage.getItem('token') != null){
    const token = localStorage.getItem('token')
    setToken(token)
    const partName= localStorage.getItem("partId");
    setLedgerPart(partName)

    fetchPartByPartId(partName,token).then(res=>{
        setPartId(res.data[0].id)
        setShortDescription(res.data[0].short_description)
        setlongDescription(res.data[0].long_description)
        setPartQuantity(res.data[0].quantity)})
        
    fetchVendorList(token).then(res=>{   
        setVendorList(res.data)})
    fetchUnitList(token).then(res=>setUnitList(res.data))
    fetchLedgerByPartId(partName,token)
    .then(res=>
        {setLedger(res.data);
        setShowLedger(true);
        setShowPage(true);
       })}else{
           Router.push('/login')
       }


    },[])

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
    const submitPartHandler = () =>{  
        const partName= localStorage.getItem("partId");

        console.log(selectedStatus,invoice,selectedDate,quantity,unit,price,vendor)
        if(selectedStatus != null && invoice != null && selectedDate !=null && quantity !=null && unit !=null && price != null && vendor !=null){
            setShowForm(false);
        const formData={
            date:selectedDate,
             quantity:quantity,
            transaction_type:selectedStatus,vendor:vendor,price:price,
            invoice:invoice,unit:unit,part:partId
        };
        console.log(formData)
        addNewLedger(formData,token).then(()=>{
            setSelectedDate(()=>'')

            // fetch list of ledgers again
            fetchLedgerByPartId(partName,token)
            .then(res=>
                setLedger(res.data));
                notifySuccessPost();
        }
        ).catch(function (err){
            console.log(err)
        })
        
    }else{

    }

    }


    // cancel button of ledger form
    const cancelPartHandler = () =>{
        setShowForm(false);
        setSelectedDate(()=>'')
    }

    const status=[{name:'Stock In', value:'CREDIT'},{name:'Stock Out', value:'DEBIT'}]
    let form = null;

    // ledger form visible on clicking add button
    if(showForm){
        form=(<div className="ledger_form">
            <div style={{display:'flex',marginBottom:'15px'}}>
                <div style={{width:"33%"}}>Status:
                <div >
                <Dropdown placeholder='Select Status' options={status} name="name" parentCallback={(data)=>setSelectedStatus(data.value)} width="70%"
                dropdownWidth="16vw" searchWidth="13vw"/></div>
                </div>
                <div style={{width:"33%"}}><label>Invoice:</label>
                    <input style={{marginTop:'0', height:"25px",width:'70%'}} placeholder='Enter Invoice' onChange={(e)=>setInvoice(e.target.value)}/></div>
                <div style={{width:"33%"}}><label>Date:</label>
                            <DatePicker placeholderText='Enter Date' selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
    
                        </div>
                </div>
            <div style={{display:"flex",marginBottom:'15px'}}>
                <div style={{width:'33%'}}><label>Part Name:</label>
                    <div style={{color:'#3F5575', width:'70%'}}><strong>{shortDescription?shortDescription:null}</strong></div>
                </div>
                <div style={{width:"33%"}}><label>Quantity:</label>
                    <div style={{display:'flex',width:'70%'}}>
                    <input type="number" style={{marginTop:'0', width:'30%', height:"27.5px", marginRight:"10px"}}    
                    onChange={(e)=>setQuantity(e.target.value)} />
                    <Dropdown width="70%" placeholder='Select Unit' options={unitList} name="name" dropdownWidth="11vw" searchWidth="8vw"
                    parentCallback={(data)=>setUnit(data.symbol)}/></div>
                </div>
                <div style={{width:'33%'}}><label>Price:</label><input placeholder="Enter Price" style={{marginTop:'0', height:"25px",width:'70%'}} type="number"
                onChange={(e)=>setPrice(e.target.value)}/></div>
            </div>
            <div style={{display:"flex",justifyContent:'space-between'}}><div style={{width:"33%"}}>
                Vendor:<Dropdown width="70%" placeholder='Select Vendor' name="name" options={vendorList} 
            parentCallback={(data)=>setVendor(data.id)} dropdownWidth="16vw" searchWidth="13vw"/></div>
            <div className='ledger_button'><button style={{backgroundColor:"white", color:"#ACB3BF",border:"#ACB3BF solid 0.15em", fontSize:"15px",height:'40px'}}
                       onClick={()=>{cancelPartHandler()}}>Cancel</button>
                       <button style={{backgroundColor:"#33B850", fontSize:"15px",height:"40px"}}
                       onClick={submitPartHandler}>Save</button>
                       </div></div>
        </div>);
        }


    // load page only after fetching all apis
    let ledgerPage= <Spinner />;
    if(showPage){
        ledgerPage=(<div className='layout'>
            <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            {size.width>'600'?<Sidebar /> : <Header />}
        <div className="ledger_page" >
            <ToastContainer />
        <div className="part_details">
    
                {ledgerPart?<div className="part_id1">#{localStorage.getItem('partId')}</div>:null}
                <div className="part_desc">
                    <div className='desc_title'>
                <div style={{display:'flex'}}><FaFileContract/>
                {shortDescription?<div>{shortDescription?shortDescription:null}</div>:null} </div>
                </div>
                <div className='ledger_longdesc'>{longDescription?longDescription:null}</div>
                </div>

                <div className='ledger_quantity' >{partQuantity? partQuantity:null}</div></div>

                <div className='body'>
                <div className="body_header">
                <div className='ledger_title'>Ledger</div>
                <input placeholder="Search for code or name" value={searchText} 
                        style={{width: "70%",height: "44px",background: "#F6F7FB",
                          border: "1px solid #E5E5E5",boxSizing: "border-box",boxShadow: "0px 2px 1px rgba(225, 228, 237, 0.2)",
                          borderRadius: "3px", paddingLeft:'10px'}}
                        onChange={(e) => {setSearchText(e.target.value)}}/>
                        <FaSistrix size={17} style={{color:"#3F5575",right:'17%', position:"absolute"}}/>
                <button style={{height:'4rem'}} onClick={() =>{setShowForm(true)}}><FaPlus size={13}/> Add</button></div>

                <div className="ledger_table">
                    {form}
                    
                    {showLedger?<div><Table key={ledger.length} rows={ledger} columns={columns} search={searchText} width="77vw"/></div>:<Spinner/>}</div>
                </div>
                </div>   
            </div>)
    }

    return(
        <div>
            {ledgerPage}
            </div>
    )
}

export default Ledger;