import { useState, useEffect } from "react";
import Router from 'next/router';
import Sidebar from "../components/sidebar";
import Table from "../components/table";
import Head from "next/head";
import Header from "../components/header";
import Spinner from "../components/spinner";
import Transactions from "../components/transactions";

import { fetchProductionOrderDetails, fetchPartWiseList ,fetchPastTransaction} from "../services/productionOrderService";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const OrderDetails=()=>{

    const [orderItem,setOrderItem]= useState();
    const [partsInOrder,setPartsInOrder] = useState();
    const [pastTransactions,setPastTransactions] = useState(null);
    const [token,setToken]= useState(null);
    const [orderNumber,setOrderNumber]= useState(null);
    const [date,setDate]= useState(null);
    const [createdBy,setCreatedBy]= useState(null);
    const [status,setStatus]= useState(null);
    const [productionOrderId,setProductionOrderId]= useState(null);

    var list={};

    const columns = [
        { accessor1: 'ItemType', label: 'Type' ,width:"20%", textalign:"center"},
        { accessor1: 'product_code',label: 'ID' ,width:"25%", textalign:"center"},
        { accessor1: 'quantity_value',accessor2:'quantity_symbol', label: 'Required Quantity',width:"25%" , textalign:"center"}, 
        { accessor1: 'stock_released', label: 'Stock Released',width:"30%" , textalign:"left"},  

      ];

      const column1 = [
        { accessor1: 'part_id', label: 'Part ID' ,width:"10%", textalign:"center"},
        { accessor1: 'short_description', label: 'Part Description' ,width:"30%", textalign:"center"},
        { accessor1: 'quantity_value',accessor2:'quantity_symbol',label: 'Required Quantity' ,width:"20%", textalign:"center"},
        { accessor1: 'part_quantity_value', accessor2: 'part_quantity_symbol',label:'Available Quantity',width:"20%" , textalign:"center"},  

      ];
      const today= new Date();
      const todayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


      list={
        production_order:productionOrderId,
        date:todayDate,
        production_order_item:[]
      }

   

      useEffect(()=>{
        if(localStorage.getItem('token') != undefined){
      localStorage.setItem('stock_out_list',null)
          const token=localStorage.getItem('token')
          const poId=localStorage.getItem('production_order_id');
          console.log(poId);
          if(poId != undefined){
          setProductionOrderId(poId);

          fetchProductionOrderDetails(token,poId).then(res=>{
            setOrderItem(res.data.data.output[0].production_order_itemss)
            setOrderNumber(res.data.data.output[0].production_order_no)
            setDate(res.data.data.output[0].date)
            setCreatedBy(res.data.data.output[0].created_by)
            setStatus(res.data.data.output[0].status)
          })

          fetchPastTransaction(token,poId).then(res=>{
            if(res.data.data != undefined){
              setPastTransactions(res.data.data.output)
            }
            })

          fetchPartWiseList(token,poId).then(res=>{
            setPartsInOrder(res.data.data.output.order_items)
          })
          setToken(token)
          
        }else{
          Router.push('/order')
        }
        
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

    const handleQuantity=(value,id,item_name,symbol,item_description,item_id,items_type,left_qty,left_qty_symbol)=>{
      // const today=new Date();
      // const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      // const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // const dateTime = date+' '+time;      
      const index= list.production_order_item.findIndex(el=>el.item_id==item_id);
      console.log(list,index)

      if(index== -1){
        list.production_order_item.push({
          production_order_items:id,
          quantity:value+" "+symbol,
          item_name:item_name,
          item_id:item_id,
          items_type:items_type,
          item_description:item_description,
          left_qty:left_qty+" "+left_qty_symbol,
        })
      }else{
          list.production_order_item[index].quantity=value+" "+symbol;
        
      }
      localStorage.setItem('stock_out_list',JSON.stringify(list))
    }
   

    const stockOut=()=>{
      if(list.production_order_item.length>0){
      localStorage.setItem('production_order_id',productionOrderId); 
      Router.push('/stockOut')
      }else{
        toast.warning('No Items are Added!')
      }
    }

    return(
        <div className="layout">
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            {size.width>'600'?<Sidebar />: <Header show={true}/>}
            <div className="order_details_page">
              <ToastContainer />
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
                        <button onClick={stockOut}>Stock Out</button>
                    </div>  
                    <div className="order_detail_table">
                      {orderItem?<Table rows={orderItem} columns={columns} width="100%" outOf={true}
                      handleQuantity={(value,id,item_name,symbol,item_description,item_id,items_type,left_qty,left_qty_symbol)=>handleQuantity(value,id,item_name,symbol,item_description,item_id,items_type,left_qty,left_qty_symbol)}/>:<Spinner />}</div>
                </div>

                <div className="parts_in_order">
                    {partsInOrder?<Table columns={column1} rows={partsInOrder} width="100%" outOf={false}/>:<Spinner />}
                </div>

                {pastTransactions?<div >
                   {pastTransactions.length !=0?<div className="past_transaction"> <div className="transaction_header">Past Transactions</div>
                   <div className="transaction_card common" style={{borderBottom:'#e5e5e5 solid 0.01em',color:'#6b6b6b',cursor:'default'}}>
            <div className='common' style={{width:'33%'}}>DATE</div>
            <div className='common' style={{width:'33%'}}>TRANSACTION ID</div>
            <div className='common' style={{width:'33%'}}>CREATED BY</div>
            {/* <div className='common' style={{width:'10%'}}></div> */}
        </div>
                    {pastTransactions.map(transaction=>(
                      <Transactions key={transaction.transaction_no} date={transaction.date} transaction_id={transaction.transaction_no} created_by={transaction.created_by} 
                      part_details={transaction.part_details}/>
                    ))}</div>:null}
                </div>:null}
            </div>
        </div>
    )

}

export default OrderDetails;