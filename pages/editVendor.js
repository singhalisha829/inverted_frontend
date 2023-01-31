import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchPurOrderPartWiseList, fetchPurchaseOrderDetails, deleteAssignedParts,postPoVendor1,fetchUnassignedParts } from "../services/purchaseOrderService";
import { fetchVendorList } from "../services/stockInService";

import { FaTimes} from 'react-icons/fa';
import PartsList from "../components/partList";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import GifLoader from 'react-gif-loader';
import LoadingOverlay from 'react-loading-overlay';
import DarkBackground from "../components/darkBackground";
// import DarkBackground from "../components/darkBackground";

import Image from "next/image";




const EditVendor=() =>{

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
    const [finalList,setFinalList]= useState([]);
    const [vendorDisplayList,setVendorDisplayList]= useState([]);

    const [displayList,setDisplayList]= useState([]);
    const [loading,setLoading]= useState(false);
    const [isSubmit,setIsSumbit] = useState(true);
  

    useEffect(()=>{
        const token=localStorage.getItem('token');
        const poId=localStorage.getItem('poId')

        setPurchaseOrderId(localStorage.getItem('poId'))
        fetchPurchaseOrderDetails(token,poId).then(res=>{setPoDetails(res.data.data.output[0].invoice_products)})
        setToken(token)
        fetchPurOrderPartWiseList(token,poId).then(res=>setOrderDetails(res.data.data.output))
        fetchUnassignedParts(token,poId).then(res=>{    
            setPartsList(res.data.data.output[0].temp_part);
            const list=res.data.data.output[0].temp_part;
            console.log(list.length);
            const newList=[];
            for(let i=0;i<list.length;i++){
                newList.push({
                    part:list[i].part_id_id,
                    purchase_order:parseInt(poId),
                    quantity:list[i].quantity__value+" "+list[i].quantity__unit__symbol,
                    branch_id:1,
                    part_id:list[i].part_id,
                })
            }
            setFinalList(newList)
        })
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

    useEffect(()=>{
        if(displayList.length>0){
            setIsSumbit(false);
           
        }else{
            setIsSumbit(true);
        }
    },[displayList.length])

    const handleUnitPrice=(id,value,branch_id,quantity,part_name,partId)=>{
        console.log("handleUnitPrice")
        const quantity1= quantity.filter(el=>el.id===branch_id)[0].quantity;
        const unit= quantity.filter(el=>el.id===branch_id)[0].unit;
        const index= vendorList.findIndex(el=>el.part===id && el.branch_id===branch_id)
        if(index== -1){
            vendorList.push({
                purchase_order:parseInt(purchaseOrderId),
                part:id,
                part_name:part_name,
                quantity:quantity1+" "+unit,
                vendor:null,
                unit_price:value,
                branch_id:branch_id,
            })

        }else{
            vendorList[index].unit_price=value;
        }

        const e= finalList.findIndex(el=>el.part===id && el.branch_id=== branch_id);    
            finalList[e].unit_price=value;
            
            if(value != '' && vendorList[index]?.vendor != null ){
                handleDisplayList(vendorList[index].vendor);
            }
            if(value== ''){
                removeFromDisplayList(index);
            }
    setUpdateUi(value);
    }

    const removeFromDisplayList =(index)=>{
        displayList.splice(index,1);
    }

    const handleVendor=(id,value,branch_id,quantity,part_name,partId)=>{
        console.log("handleVendor")
        const quantity1= quantity.filter(el=>el.id===branch_id)[0].quantity;
        const unit= quantity.filter(el=>el.id===branch_id)[0].unit;
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
            });
            
        }else{
            vendorList[index].vendor=value;
        }
        
        const e= finalList.findIndex(el=>el.part===id && el.branch_id=== branch_id);
            finalList[e].vendor=value;
        
        if(vendorList[index]?.unit_price != null ){
            handleDisplayList(value);
        }
    }

    const handlePartsList=(id,branch_id,quantity,part_name,partId)=>{
        console.log(vendorList,id,branch_id)
        console.log("handlePartsList")
        const quantity1= quantity.filter(el=>el.id===branch_id)[0].quantity;
        const unit= quantity.filter(el=>el.id===branch_id)[0].unit;
        const index1=finalList.findIndex(el=>el.part== id && el.branch_id==1);
        console.log(index1)
            vendorList.push({
                purchase_order:parseInt(purchaseOrderId),
                part:id,
                part_name:part_name,
                quantity:quantity1+" "+unit,
                vendor:null,
                unit_price:null,
                branch_id:branch_id,
        })

            finalList.push({
                purchase_order:parseInt(purchaseOrderId),
                part:id,
                quantity:quantity1+" "+unit,
                vendor:null,
                unit_price:null,
                branch_id:branch_id,
                part_id:partId,
            })
        finalList[index1]['unit_price']=null;
        finalList[index1]['vendor']=null;

        console.log(finalList)
            
    setUpdateUi(quantity1);
    }

    const submitVendor=()=>{
        const newList=[];
        const tempList=[];
        const submitPartList=[];
        console.log(finalList.length)
        for(let i=0;i<finalList.length;i++){
            const part=finalList[i].part;
                if(tempList.includes(part)){
                    continue;
                }else{
            if(finalList[i].vendor != undefined){
                tempList.push(part);
                const some=finalList.filter(el=>el.part==finalList[i].part);
                
                    some.forEach(el=>submitPartList.push(el));
                }
            }
            
        }
        console.log(submitPartList)       

        for(let i =0;i<submitPartList.length;i++){
            const index= partsList.findIndex(el=>el.part_id== submitPartList[i].part_id);
            if(index != -1){
                if(newList.includes(partsList[index].id)){
                    continue;
                }
            newList.push(partsList[index].id)
            }
        }
        console.log(newList)
           

            deleteAssignedParts(token,newList).then(res=>{console.log(res.data);     
                postPoVendor1(token,submitPartList).then(res=>{
                    toast.success("Successfully Submitted!")
                    console.log(res.data)
                    localStorage.setItem('poId',res.data.status.purchase_order_id);       
                Router.push('/vendorList');
            }
            )
            })  
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
        console.log(id,list)
        const index= vendorList.findIndex(el=>el.part===id && el.branch_id===list.id)
        if(index != -1){
            vendorList[index].quantity= list.quantity+" "+list.unit;
        }
        
        const index1=finalList.findIndex(el=>el.part===id && el.branch_id===list.id)
        if(index1 != -1){
        finalList[index1].quantity=list.quantity+" "+list.unit;
        }
        setLoading(false)
    }

    const deleteBranch= (id,part_id) =>{
        const newList= vendorList.filter(el=>{
            if(el.part === part_id && el.branch_id === id){
            }else{
                return el;
            }
        }
            )
        setVendorList(newList)

        const newList1= finalList.filter(el=>{
            if(el.part === part_id && el.branch_id === id){
            }else{
                return el;
            }
        }
            )
        setFinalList(newList1)
    }
    

    const handleDisplayList=(id)=>{
        const list=vendorLists.filter(el=>el.id==id);
        const index= displayList.findIndex(el=>el.id==id);
        const newList= null;
        if(index== -1){
            newList=[{id:id,name:list[0].name},...displayList]
            setDisplayList(newList);
        }
        console.log(id,displayList,list,vendorLists)
        setUpdateUi (id)

    }

    const removeVendor=(id)=>{
        const newList=displayList.filter(el=>el.id != id);
        setDisplayList(newList)
    }

    const handleLoading=()=>{
        setLoading(true);
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
    {/* <div className="new_order_subsection" style={{height:'6rem',paddingLeft:'1.2rem'}}>
            <input  style={{width:"70%",height:'3.5rem'}} placeholder="Search.." value={searchText} onChange={(e)=>{searchParts(e.target.value);}}/>
            <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>
        </div> */}

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
                <div className="common view_details"><button onClick={()=>setShowDetails(true)}>View Details</button>
                
                    </div></div>
                    {showDetails?<div className="detail_card">
                        <div className="detail_card_header">
                            <div>Order Details</div>
                            <div className="close_details"><FaTimes onClick={()=>setShowDetails(false)}/></div>
                        </div>
                        <div style={{marginLeft:'1rem',marginRight:'1rem'}}>
                        <div className="order_detail_header">
                            <div style={{width:'20%'}} className="common">ORDER TYPE</div>
                            <div style={{width:'20%'}} className="common">ORDER ID</div>
                            <div style={{width:'40%'}} className="common">ORDER DESCRIPTION</div>
                            <div style={{width:'20%'}} className="common">QUANTITY</div>
                        </div>
                        {poDetails.map((item)=>(
                        <div className="po_card" key={item.id}>
                            <div style={{width:'20%'}} className="common">{item.ItemType}</div>
                            <div style={{width:'20%'}} className="common">{item.item_name}</div>
                            <div style={{width:'40%'}} className="common">{item.product_description}</div>
                            <div style={{width:'20%'}} className="common">{item.quantity}</div>
                        </div>))}</div>
                        {/* <Table rows={poDetails} columns={columns} /> */}
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
                 <PartsList key={part.id} id={part.part_id_id} partId={part.part_id} partName={part.part__short_description}
            quantity={part.quantity__value} unit={part.quantity_unit__symbol} handleUnitPrice={(id,value,branch_id,quantity,part_name,partId)=>handleUnitPrice(id,value,branch_id,quantity,part_name,partId)} 
            handleVendor={(id,value,branch_id,quantity,part_name,partId)=>handleVendor(id,value,branch_id,quantity,part_name,partId)} handleQuantity={
                (id,list,unit)=>handleQuantity(id,list,unit)} deleteBranch={(id,part_id)=>deleteBranch(id,part_id)} handleLoading={()=>handleLoading()}
                handlePartsList={(id,branch_id,quantity,part_name,partId)=>handlePartsList(id,branch_id,quantity,part_name,partId)}
            />)):
                partsList.map((part)=>{
                return(
            <PartsList key={part.id} id={part.part_id_id} partId={part.part_id} partName={part.part__short_description}
            quantity={part.quantity__value} unit={part.quantity__unit__symbol} handleUnitPrice={(id,value,branch_id,quantity,part_name,partId)=>handleUnitPrice(id,value,branch_id,quantity,part_name,partId)} 
            handleVendor={(id,value,branch_id,quantity,part_name,partId)=>handleVendor(id,value,branch_id,quantity,part_name,partId)} handleQuantity={
                (id,list,unit)=>handleQuantity(id,list,unit)} deleteBranch={(id,branch_id)=>deleteBranch(id,branch_id)} handleLoading={()=>handleLoading()}
                handlePartsList={(id,branch_id,quantity,part_name,partId)=>handlePartsList(id,branch_id,quantity,part_name,partId)}
            />)})}</div>
        :null}</div>
        </div>
        <div style={{width:'30%',marginBottom:'10rem'}}>
            <div className="vendor_card">
            {displayList?displayList.map((vendor)=>{
                const index= vendorList.findIndex(el=>el.vendor=== vendor.id);
                if(index=== -1){
                    removeVendor(vendor.id);
                }
            return(
            <div key={vendor.id} className="single_vendor_card">
                <div className="vendor_name"># {vendor.name}</div> 
                <div className="vendor_table">
                    <div style={{display:'flex',paddingBottom:'0.5rem',borderBottom:'#e5e5e5 solid 0.1em'}}>
                        <div style={{width:'50%'}}>PART DESCRIPTION</div>
                        <div style={{width:'25%'}}>QUANTITY</div>
                        <div style={{width:'25%'}}>UNIT PRICE</div>
                    </div>
                    <div style={{paddingTop:'0.5rem'}}>
                    {vendorList.map((part)=>{
                        if(part.vendor=== vendor.id){
                            return(
                                <div style={{display:'flex',marginBottom:"0.5rem",fontWeight:"400"}}>
                                    <div style={{width:'50%'}}>{part.part_name}</div> 
                                    <div style={{width:'25%',display:'flex',justifyContent:'center'}}>{part.quantity}</div> 
                                    <div style={{width:'25%',display:'flex',justifyContent:'center'}}>{part.unit_price}</div>
                                    </div>
                                    )
                        }
                    })}</div>
                   
                </div>
            </div>)}):null}
            </div>
            
        </div>
        
        </div>

<div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button className="cancel_button button2" onClick={()=>{Router.back();}}>Cancel</button>
                        <button className="save_button button2" disabled={isSubmit} onClick={submitVendor}>Save</button>
                        </div></div>
    </div>

    {/* <GifLoader
                loading={loading}
                imageSrc="/loading.gif"
              
                overlayBackground="rgba(0,0,0,0.5)"
            /> */}
        {/* <DarkBackground dissapear={false} /> */}
        
    
       
        </div>
    
    )
}

export default EditVendor;