import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';


import Table from '../components/table';
import Spinner from '../components/spinner';



import { fetchPurchaseOrderList } from "../services/purchaseOrderService";
import {ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import OrderList from "../components/orderList";


const PurchaseOrder =() =>{
    const [token,setToken]= useState(null);
    const [searchText,setSearchText]= useState(null);
    const [purchaseOrderList, setPurchaseOrderList] = useState(null);

    const columns = [
      { accessor1: 'purchase_order_no', label: 'Order ID' ,width:"25%", textalign:"center"},
      { accessor1: 'date', label:'Date'  ,width:"25%", textalign:"center",sort:'DSC'},
      {accessor1:'created_by',label:'Created By', width:'25%',textalign:'center'},
      { accessor1: 'status', label: 'Status',width:"25%" , textalign:"center"},  

    ];

    useEffect(()=>{
        if(localStorage.getItem('token') != undefined){
            localStorage.setItem('selected_item','purchase_orders')
            const token=localStorage.getItem('token')
            setToken(token)

            fetchPurchaseOrderList(token).then(res=> {console.log(res.data.data.output);setPurchaseOrderList(res.data.data.output)})
            .catch(err=> toast.error(err.message))
          
        }else{
            Router.push('/login');
          }
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

    let content=null;
    if(size.width>'600'){
      content=   (purchaseOrderList?<Table key={purchaseOrderList.length} id="purchaseOrderTable" rows={purchaseOrderList} columns={columns} cursor="pointer" search={searchText} 
      width={size.width>'600'?'77vw':'95vw'} path="/vendorList"/>:<Spinner />) 
    }else{
      content=(
        purchaseOrderList?              
        <OrderList  path="/vendorList" ordersList={purchaseOrderList} search={searchText}/>
        : <Spinner />
      )
    }
    return(
        <div className="layout">
            <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
    {size.width>'600'?<Sidebar /> : <Header />}

    <div className="purchase_order_page">
    <ToastContainer/>

    <div className="order_title">
                <div className="title">Purchase Orders</div>
                     <div className="sub_title">Database for all Orders</div>
                    </div> 

      <div className="po_subsection">
        <input placeholder="Search for code or name" style={{width:'50vw',marginLeft:'1.3rem',height:'3.5rem',background:"#F6F7FB"}} onChange={(e)=>setSearchText(e.target.value)}/>
        <button style={{marginLeft:'2rem'}}>Search</button>
      </div>

      <div className="order_section" style={{justifyContent:'space-between'}}>
        <div className="order_subtitle">Your Orders</div>
        <button onClick={()=>Router.push('/newPurchaseOrder')}>Create Order</button>
        </div>
      <div className="po_table">{content}</div>
    </div>
    </div>
    )
}

export default PurchaseOrder;