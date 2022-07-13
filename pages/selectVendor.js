import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchPartWiseList } from "../services/purchaseOrderService";

import { FaSistrix,FaCheckCircle, FaTimesCircle} from 'react-icons/fa';
import PartsList from "../components/partList";


const SelectVendor=() =>{

    const [token,setToken]= useState(null);
    const [partsList,setPartsList]= useState([]);


    useEffect(()=>{
        const token=localStorage.getItem('token');
        setToken(token)
        fetchPartWiseList(token).then(res=>{setPartsList(res.data.data.output);console.log(res.data.data.output)})
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


    return(
        <div className="layout">
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
    {size.width>'600'?<Sidebar /> : <Header />}
    <div className="vendor_page">
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
            <PartsList key={part.id} partId={part.part_id} partName={part.short_description}
            quantity={part.quantity_value} unit={part.quantity_symbol} />
        )):null}</div>
    </div>

       
        </div>
    )
}

export default SelectVendor;