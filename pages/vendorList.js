import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchVendorWiseList } from "../services/purchaseOrderService";

const VendorList = () =>{

    const [vendorList, setVendorList] = useState([]);
    const [token,setToken]= useState(null);

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
    {/* <div>{vendorList?vendorList:null}</div> */}
        </div>
    )
}

export default VendorList;