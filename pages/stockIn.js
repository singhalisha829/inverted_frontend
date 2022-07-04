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
       if(invoice=== null || invoice=== ''){
        toast.warning('Enter Invoice Number!');
        return;
       }else if(selectedDate=== null || selectedDate=== ''){
        toast.warning('Enter Date!');
        return;
       }else if(vendor=== null || vendor=== ''){
        toast.warning('Enter Vendor!');
        return;
       }else if(partName === '' || partName === null){
        toast.warning("Enter Part Name!");
        return;
       }else if(price === null || price === ''){
        toast.warning("Enter Unit Price!");
        return;
       }else if(quantity === null || quantity===''){
        toast.warning('Enter Quantity!');
        return;
       }else if(unit=== null || unit=== ''){
        toast.warning('Enter Unit!');
        return;
       }
       else{
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

    const padding=size.width<'600'?'1rem':null;

    // stock in form
           const form=(<div className="form_content">
            {size.width>'600'?<div style={{width:"15%", textAlign:"center"}}></div>:null}
            <div style={{width:size.width>'600'?'30%':'100%',display:'flex',justifyContent:'center',paddingBottom:padding}}>
            {partList?<Dropdown options={partList} placeholder="Select Part" width={size.width>'600'?'60%':'90%'} name="short_description" isAddNewPart partTypeList={partTypeList}
            parentCallback={(data)=>setPartName(data.id)} value={partName} height="3rem" minWidth="12rem" dropdownWidth={size.width>'600'?'20vw':'70vw'} searchWidth={size.width>'600'?"17vw":'60vw'}/>:null}</div>

            <div style={{width:size.width>'600'?'10%':'100%',display:'flex',justifyContent:'center',paddingBottom:padding}}><input style={{width:size.width>'600'?'80%':'90%',height:"3rem"}} type="number" placeholder={size.width<'600'?'Enter Unit Price':'0.00'}
            onChange={(e)=>setPrice(e.target.value)} value={price}/></div>

            <div style={{width:size.width>'600'?'30%':'100%', display:'flex',justifyContent:'center',paddingBottom:padding}}>
              <div style={{display:'flex',width:size.width>'600'?'70%':'90%',justifyContent:'space-between'}}>
            <input value={quantity} style={{width:"35%",marginRight:'10px',height:"3rem"}} type="number" onChange={(e)=>setQuantity(e.target.value)} placeholder={size.width<'600'?'Enter Quantity':null}/>
            {unitList?<Dropdown options={unitList} placeholder="Select Unit" width="60%" name="name" minWidth="9rem"
            parentCallback={(data)=>setUnit(data.symbol)} value={unit} dropdownWidth={size.width>'600'?"11vw":'40vw'} searchWidth={size.width>'600'?"8vw":'30vw'} height="3rem"/>:null}</div>
            </div>

            <div style={{width:size.width>'600'?'15%':'50%',display:'flex',justifyContent:'center'}}>
            <div className="icons1">
            <FaCheckCircle onClick={submitHandler} size={30} className="check_icon"/>
            <FaTimesCircle size={30} onClick={cancelHandler} className="cross_icon"/>
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
        {size.width>'600'?<Sidebar />: <Header show={true} />}
        <div className="stockin_page">
            <ToastContainer />
        <div className="stockin_title">
                <div className='title'>Stock In</div>
                     <div className='sub_title'>Add New Parts to Stock</div>
                    </div> 

                    <div className='stockin_subsection'>
                        <div style={{display:'flex',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
         <div className='stockin_subtitle'>Your Stock in Items</div>
                            {/* <button style={{marginRight:'1rem'}} className="upload_button" onClick={()=> setShowModal(true)}><FaCloudUploadAlt size={15}/> Upload</button> */}
                <button  className="add_button" onClick={submitPartsListHandler}><FaPlus />  Stock In</button>
                </div>

                <div className='stockin_form'>
                <div className='form_column'>
                    {size.width>'600'?<label>Invoice Number:</label>:null}
                    <input style={{width:size.width>'600'?'60%':'90%',minWidth:'12rem',height:'3rem'}} onChange={(e)=> setInvoice(e.target.value)} placeholder="Enter Invoice Number"/></div>
                <div className='form_column'>
                    {size.width>'600'?<label>Vendor: </label>:null}
                    {vendorList?<Dropdown options={vendorList} placeholder="Select Vendor" width={size.width>'600'?'60%':'90%'} name="name" minWidth="12rem"
                parentCallback={(data)=>setVendor(data.id)} dropdownWidth={size.width>'600'?"15vw":'70vw'} searchWidth={size.width>'600'?"12vw":'60vw'} height="3rem"/>:null}</div>
                <div className='date_column'>
                    {size.width>'600'?<label>Date:</label> : null}
                            <DatePicker placeholderText='Enter Date' selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        </div>
            </div>
            {size.width>'600'?<div style={{width:'100%'}}><div className='stockin_list_header'>
                <div style={{width:'15%',textAlign:'center'}}>Part ID</div>
                <div style={{width:'30%',textAlign:'center'}}>Part Name</div>
                <div style={{width:'10%',textAlign:'center'}}>Unit Price</div>
                <div style={{width:'30%',textAlign:'center'}}>Quantity</div>
                <div style={{width:'15%',textAlign:'center'}}></div>
            </div>
            {form}</div>:null}
            
</div>

            {size.width<'600'?<div className='stockin_form2'>
            {form}
              </div>: null}

            {size.width<'600'?<div className='stockin_form2'>
                <div className='stockin_list_header'>
                <div style={{width:'15%',textAlign:'center'}}>Part ID</div>
                <div style={{width:'30%',textAlign:'center'}}>Part Name</div>
                <div style={{width:'10%',textAlign:'center'}}>Unit Price</div>
                <div style={{width:'30%',textAlign:'center'}}>Quantity</div>
                <div style={{width:'15%',textAlign:'center'}}></div>
            </div>
            </div>:null}

                {newPartList.map((l)=><List key={l.part} partId={l.part} quantity={l.quantity} unit={l.unit} price={l.price}
            deleteNote={(data)=>handleDeleteNote(data)}/>)}
            </div>
            
        <Modal show={showModal} modalClosed={()=>setShowModal(false)}>hiii
        <input type="file" name="file" onChange={(e)=>uploadFile(e)}/></Modal>
    </div>
    )
}

export default StockIn;