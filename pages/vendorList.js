import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { FaSistrix,FaExternalLinkAlt} from 'react-icons/fa';

import ReactHtmlTableToExcel from "react-html-table-to-excel"; 
import Table from "../components/table";

import { fetchVendorWiseList, fetchUnassignedParts } from "../services/purchaseOrderService";

const VendorList = () =>{

    const [vendorList, setVendorList] = useState([]);
    const [token,setToken]= useState(null);
    const [searchText,setSearchText]= useState(null);
    const [unassignedParts,setUnassignedParts]= useState([]);

    const columns = [
      { accessor1: 'part_id', label: 'Part ID' ,width:"20%", textalign:"center"},
      { accessor1: 'part_short_description',label: 'Part Description' ,width:"60%", textalign:"left"},
      { accessor1: 'quantity_value', label: 'Quantity',width:"20%" , textalign:"center"},  
    ];

    useEffect(()=>{
        const token=localStorage.getItem('token');
        const poId=localStorage.getItem('purchase_order_id_vendor')
        console.log(poId)
          setToken(token)
          fetchVendorWiseList(token,poId).then((res)=>{setVendorList(res.data.data.output)})
          fetchUnassignedParts(token,poId).then((res)=>{setUnassignedParts(res.data.data.output[0].temp_part)})

          
    },[])

    console.log(unassignedParts)
    
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

    console.log(vendorList)

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
    <div className="vendor_list_subsection" style={{paddingLeft:'1.2rem'}}>
            <input  style={{width:"70%",height:'3.5rem'}} placeholder="Search.." value={searchText} onChange={(e)=>{searchParts(e.target.value);}}/>
            <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>

             {/* export parts table */}
             <div style={{width:'10rem',marginLeft:'10vw',marginRight:'0.8rem'}}>
                     <ReactHtmlTableToExcel
         table="partsTable"
         filename="stock_report"
         sheet="stock_report"
         buttonText="Export" 
         className="export_button" /></div>

                     <div className='export_symbol' style={{marginTop:'0.2rem'}}><FaExternalLinkAlt size={15} style={{color:"#3F5575"}} /></div>
             
        </div>

        <div className="vendor_list" style={{marginTop:"2rem"}}>
          <div className="vendor_title">Vendor List</div>

          {vendorList?vendorList.map((vendor)=>(
            <div key={vendor.id} className="single_vendor_card">
                <div className="vendor_name"># {vendor.vendor}</div> 

                <div className="vendor_table">
                    <div style={{display:'flex',paddingBottom:'0.5rem',borderBottom:'#e5e5e5 solid 0.1em'}}>
                        <div style={{width:'50%'}}>PART DESCRIPTION</div>
                        <div style={{width:'25%'}}>QUANTITY</div>
                        <div style={{width:'25%'}}>UNIT PRICE</div>
                    </div>
                    <div style={{paddingTop:'0.5rem'}}>
                    {vendor.invoice_products.map((part)=>(
                                <div key={part.id} style={{display:'flex',marginBottom:"0.5rem",fontWeight:"400"}}>
                                    <div style={{width:'50%'}}>{part.part_short_description}</div> 
                                    <div style={{width:'25%',display:'flex',justifyContent:'center'}}>{part.quantity}</div> 
                                    <div style={{width:'25%',display:'flex',justifyContent:'center'}}>{part.unit_price}</div>
                                    </div>
                                    )
                      
                    )}</div>
                    </div>
            </div>
          )):null}
        </div>
        <div className="vendor_list">
          <div className="vendor_title">Unassigned Parts</div>
            {unassignedParts?
            <Table key={unassignedParts.length} columns={columns} rows={unassignedParts} />
            :null}
        </div>
    </div>
        </div>
    )
}

export default VendorList;