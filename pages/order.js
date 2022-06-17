import Spinner from "../components/spinner";
import Sidebar from "../components/sidebar";
import Dropdown from "../components/dropdown";
import Router from "next/router";
import Head from "next/head";
import Header from "../components/header";

import Table from '../components/table';
import { useState, useEffect } from "react";



const Order=()=>{

    const [rows,setRows]= useState([]);
    const [searchText,setSearchText]= useState(null);
    const [filterOnStatus,setFilterOnStatus]= useState(null);

    const status=[{name:'Completed',id:'Completed'},{name:'Partially Processed',id:'Partially Processed'},{name:'Pending',id:'Pending'}]

    const columns = [
        { accessor1: 'order_id', label: 'Order Number' ,width:"20%", textalign:"center"},
        { accessor1: 'date' ,label: 'Date' ,width:"20%", textalign:"center"},
        { accessor1: 'created_by', label: 'Created By',width:"30%" , textalign:"center"}, 
        { accessor1: 'status', label: 'Status',width:"30%" , textalign:"center"},  
      ];

    const rows1=[
        {order_id:1,date:'22-03-2022',created_by:'tony stark', status:'Partially Processed'},
        {order_id:2,date:'12-04-2022',created_by:'barry allen', status:'Completed'},
        {order_id:3,date:'09-12-2022',created_by:'loki', status:'Pending'}
    ]

    useEffect(()=>{
        localStorage.setItem('selected_item','orders')
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
        <div  className="layout">
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            {size.width>'600'?<Sidebar /> : <Header />}
            <div className="order_page">
                <div className="order_title">
                <div className="title">Orders</div>
                     <div className="sub_title">Database for all Available Stocks</div>
                    </div> 
                <div className="order_section">
                    <Dropdown options={status} placeholder="Status" name="name" width="15vw" height="3.5rem" 
                    parentCallback={(data)=>setFilterOnStatus(data.id)} dropdownWidth="15vw" searchWidth="12vw"/>
                    <input style={{height:'3.5rem',marginLeft:'2rem',width:'70%'}} value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
                </div>

                <div style={{marginTop:'2rem',justifyContent:'space-between'}} className="order_section">
                    <div className="order_subtitle">Your Orders</div>
                    <div></div>
                    <button className="order_button" onClick={()=>Router.push('/newOrder')}>Create Order</button>
                </div>

                <div className="order_table" >
                <Table columns={columns} rows={rows1} search={searchText} filter={filterOnStatus} path="/orderDetails" cursor="pointer"
                width="77vw"/>
                </div>
                     </div>
        </div>
    )

}

export default Order;