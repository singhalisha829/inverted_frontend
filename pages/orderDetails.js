import { useState, useEffect } from "react";
import Router from 'next/router';
import Sidebar from "../components/sidebar";
import Table from "../components/table";
import Head from "next/head";
import Header from "../components/header";
import Spinner from "../components/spinner";

import { fetchProductionOrderDetails, fetchPartWiseList } from "../services/productionOrderService";

const OrderDetails=()=>{

    const [orderItem,setOrderItem]= useState();
    const [partsInOrder,setPartsInOrder] = useState();
    const [pastTransactions,setPastTransactions] = useState([{},{}])
    const [token,setToken]= useState(null);
    const [orderNumber,setOrderNumber]= useState(null);
    const [date,setDate]= useState(null);
    const [createdBy,setCreatedBy]= useState(null);
    const [status,setStatus]= useState(null);


    const columns = [
        { accessor1: 'ItemType', label: 'Type' ,width:"25%", textalign:"center"},
        { accessor1: 'item_name',label: 'ID' ,width:"25%", textalign:"center"},
        { accessor1: 'quantity', label: 'Required Quantity',width:"25%" , textalign:"center"}, 
        { accessor1: 'stock_released', label: 'Stock Released',width:"25%" , textalign:"center"},  

      ];

      const column1 = [
        { accessor1: 'part_id', label: 'Part ID' ,width:"33%", textalign:"left"},
        { accessor1: 'short_description', label: 'Part Description' ,width:"33%", textalign:"left"},
        { accessor1: 'required_quantity',label: 'Required Quantity' ,width:"33%", textalign:"center"},
        { accessor1: 'available_stock', label: 'Available Stock',width:"33%" , textalign:"center"},  

      ];

      const column2 = [
        { accessor1: 'date', label: 'Date' ,width:"33%", textalign:"left"},
        { accessor1: 'transaction_id',label: 'Transaction ID' ,width:"33%", textalign:"left"},
        { accessor1: 'created_by', label: 'Created By',width:"33%" , textalign:"left"},   
      ];

      useEffect(()=>{
        if(localStorage.getItem('token') != undefined){
          const token=localStorage.getItem('token')
          const poId=localStorage.getItem('production_order_id');
          console.log(poId);
          fetchProductionOrderDetails(token,poId).then(res=>{
            setOrderItem(res.data.data.output[0].production_order_itemss)
            setOrderNumber(res.data.data.output[0].production_order_no)
            setDate(res.data.data.output[0].date)
            setCreatedBy(res.data.data.output[0].created_by)
            setStatus(res.data.data.output[0].status)
          })

          fetchPartWiseList(token,poId).then(res=>{
            console.log(res.data);
            setPartsInOrder(res.data.data.output.order_items)
          })
          setToken(token)
        
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


    return(
        <div className="layout">
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            {size.width>'600'?<Sidebar />: <Header show={true}/>}
            <div className="order_details_page">
            <div className="order_title">
                <div className="title">Orders</div>
                     <div className="sub_title">Database for all Available Stocks</div>
                    </div> 
                <div className="order_details">
                    <div className="order_header">
                        <div className="rows" style={{color:"#6B6B6B",marginBottom:'1rem'}}>
                            <div style={{width:'25%'}}>Order No.</div>
                            <div style={{width:'25%'}}>Date</div>
                            <div style={{width:'25%'}}>Created By</div>
                            <div style={{width:'25%'}}>Status</div>
                        </div>
                        <div className="rows" style={{color:'#3F5575'}}>
                        <div style={{width:'25%'}}>{orderNumber?orderNumber:null}</div>
                            <div style={{width:'25%'}}>{date?date:null}</div>
                            <div style={{width:'25%'}}>{createdBy?createdBy:null}</div>
                            <div style={{width:'25%'}}>{status==="Created"?"Pending":null}</div>
                        </div>
                    </div>

                    <div className="order_details_subheader">
                        Your Orders
                        <button onClick={()=> Router.push('/stockOut')}>Stock Out</button>
                    </div>  
                    <div className="order_detail_table">
                      {orderItem?<Table rows={orderItem} columns={columns} width="100%"/>:<Spinner />}</div>
                </div>

                <div className="parts_in_order">
                    {partsInOrder?<Table columns={column1} rows={partsInOrder} width="100%"/>:<Spinner />}
                </div>

                <div className="past_transaction">
                    <div className="transaction_header">Past Transactions</div>
                    <div><Table columns={column2} rows={pastTransactions} width="100%" /></div>
                </div>
            </div>
        </div>
    )

}

export default OrderDetails;