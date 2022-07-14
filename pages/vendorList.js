import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { FaSistrix,FaExternalLinkAlt} from 'react-icons/fa';

import ReactHtmlTableToExcel from "react-html-table-to-excel";

import { fetchVendorWiseList } from "../services/purchaseOrderService";

const VendorList = () =>{

    const [vendorList, setVendorList] = useState([]);
    const [token,setToken]= useState(null);
    const [searchText,setSearchText]= useState(null);

    useEffect(()=>{
        const token=localStorage.getItem('token');
        const poId=localStorage.getItem('purchase_order_id_vendor')
        console.log(poId)
          setToken(token)
          fetchVendorWiseList(token,poId).then((res)=>setVendorList(res.data.data.output))
          
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
    <div className="new_order_subsection" style={{height:'6rem',paddingLeft:'1.2rem'}}>
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
    </div>
        </div>
    )
}

export default VendorList;