import Image from 'next/image';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import Head from 'next/head';

import Pattern from '../public/artboard.png';
import Sidebar from "../components/sidebar";
import Dropdown from '../components/dropdown';
import Modal from '../components/modal';
import { fetchPartsList,fetchPartTypeList } from '../services/dashboardService';
import List from '../components/stockInList';
import { fetchUnitList, fetchVendorList, addNewLedger } from '../services/ledgerService';
import Spinner from '../components/spinner';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCloudUploadAlt,FaCheckCircle, FaTimesCircle, FaPlus } from 'react-icons/fa';
import * as xlsx from "xlsx";
import Header from '../components/header';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StockIn=()=>{

    const [partList, setPartList]= useState(null);
    const [unitList, setUnitList]= useState(null);
    const [vendorList, setVendorList]= useState(null);
    const [selectedDate,setSelectedDate]= useState('');
    const [showPage, setShowPage] = useState(false);
    const [newPartList, setNewPartList]= useState([]);
    const [partTypeList, setPartTypeList] = useState(null);
    const [token,setToken] = useState(null);


    const [partName, setPartName]= useState(null);
    const [quantity, setQuantity]= useState('');
    const [showModal,setShowModal]= useState(false);
    const [error,setError]= useState(null);


    const [invoice, setInvoice]=  useState('');
    const [vendor, setVendor]= useState(null);
    const [unit, setUnit]= useState(null);
    const [price, setPrice]= useState('');
    
    const notifySuccess = () => toast.success("New Parts Added Successfully");


    useEffect(()=>{
    // fetch data only if token is defined or redirect to login
    if(localStorage.getItem('token') != null){
        const token= localStorage.getItem('token')
        setToken(token)
        fetchPartTypeList(token).then(res=>setPartTypeList(res.data))

        fetchPartsList(token).then((res)=>setPartList(res.data))
        fetchUnitList(token).then((res)=>setUnitList(res.data))
        fetchVendorList(token).then((res)=>setVendorList(res.data))
        setShowPage(true);
    }
    else{
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

    // remove the part from list on clicking the trash icon
    const handleDeleteNote=(id)=>{
        const newList=newPartList.filter((note) => note.part !== id);
        setNewPartList(newList)
    }

    // add new part in the list on clicking the check icon
    const submitHandler = () =>{
       console.log(invoice,selectedDate,vendor,partName,quantity,unit,price)
       if(partName!='' && invoice !='' && selectedDate!=''&&
       vendor!='' && quantity!='' && unit !=''&&
       price != ''){
       const data={
           part:partName,
           invoice:invoice,
           date:selectedDate,
           vendor:vendor,
           quantity:quantity,
           unit:unit,
           price:price,
           transaction_type:'CREDIT'
       };
        const newList=[data,...newPartList]
        setNewPartList(newList)
        setPartName(()=>"")
        setPrice("")
        setQuantity("")
        setUnit("")
        console.log(newList)
    }
    }

    // clear the form on clicking the cross icon
    const cancelHandler = () =>{
        setPartName(()=>"");
        setPrice(()=>"");
        setQuantity(()=>"");
        setUnit(()=>"");
    }

    // upload excel file
    const uploadFile=(e)=>{
        e.preventDefault();
    if (e.target.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = xlsx.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = xlsx.utils.sheet_to_json(worksheet);
            console.log(json);

        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
    }

    // submit the whole list on the server
    const submitPartsListHandler =() =>{
        for(let i=0;i<newPartList.length;i++){
            console.log(newPartList[i])
            addNewLedger(newPartList[i],token).then(res=>{ 
                setNewPartList([]);
                setSelectedDate(()=>'');
                setPartName(()=>"");
                setPrice(()=>"");
                setQuantity(()=>"");
                setUnit(()=>"");
                setVendor(()=>'');
                setInvoice(()=>'');

                 })
                //  .catch(err=> console.log(err))
        }
        // notifySuccess()

    }


    // stock in form
           const form=(<div className="form_content">
            <div style={{width:"15%", textAlign:"center"}}></div>
            <div style={{width:"30%",display:'flex',justifyContent:'center'}}>
            {partList?<Dropdown options={partList} placeholder="Select Part" width="60%" name="short_description" isAddNewPart partTypeList={partTypeList}
            parentCallback={(data)=>setPartName(data.id)} value={partName} height="3rem" minWidth="12rem" dropdownWidth="20vw" searchWidth="17vw"/>:null}</div>

            <div style={{width:'10%',display:'flex',justifyContent:'center'}}><input style={{width:"80%",height:"3rem"}} type="number" 
            onChange={(e)=>setPrice(e.target.value)} value={price}/></div>

            <div style={{width:"30%", display:'flex',justifyContent:'center'}}>
              <div style={{display:'flex',width:'70%',justifyContent:'space-between'}}>
            <input value={quantity} style={{width:"35%",marginRight:'10px',height:"3rem"}} type="number" onChange={(e)=>setQuantity(e.target.value)}/>
            {unitList?<Dropdown options={unitList} placeholder="Select Unit" width="60%" name="name" minWidth="9rem"
            parentCallback={(data)=>setUnit(data.symbol)} value={unit} dropdownWidth="11vw" searchWidth="8vw" height="3rem"/>:null}</div>
            </div>

            <div style={{width:"15%",display:'flex',justifyContent:'center'}}>
            <div className="icons1">
            <FaCheckCircle onClick={submitHandler} size={30} color="#33B850" cursor="pointer"/>
            <FaTimesCircle size={30} color="#F16B6B" onClick={cancelHandler} cursor="pointer"/>
            </div>
                </div>
                
                </div>
            );
        

    return(
        <div className="layout">
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
        {size.width>'600'?<Sidebar />: <Header />}
        <div className="stockin_page">
            <ToastContainer />
        <div className="stockin_title">
                <div className='title'>Available Stocks</div>
                     <div className='sub_title'>Database for all Available Stocks</div>
                    </div> 

                    <div className='stockin_subsection'>
                        <div style={{display:'flex',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
         <div className='stockin_subtitle'>Your Stock in Items</div>
                            {/* <button style={{marginRight:'1rem'}} className="upload_button" onClick={()=> setShowModal(true)}><FaCloudUploadAlt size={15}/> Upload</button> */}
                <button  className="add_button" onClick={submitPartsListHandler}><FaPlus />  Add</button>
                </div>

                <div className='stockin_form'>
                <div style={{width:"33%"}}><label>Invoice Number:</label><input style={{width:'60%',minWidth:'12rem',height:'3rem'}} onChange={(e)=> setInvoice(e.target.value)}/></div>
                <div style={{width:"33%"}}>Vendor:{vendorList?<Dropdown options={vendorList} placeholder="Select Vendor" width="60%" name="name" minWidth="12rem"
                parentCallback={(data)=>setVendor(data.id)} dropdownWidth="15vw" searchWidth="12vw" height="3rem"/>:null}</div>
                <div style={{width:"33%"}}><label>Date:</label>
                            <DatePicker placeholderText='Enter Date' selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        </div>
            </div>
            <div className='stockin_list_header'>
                <div style={{width:'15%',textAlign:'center'}}>Part ID</div>
                <div style={{width:'30%',textAlign:'center'}}>Part Name</div>
                <div style={{width:'10%',textAlign:'center'}}>Unit Price</div>
                <div style={{width:'30%',textAlign:'center'}}>Quantity</div>
                <div style={{width:'15%',textAlign:'center'}}></div>
            </div>
            {form}
            
                </div>

                {newPartList.map((l)=><List key={l.part} partId={l.part} quantity={l.quantity} unit={l.unit} price={l.price}
            deleteNote={(data)=>handleDeleteNote(data)}/>)}

            </div>
        <Modal show={showModal} modalClosed={()=>setShowModal(false)}>hiii
        <input type="file" name="file" onChange={(e)=>uploadFile(e)}/></Modal>
    </div>
    )
}

export default StockIn;