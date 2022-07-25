import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { FaSistrix,FaExternalLinkAlt,FaDownload,FaPen} from 'react-icons/fa';

import ReactHtmlTableToExcel from "react-html-table-to-excel"; 
import Table from "../components/table";

import { fetchVendorWiseList, fetchUnassignedParts,deleteParts } from "../services/purchaseOrderService";

const VendorList = () =>{

    const [vendorList, setVendorList] = useState([]);
    const [token,setToken]= useState(null);
    const [searchText,setSearchText]= useState(null);
    const [unassignedParts,setUnassignedParts]= useState([]);
    const [lockState,setLockState]= useState([]);
    const [updateUi,setUpdateUi]= useState(null);

    const columns = [
      { accessor1: 'part_id', label: 'Part ID' ,width:"20%", textalign:"center"},
      { accessor1: 'part_short_description',label: 'Part Description' ,width:"60%", textalign:"left"},
      { accessor1: 'quantity_value', label: 'Quantity',width:"20%" , textalign:"center"},  
    ];

    useEffect(()=>{
        const token=localStorage.getItem('token');
        const poId=localStorage.getItem('poId')
        fetchUnassignedParts(token,poId).then((res)=>{
          if(res.data.data.output[0] === undefined){
              Router.push('/selectVendor')
          }else{
            setUnassignedParts(res.data.data.output[0].temp_part)
          }
      })

        console.log(poId)
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
          })

          
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

    const goToSelectVendor=()=>{
      Router.push('/editVendor');
    }

    const lockVendor=(id)=>{
      const index= lockState.findIndex(el=>el.id===id)
      // lockState[index].isLock=true;
      setLockState(lockState)
      setUpdateUi(id);
    }

    console.log(lockState)

    const editPart= (id)=>{
      console.log(id)
      deleteParts(token,id).then(res=>{console.log(res);
        Router.push('/editVendor')});
    }
    

    return(
        <div className="layout">
            <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
    {size.width>'600'?<Sidebar /> : <Header />}
    <div className="vendor_list_page">
    <div className="order_title">
            <div className="title">Purchase Orders</div>
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
            return(
            <div key={vendor.id} className="single_vendor_card">
                <div className="vendor_name"><div># {vendor.vendor}</div>
                {lockState[index]?
                <div>{lockState[index].status !='Created'?<button className="common"><div style={{marginRight:"0.5rem",marginTop:'0.3rem'}}>Download</div> <FaDownload size={13}/></button>:<button onClick={()=>lockVendor(vendor.id)}>Confirm</button>}</div>:null}
                </div> 

                <div className="vendor_table">
                    <div style={{display:'flex',paddingBottom:'0.5rem',borderBottom:'#e5e5e5 solid 0.1em'}}>
                    <div style={{width:'20%',display:'flex',justifyContent:'center'}}>PART ID</div>
                        <div style={{width:'30%',display:'flex',justifyContent:'center'}}>PART DESCRIPTION</div>
                        <div style={{width:'25%',display:'flex',justifyContent:'center'}}>QUANTITY</div>
                        <div style={{width:'20%',display:'flex',justifyContent:'center'}}>UNIT PRICE</div>
                        <div style={{width:'5%',display:'flex',justifyContent:'center'}} />
                    </div>
                    <div style={{paddingTop:'0.5rem'}}>
                    {vendor.invoice_products.map((part)=>(
                                <div key={part.id} style={{display:'flex',marginBottom:"0.5rem",fontWeight:"400"}}>
                                    <div style={{width:'20%',display:'flex',justifyContent:'center'}}>{part.part}</div> 
                                    <div style={{width:'30%',display:'flex',justifyContent:'center'}}>{part.part_short_description}</div> 
                                    <div style={{width:'25%',display:'flex',justifyContent:'center'}}>{part.quantity}</div> 
                                    <div style={{width:'20%',display:'flex',justifyContent:'center'}}>{part.unit_price}</div>
                                    <div style={{width:'5%',display:'flex',justifyContent:'center'}}><div className="edit_parts">
                                      <FaPen onClick={()=>editPart(part.id)}/></div></div>

                                    </div>
                                    )
                      
                    )}</div>
                    </div>
            </div>
)}):null}
        </div>
        <div className="vendor_list">
          <div className="vendor_title">
            <div>Unassigned Parts</div>
            <button style={{marginRight:'2rem'}} onClick={()=>goToSelectVendor()}>Edit</button>
            </div>
          <div className="common unassigned_parts_title">
          <div style={{width:'20%'}} className="common">PART ID</div>
          <div style={{width:'60%'}} className="common">PART DESCRIPTION</div>
          <div style={{width:'20%'}} className="common">QUANTITY</div>
            
          </div>
            {unassignedParts?
            // <Table key={unassignedParts.length} columns={columns} rows={unassignedParts} />
            unassignedParts.map((part)=>(
              <div key={part.id} className="single_vendor_card common" style={{color:'#3F5575'}}>
                <div style={{width:'20%'}} className="common">{part.part_id}</div>
                <div style={{width:'60%'}} className="common">{part.part__short_description}</div>
                <div style={{width:'20%'}} className="common">{part.quantity__value} {part.quantity__unit__symbol}</div>
              </div>
            ))
            :null}
        </div>
    </div>
        </div>
    )
}

export default VendorList;