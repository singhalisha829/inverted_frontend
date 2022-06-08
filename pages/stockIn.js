import Image from 'next/image';
import { useState, useEffect } from 'react';
import Router from 'next/router';

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
    

    useEffect(()=>{
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

    const handleDeleteNote=(id)=>{
        const newList=newPartList.filter((note) => note.part !== id);
        setNewPartList(newList)
    }

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

    const cancelHandler = () =>{
        setPartName(()=>"");
        setPrice(()=>"");
        setQuantity(()=>"");
        setUnit(()=>"")
    }

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

    const submitPartsListHandler =() =>{
        for(let i=0;i<newPartList.length;i++){
            console.log(newPartList[i])
            addNewLedger(newPartList[i],token).then(res=> window.location.reload())
        }

    }


           const form=(<div className="form_content">
            <div style={{width:"15%", textAlign:"center"}}></div>
            <div style={{width:"30%",paddingLeft:'6%'}}>
            {partList?<Dropdown options={partList} placeholder="Select Part" width="80%" name="short_description" isAddNewPart partTypeList={partTypeList}
            parentCallback={(data)=>setPartName(data.id)} value={partName} height="3rem" minWidth="12rem"/>:null}</div>

            <div style={{width:'10%',paddingLeft:'3%'}}><input style={{width:"80%", height:'2.8rem'}} type="number" 
            onChange={(e)=>setPrice(e.target.value)} value={price}/></div>

            <div style={{width:"30%", display:'flex',paddingLeft:'5%'}}>
            <input value={quantity} style={{width:"20%", height:"3px",marginRight:'10px'}} type="number" onChange={(e)=>setQuantity(e.target.value)}/>
            {unitList?<Dropdown options={unitList} placeholder="Select Unit" width="60%" name="name" height="3rem" minWidth="9rem"
            parentCallback={(data)=>setUnit(data.symbol)} value={unit}/>:null}</div>

            <div style={{width:"15%"}}>
            <div className="icons">
                <div style={{paddingLeft:'20%',marginRight:'20%'}}>
            <FaCheckCircle onClick={submitHandler} size={30} color="#33B850" cursor="pointer"/></div>
            <FaTimesCircle size={30} color="#F16B6B" onClick={cancelHandler} cursor="pointer"/>
            </div>
                </div>
                
                </div>
            );
        

    let stockin_page=<Spinner />;
    if(showPage){
        stockin_page=(<div className="layout">
        <Sidebar />
        <div className="stockin_page">
        <div className="stockin_title">
                <div style={{fontWeight:'600',fontSize:'3rem',lineHeight:'3.6rem',marginBottom:'0.5rem'}}>Available Stocks</div>
                     <div style={{fontWeight:'400',fontSize:'1.6rem',lineHeight:'1.9rem'}}>Database for all Available Stocks</div>
                    </div> 

                    <div className='stockin_subsection'>
                        <div style={{display:'flex',marginLeft:'1rem',width:'100%',justifyContent:'space-between'}}>
         <p style={{fontStyle: "normal",fontWeight: "600",fontSize: "1.8rem",
            lineHeight: "2.2rem",color: "#29394A"}}>Your Stock in Items</p>
                            {/* <button style={{marginRight:'1rem'}} className="upload_button" onClick={()=> setShowModal(true)}><FaCloudUploadAlt size={15}/> Upload</button> */}
                <button style={{marginRight:'1rem',marginTop:'1rem'}} className="add_button" onClick={submitPartsListHandler}><FaPlus />  Add</button>
                </div>

                <div className='stockin_form'>
                <div style={{width:"33%"}}><label>Invoice Number:</label><input style={{height:'3rem',width:'60%',minWidth:'12rem'}} onChange={(e)=> setInvoice(e.target.value)}/></div>
                <div style={{width:"33%"}}>Vendor:{vendorList?<Dropdown options={vendorList} placeholder="Select Vendor" width="60%" name="name" minWidth="12rem"
                parentCallback={(data)=>setVendor(data.id)}/>:null}</div>
                <div style={{width:"33%"}}><label>Date:</label>
                            <DatePicker placeholderText='Enter Date' selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        </div>
            </div>
            <div className='stockin_list_header'>
                <div style={{width:'15%',textAlign:'center'}}>Part ID</div>
                <div style={{width:'30%',textAlign:'center'}}>Part Name</div>
                <div style={{width:'10%',textAlign:'center'}}>Price</div>
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
    </div>)
    }

    return(
        <div>{stockin_page}</div>
    )
}

export default StockIn;