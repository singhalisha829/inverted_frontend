import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchPartWiseList, postPoVendor } from "../services/purchaseOrderService";

import { FaSistrix} from 'react-icons/fa';
import PartsList from "../components/partList";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const SelectVendor=() =>{

    const [token,setToken]= useState(null);
    const [partsList,setPartsList]= useState([]);
    const [vendorList,setVendorList]= useState([]);
    const [purchaseOrderId,setPurchaseOrderId]= useState(null);


    useEffect(()=>{
        const token=localStorage.getItem('token');
        const poId=localStorage.getItem('purchase_order_id')
        console.log(poId)
        setPurchaseOrderId(localStorage.getItem('purchase_order_id'))
        setToken(token)
        fetchPartWiseList(token,poId).then(res=>{console.log(res.data.data.output);setPartsList(res.data.data.output.order_items);})
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

    const handleUnitPrice=(id,value,quantity,unit)=>{
        const index= vendorList.findIndex(el=>el.part===id)
        if(index== -1){
            vendorList.push({
                purchase_order:purchaseOrderId,
                part:id,
                quantity:quantity+" "+unit,
                vendor:null,
                unit_price:value
            })
        }else{
            vendorList[index].unit_price=value;
        }
        console.log(vendorList)

    }

    const handleVendor=(id,value,quantity,unit)=>{
        const index= vendorList.findIndex(el=>el.part===id)
        if(index== -1){
            vendorList.push({
                purchase_order:purchaseOrderId,
                part:id,
                quantity:quantity+" "+unit,
                vendor:value,
                unit_price:null
            })
        }else{
            vendorList[index].vendor=value;
        }
        console.log(vendorList)

    }

    const submitVendor=()=>{
        const ifVendorNull= vendorList.some(el=>el.vendor===null);
        const ifUnitPriceNull= vendorList.some(el=>el.unit_price===null);
        if(vendorList.length != partsList.length || ifVendorNull || ifUnitPriceNull){
            toast.warning('Enter All Fields!')
            return;
        }else{
            postPoVendor(token,vendorList).then(res=>{
                toast.success("Successfully Submitted!")
                console.log(res)
            localStorage.setItem('purchase_order_id_vendor',res.data.status.purchase_order_id);
            Router.push('/vendorList')

            })
        }
    }


    return(
        <div className="layout">
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
    {size.width>'600'?<Sidebar /> : <Header />}
    <div className="vendor_page">
        <ToastContainer />
    <div className="order_title">
            <div className="title">Purchase Orders</div>
            <div className="sub_title">Select Vendors For Parts</div>
    </div> 
    <div className="new_order_subsection">
            <input  style={{width:"70%",height:'3.5rem'}} placeholder="Search.."/>
            <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>
        </div>

        <div className="vendor_subsection">
            <div style={{width:'20%'}}>PART ID</div>
            <div style={{width:'20%'}}>PART NAME</div>
            <div style={{width:'20%'}}>QUANTITY</div>
            <div style={{width:'20%'}}>UNIT PRICE</div>
            <div style={{width:'20%'}}>VENDOR</div>
        </div>
        <div style={{marginTop:"1rem"}}>
            {partsList?partsList.map((part)=>(
            <PartsList key={part.id} id={part.id} partId={part.part_id} partName={part.short_description}
            quantity={part.quantity_value} unit={part.quantity_symbol} handleUnitPrice={(id,value,quantity,unit)=>handleUnitPrice(id,value,quantity,unit)} 
            handleVendor={(id,value,quantity,unit)=>handleVendor(id,value,quantity,unit)}/>
        )):null}</div>

<div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button className="cancel_button button2" onClick={()=>{Router.back();}}>Cancel</button>
                        <button className="save_button button2" onClick={submitVendor}>Save</button>
                        </div></div>
    </div>

       
        </div>
    )
}

export default SelectVendor;