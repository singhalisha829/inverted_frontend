import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchPartWiseList, fetchPurchaseOrderDetails, postPoVendor } from "../services/purchaseOrderService";
import { fetchVendorList } from "../services/ledgerService";

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
    const [upadteUi,setUpdateUi]= useState(null);
    const [vendorLists,setVendorLists]= useState(null);

    const [displayList,setDisplayList]= useState([]);


    useEffect(()=>{
        const token=localStorage.getItem('token');
        const poId=localStorage.getItem('poId')
        // console.log(poId)
        setPurchaseOrderId(localStorage.getItem('poId'))
        fetchPurchaseOrderDetails(token,poId).then(res=>{console.log(res.data);setPoDetails(res.data.data.output[0].invoice_products)})
        setToken(token)
        fetchPartWiseList(token,poId).then(res=>{setOrderDetails(res.data.data.output);setPartsList(res.data.data.output.order_items);})
        fetchVendorList(token).then(res=>setVendorLists(res.data))

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

    const handleUnitPrice=(id,value,branch_id,quantity,unit,part_name)=>{
        const index= vendorList.findIndex(el=>el.part===id && el.branch_id===branch_id)
        if(index== -1){
            vendorList.push({
                purchase_order:purchaseOrderId,
                part:id,
                part_name:part_name,
                quantity:quantity+" "+unit,
                vendor:null,
                unit_price:value,
                branch_id:branch_id
            })
        }else{
            vendorList[index].unit_price=value;
        }
    setUpdateUi(value);
        // console.log(vendorList)

    }

    const handleVendor=(id,value,branch_id,quantity,unit,part_name)=>{
        const quantity1= quantity.filter(el=>el.id===branch_id)[0].quantity;
        const index= vendorList.findIndex(el=>el.part===id && el.branch_id===branch_id)
        if(index== -1){
            vendorList.push({
                purchase_order:purchaseOrderId,
                part:id,
                part_name:part_name,
                quantity:quantity1+" "+unit,
                vendor:value,
                unit_price:null,
                branch_id:branch_id
            })
        }else{
            vendorList[index].vendor=value;
        }
        // console.log(vendorList)
        handleDisplayList(value);
        

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

    const handleQuantity =(id,list)=>{
        const index= vendorList.findIndex(el=>el.part===id && el.branch_id===list.id)
        if(index != -1){
            vendorList[index].quantity= list.quantity+" "+list.unit;
        }

        // console.log(vendorList)
    }

    const deleteBranch= (id,part_id) =>{
        console.log(vendorList)
        const newList= vendorList.filter(el=>{
            if(el.part === part_id && el.branch_id === id){
            }else{
                return el;
            }
        }
            )
            console.log(newList)
        setVendorList(newList)
    }


    console.log(vendorList);
    

    const handleDisplayList=(id)=>{
        const list=vendorLists.filter(el=>el.id===id);
        const index= displayList.findIndex(el=>el.id===id);
        const newList= null;
        if(index== -1){
            newList=[...displayList,{id:id,name:list[0].name}]
            setDisplayList(newList);
        }
        setUpdateUi (id)

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
                            <div>{item.product_description}</div>
                            <div>{item.quantity}</div>
                        </div>))}
                    </div>:null}
            </div>
        </div>

        <div style={{display:"flex"}}>
        <div style={{width:"70%"}}>
        <div className="vendor_subsection">
            <div style={{width:'10%'}} className="vendor_header">PART ID</div>
            <div style={{width:'30%'}} className="vendor_header">PART DESCRIPTION</div>
            <div style={{width:'5%'}} />
            <div style={{width:'15%'}} className="vendor_header">QUANTITY</div>
            <div style={{width:'15%'}} className="vendor_header">UNIT PRICE</div>
            <div style={{width:'20%'}} className="vendor_header">VENDOR</div>
            <div style={{width:'5%'}} />

        </div>
        <div style={{marginTop:"1rem"}}>
            {partsList?
            <div className="parts_wise_list">
                {searchText!= undefined? cardFilter.map((part)=>(
                 <PartsList key={part.id} id={part.id} partId={part.part_id} partName={part.short_description}
            quantity={part.quantity_value} unit={part.quantity_symbol} handleUnitPrice={(id,value,branch_id,quantity,unit,part_name)=>handleUnitPrice(id,value,branch_id,quantity,unit,part_name)} 
            handleVendor={(id,value,branch_id,quantity,unit,part_name)=>handleVendor(id,value,branch_id,quantity,unit,part_name)} handleQuantity={
                (id,list,unit)=>handleQuantity(id,list,unit)} deleteBranch={(id,part_id)=>deleteBranch(id,part_id)}
            />)):
                partsList.map((part)=>(
            <PartsList key={part.id} id={part.id} partId={part.part_id} partName={part.short_description}
            quantity={part.quantity_value} unit={part.quantity_symbol} handleUnitPrice={(id,value,branch_id,quantity,unit,part_name)=>handleUnitPrice(id,value,branch_id,quantity,unit,part_name)} 
            handleVendor={(id,value,branch_id,quantity,unit,part_name)=>handleVendor(id,value,branch_id,quantity,unit,part_name)} handleQuantity={
                (id,list,unit)=>handleQuantity(id,list,unit)} deleteBranch={(id,branch_id)=>deleteBranch(id,branch_id)}
            />))}</div>
        :null}</div>
        </div>
        <div style={{width:'30%'}}>
            <div className="vendor_card">
            {displayList?displayList.map((vendor)=><div key={vendor.id} className="single_vendor_card">
                <div className="vendor_name"># {vendor.name}</div> 
                <div>
                    {vendorList.map((part)=>{
                        if(part.vendor=== vendor.id){
                            return(
                                <div style={{display:'flex'}}>
                                    <div style={{width:'50%'}}>{part.part_name}</div> 
                                    <div style={{width:'25%'}}>{part.quantity}</div> 
                                    <div style={{width:'25%'}}>{part.unit_price}</div>
                                    </div>
                                    )
                        }
                    })}
                </div>
            </div>):null}
            </div>
            
        </div>
        
        </div>

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