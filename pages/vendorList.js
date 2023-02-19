import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';
import { useRouter } from 'next/router';


import { FaSistrix,FaExternalLinkAlt,FaDownload,FaTimes} from 'react-icons/fa';

// import ReactHtmlTableToExcel from "react-html-table-to-excel"; 
import Loader from '../components/loader';
import ButtonLoader from '../components/buttonLoader';

import Modal from "../components/modal";



import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { fetchVendorWiseList, fetchUnassignedParts,deleteParts,confirmVendor ,fetchPurchaseOrderPdf} from "../services/purchaseOrderService";

const VendorList = () =>{
  const router = useRouter();

    const [vendorList, setVendorList] = useState([]);
    const [token,setToken]= useState(null);
    const [searchText,setSearchText]= useState(null);
    const [unassignedParts,setUnassignedParts]= useState([]);
    const [lockState,setLockState]= useState([]);
    const [poId,setPoId]= useState(null);
    const [loading,setLoading]= useState(false);
    const [showModal,setShowModal]= useState(false);

    

    useEffect(()=>{
        const token=localStorage.getItem('token');
        const poId=router.query.id;
        setPoId(poId);
        fetchUnassignedParts(token,poId).then((res)=>{
          if(res.data.data.output[0].purchase_order.length ===0){
              Router.push('/selectVendor')
          }else{
            setUnassignedParts(res.data.data.output[0].temp_part)
          }
      }).catch(err=>toast.error(err.message));
          setToken(token)
          fetchVendorWiseList(token,poId).then((res)=>{
            setVendorList(res.data.data.output)
            const newList=[];
            const list=res.data.data.output;
            for(let i=0;i<list.length;i++){
              newList.push({
                id:list[i].id,
                status:list[i].status
              })
            }
            setLockState(newList)
          }).catch(err=>toast.error(err.message));

          
    },[router.query.id])
    
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

    const goToSelectVendor=()=>{
      Router.push('/editVendor');
    }

    const lockVendor=(id)=>{
     setShowModal(true);
     localStorage.setItem('vendor_list_id',id)
    console.log(id);
    }

   const confirmVendorList=()=>{
    const id=localStorage.getItem('vendor_list_id')
      confirmVendor(token,id).then(res=>{
        toast.success('Vendor List Confirmed!');
        setShowModal(false);
        fetchVendorWiseList(token,poId).then((res)=>{
          setVendorList(res.data.data.output)
          const newList=[];
          const list=res.data.data.output;
          for(let i=0;i<list.length;i++){
            newList.push({
              id:list[i].id,
              status:list[i].status
            })
          }
          setLockState(newList)
        })
      }).catch(err=>toast.error(err.message));
    }

    const editPart= (id)=>{
      deleteParts(token,id).then(res=>{console.log(res)
        Router.push('/editVendor')}).catch(err=>toast.error(err.message));
    }

    const downloadPdf=(id)=>{
     fetchPurchaseOrderPdf(token,id)
    }

    console.log(vendorList)
    

    return(
        <div>
            <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
    {/* {size.width>'600'?<Sidebar /> : <Header show={true} path='/purchaseOrder'/>} */}
    <div className="vendor_list_page">
      <ToastContainer />
    <div className="order_title">
            <div className="title">Purchase Orders  </div>
            <div className="sub_title">Vendors List</div>
    </div> 
    {/* <div className="vendor_list_subsection" style={{paddingLeft:'1.2rem'}}>
            <input  style={{width:"70%",height:'3.5rem'}} placeholder="Search.." value={searchText} onChange={(e)=>{searchParts(e.target.value);}}/>
            <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>

             {/* export parts table */}
             {/* <div style={{width:'10rem',marginLeft:'10vw',marginRight:'0.8rem'}}>
                     <ReactHtmlTableToExcel
         table="partsTable"
         filename="stock_report"
         sheet="stock_report"
         buttonText="Export" 
         className="export_button" /></div>

                     <div className='export_symbol' style={{marginTop:'0.2rem'}}><FaExternalLinkAlt size={15} style={{color:"#3F5575"}} /></div>
             
        </div>  */}

        <div className="vendor_list">
          <div className="vendor_title">
            <div>Vendor List</div>
            
            
           </div>

          {vendorList?vendorList.map((vendor)=>{
            const index= lockState.findIndex(el=>el.id===vendor.id)
            if(vendor.invoice_products.length !=0){
            return(
            <div key={vendor.id} className="single_vendor_card1">
                <div className="vendor_name"><div># {vendor.vendor}</div>
                {lockState[index]?
                <div>{lockState[index].status =='Confirmed'?<button className="common" onClick={()=>downloadPdf(vendor.id)}><div style={{marginRight:"0.5rem",marginTop:'0.3rem'}}>Download</div> <FaDownload size={13}/></button>:
                <button onClick={()=>lockVendor(vendor.id)} disabled={loading}>
                  {loading?<div style={{marginRight:'5px'}}><ButtonLoader /></div>:null}Confirm</button>}</div>:null}
                </div> 

                <div className="vendor_table">
                    <div style={{display:'flex',paddingBottom:'0.5rem',borderBottom:'#e5e5e5 solid 0.1em'}}>
                    <div style={{width:'25%'}} className="common">PART ID</div>
                        <div style={{width:'30%'}} className="common">PART DESCRIPTION</div>
                        <div style={{width:'20%'}} className="common">QUANTITY</div>
                        <div style={{width:'20%'}} className="common">UNIT PRICE</div>
                        <div style={{width:'5%'}} />
                    </div>
                    <div style={{paddingTop:'0.5rem'}}>
                    {vendor.invoice_products.map((part)=>(
                                <div key={part.id} style={{display:'flex',marginBottom:"0.5rem",fontWeight:"400"}}>
                                    <div style={{width:'25%'}} className="common">{part.part}</div> 
                                    <div style={{width:'30%',padding:'3px'}} className="common">{part.part_short_description}</div> 
                                    <div style={{width:'20%'}} className="common">{part.quantity}</div> 
                                    <div style={{width:'20%'}} className="common">{part.unit_price}</div>
                                    <div style={{width:'5%'}} className="common"><div className="edit_parts">
                                    {lockState[index].status=='Created'?  <FaTimes onClick={()=>editPart(part.id)} className="trash"/>:null}
                                    </div></div>

                                    </div>
                                    )
                                  

                      
                    )}</div>
                    </div>
            </div>
)}}):null}
        </div>
        {unassignedParts.length !=0?<div className="vendor_list">
          <div className="vendor_title">
            <div>Unassigned Parts</div>
            <button style={{marginRight:'2rem'}} onClick={()=>goToSelectVendor()}>Edit</button>
            </div>
          <div className="common unassigned_parts_title">
          <div style={{width:'20%'}} className="common">PART ID</div>
          <div style={{width:'60%'}} className="common">PART DESCRIPTION</div>
          <div style={{width:'20%'}} className="common">QUANTITY</div>
            
          </div>
            
            {unassignedParts.map((part)=>(
              <div key={part.id} className="single_vendor_card common" style={{color:'#3F5575'}}>
                <div style={{width:'20%'}} className="common">{part.part_id}</div>
                <div style={{width:'60%',paddingLeft:'1rem'}} className="common">{part.part__short_description}</div>
                <div style={{width:'20%'}} className="common">{part.quantity__value} {part.quantity__unit__symbol}</div>
              </div>
            ))}
        </div>:null}
    </div>
    <Modal show={showModal} modalClosed={()=>setShowModal(false)} height="35vh">
      <div className="confirm_header common">ARE YOU SURE?</div>
      <div className="confirm_content">Are you sure you to confirm? You won&apos;t be able edit this vendor list anymore.</div>
      <div className="confirm_buttons common">
        <button className="cancel_button button2" onClick={confirmVendorList}>Continue</button>
        <button className="save_button button2" onClick={()=>setShowModal(false)}>Cancel</button>
      </div>
    </Modal>
        </div>
    )
}

export default VendorList;