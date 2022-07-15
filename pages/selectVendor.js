import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchPartWiseList, fetchPurchaseOrderDetails, postPoVendor } from "../services/purchaseOrderService";

import { FaSistrix, FaTimes} from 'react-icons/fa';
import PartsList from "../components/partList";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const SelectVendor=() =>{

    const [token,setToken]= useState(null);
    const [partsList,setPartsList]= useState([]);
    const [vendorList,setVendorList]= useState([]);
    const [purchaseOrderId,setPurchaseOrderId]= useState(null);
    const [orderDetails,setOrderDetails] = useState(null);
    const [searchText,setSearchText]= useState(null);
    const [cardFilter,setCardFilter]= useState(null);
    const [poDetails,setPoDetails]= useState(null);
    const [showDetails,setShowDetails]= useState(false);


    useEffect(()=>{
        const token=localStorage.getItem('token');
        const poId=localStorage.getItem('purchase_order_id')
        console.log(poId)
        setPurchaseOrderId(localStorage.getItem('purchase_order_id'))
        fetchPurchaseOrderDetails(token,poId).then(res=>{setPoDetails(res.data.data.output[0].invoice_products)})
        setToken(token)
        fetchPartWiseList(token,poId).then(res=>{setOrderDetails(res.data.data.output);setPartsList(res.data.data.output.order_items);})
    },[])

    console.log(poDetails)
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


    const searchParts = (value)=>{
        setSearchText(value);
        if(value !== undefined){
            const filterCard = partsList.filter(o => Object.keys(o).some(
              k => String(o[k]).toLowerCase().includes(value.toLowerCase()))
            );
            setCardFilter([...filterCard])
          }else{
            setPartsList([...partsList])
            setCardFilter([...partsList])
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
    <div className="new_order_subsection" style={{height:'6rem',paddingLeft:'1.2rem'}}>
            <input  style={{width:"70%",height:'3.5rem'}} placeholder="Search.." value={searchText} onChange={(e)=>{searchParts(e.target.value);}}/>
            <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>
        </div>

        <div className="po_details">
            <div className="po_details_border">
                <div style={{display:'flex',width:"100%"}}>
                
                    <div style={{display:'flex',flexDirection:'column',width:'80%'}}>
                <div className="detail_header">
                    <div className="detail_field">Order Number</div>
                    <div className="detail_field">Date</div>
                    <div className="detail_field">Created By</div>
                </div>
                <div className="details">
                <div className="detail_field">{orderDetails?orderDetails.purchase_order_no:null}</div>
                    <div className="detail_field">{orderDetails?orderDetails.date:null}</div>
                    <div className="detail_field">{orderDetails?orderDetails.created_by:null}</div>
                </div></div>
                <div style={{display:'flex',alignItems:'center'}}><a onClick={()=>setShowDetails(true)}>View Details</a>
                
                    </div></div>
                    {showDetails?<div className="detail_card">
                        <div className="detail_card_header">
                            <div>Order Details</div>
                            <div className="close_details"><FaTimes onClick={()=>setShowDetails(false)}/></div>
                        </div>
                        {poDetails.map((item)=>(
                        <div className="po_card" key={item.id}>
                            <div>{item.ItemType}</div>
                            <div>{item.item_name}</div>
                            <div>{item.quantity}</div>
                        </div>))}
                    </div>:null}
            </div>
        </div>

        <div className="vendor_subsection">
            <div style={{width:'20%'}} className="vendor_header">PART ID</div>
            <div style={{width:'23%'}} className="vendor_header">PART DESCRIPTION</div>
            <div style={{width:'2%'}} />
            <div style={{width:'25%'}} className="vendor_header">QUANTITY</div>
            <div style={{width:'15%'}} className="vendor_header">UNIT PRICE</div>
            <div style={{width:'15%'}} className="vendor_header">VENDOR</div>
        </div>
        <div style={{marginTop:"1rem"}}>
            {partsList?
            <div className="parts_wise_list">
                {searchText!= undefined? cardFilter.map((part)=>(
                 <PartsList key={part.id} id={part.id} partId={part.part_id} partName={part.short_description}
            quantity={part.quantity_value} unit={part.quantity_symbol} handleUnitPrice={(id,value,quantity,unit)=>handleUnitPrice(id,value,quantity,unit)} 
            handleVendor={(id,value,quantity,unit)=>handleVendor(id,value,quantity,unit)}/>)):
                partsList.map((part)=>(
            <PartsList key={part.id} id={part.id} partId={part.part_id} partName={part.short_description}
            quantity={part.quantity_value} unit={part.quantity_symbol} handleUnitPrice={(id,value,quantity,unit)=>handleUnitPrice(id,value,quantity,unit)} 
            handleVendor={(id,value,quantity,unit)=>handleVendor(id,value,quantity,unit)}/>))}</div>
        :null}</div>

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