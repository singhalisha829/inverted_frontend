import { useState, useEffect } from "react";
import Router from 'next/router';
import Sidebar from "../components/sidebar";
import Table from "../components/table";
import Head from "next/head";
import Header from "../components/header";
import Spinner from "../components/spinner";
import Transactions from "../components/transactions";

import { fetchProductionOrderDetails, fetchPartWiseList ,fetchPastTransaction} from "../services/productionOrderService";
import { unitConversion } from "../services/purchaseOrderService";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from "../components/dropdown";


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
    const [quantity,setQuantity]= useState(null);
    const [unit,setUnit]= useState([]);

    const today= new Date();
    const todayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const [list,setList]=useState({
      production_order:productionOrderId,
      date:todayDate,
      production_order_item:[]
    })


      const column1 = [
        { accessor1: 'part_id', label: 'Part ID' ,width:"10%", textalign:"center"},
        { accessor1: 'short_description', label: 'Part Description' ,width:"30%", textalign:"center"},
        { accessor1: 'quantity_value',accessor2:'quantity_symbol',label: 'Required Quantity' ,width:"20%", textalign:"center"},
        { accessor1: 'part_quantity_value', accessor2: 'part_quantity_symbol',label:'Available Quantity',width:"20%" , textalign:"center"},  

      ];

   

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
              const sorted = [...res.data.data.output].reverse();
              setPastTransactions(sorted)
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

    const handleQuantity=(value,data)=>{
      setQuantity(value,unit);
      const factor=null;
      const unitIndex=unit.findIndex(el=>el.id==data.id);
      if(unitIndex != -1){
      unitConversion(token,data.available_qty_symbol,unit[unitIndex].unit).then(res=>{console.log(res.data);
        if(res.data.status.code== 404){
          toast.error(res.data.status.description);
        }else if(data.released_quantity_value<quantity*factor){
          toast.warning('Entered Quantity exceeds the Available Quantity! ');
        }
        else{
      factor=res.data.output[0].conversion_factor;
      if(data.available_qty<value*factor){
        toast.warning('Entered Quantity exceeds the Required Qunatity! ');
      }else{
        const left_quantity=data.released_quantity_value-(value*factor);
      handleQuantitys(value,data.id,data.product_code,unit[unitIndex].unit,data.product_description,data.item_id,data.ItemType,left_quantity,data.released_quantity_unit_symbol);
      }
      }})
    }
    }

    const handleUnit=(unit_symbol,data)=>{
      // console.log(unit,available_qty,released_quantity_value,released_quantity_unit_symbol,available_qty_symbol,id,product_code,product_description,item_id,ItemType)
      const factor=null;
      unitConversion(token,data.available_qty_symbol,unit_symbol).then(res=>{console.log(res.data);
        if(res.data.status.code== 404){
          toast.error(res.data.status.description);
        
        }else{
          const unitIndex=unit.findIndex(el=>el.id==id);
          if(unitIndex == -1){
            const unitList=[...unit,{id:data.id,unit:unit_symbol}]
            setUnit(unitList);
          }else{
            unit[unitIndex].unit=unit_symbol;
          }
      factor=res.data.output[0].conversion_factor;
      if(data.available_qty<quantity*factor){
        toast.warning('Entered Quantity exceeds the Available Quantity! ');
        
      }else if(data.released_quantity_value<quantity*factor){
        toast.warning('Entered Quantity exceeds the Required Quantity! ');
      }
      else{
        const left_quantity=data.released_quantity_value-(quantity*factor);
        console.log(left_quantity,factor,data.available_qty)
      handleQuantitys(quantity,data.id,data.product_code,unit_symbol,data.product_description,data.item_id,data.ItemType,left_quantity,data.released_quantity_unit_symbol);
      }
      }})
      
    }

    const handleBOMQuantity=(value,data)=>{
      if(value>data.available_qty){
        toast.warning('Entered Quantity is greater than Available Quantity');

      }else if(value>data.released_quantity_value){
        toast.warning('Entered Quantity is greater than Required Quantity');
      }else{
        const left_quantity=data.released_quantity_value-value;
        console.log(left_quantity)
      handleQuantitys(value,data.id,data.product_code,"Nos",data.product_description,data.item_id,data.ItemType,left_quantity,"Nos");
      }
    }

    const handleQuantitys=(value,id,item_name,symbol,item_description,item_id,items_type,left_qty,left_qty_symbol)=>{
      var productList=list.production_order_item;
      const index= productList.findIndex(el=>el.item_id==item_id);
      
      if(index== -1){
        productList.push({
          production_order_items:id,
          quantity:value+" "+symbol,
          item_name:item_name,
          item_id:item_id,
          items_type:items_type,
          item_description:item_description,
          left_qty:left_qty+" "+left_qty_symbol,
        })
      }else{
          productList[index].quantity=value+" "+symbol;
        
      }

      setList({...list,production_order_item:productList})
      localStorage.setItem('stock_out_list',JSON.stringify(list))
    }
   

    const stockOut=()=>{
      console.log("list",list)
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
                            <div style={{width:'25%'}}>{status}</div>
                        </div>
                    </div>

                    {status != 'Completed'?<div className="order_details_subheader">
                        Your Orders
                        <button onClick={stockOut}>Stock Out</button>
                    </div>  :null}
                    {status != 'Completed'?<div className="order_detail_table">
                       {orderItem?<div>
                        <div className="po_detail_part_header rows" >
                            <div style={{width:'15%'}}>TYPE</div>
                            <div style={{width:'15%'}}>ID</div>
                            <div style={{width:'25%'}}>DESCRIPTION</div>
                            <div style={{width:'15%'}}>REQUIRED QUANTITY</div>
                            <div style={{width:'30%'}}>STOCK RELEASED</div>
                        </div>
                        {orderItem.map((part,index)=>{
                          return(
                            <div key={index} className="po_detail_part_rows" style={{color:'#3F5575'}}>
                            <div style={{width:'15%'}}>{part.ItemType}</div>
                            <div style={{width:'15%'}}>{part.product_code}</div>
                            <div style={{width:'25%'}}>{part.product_description}</div>
                            <div style={{width:'15%'}}>{part.released_quantity_value} {part.released_quantity_value==0?null:part.released_quantity_unit_symbol} / {part.quantity_value} {part.quantity_symbol}</div>
                            <div style={{width:'30%'}}>
                              {part.released_quantity_value != 0?<div style={{display:'flex'}}>{part.ItemType == 'BOM'?
                              <input type="number" style={{border:border}} className="quantity_field" placeholder="1"
                onChange={(e)=>handleBOMQuantity(
                  e.target.value,part)}/>
                  :
                  <div style={{display:'flex',width:size.width>'600'?'65%':'90%', border:"#e5e5e5 solid 0.1em",borderRadius:'5px'}}>
                    <input style={{width:"40%",height:"3rem",border:'none'}} className="quantity" type="number" 
                onChange={(e)=>handleQuantity(e.target.value,part)} placeholder="0.00"/>
                   <div style={{borderLeft:"#e5e5e5 solid 0.1em"}} />
                   {part.unit_name_list?<Dropdown options={part.unit_name_list} isUnitList="true" placeholder="Unit" width="100%" name="symbol" minWidth="9rem" no_outline={true}
                parentCallback={(data)=>{handleUnit(data.symbol,part)}} 
                dropdownWidth={size.width>'600'?"11vw":'40vw'} searchWidth={size.width>'600'?"8vw":'30vw'} height="3rem"/>:null}</div>                    
                  }
                  <span className="available_quantity" style={{textAlign:'left'}}>*Only {part.available_qty} {part.available_qty_symbol} available</span></div>:null}

                            </div>
                        </div>
                          )
                        })}
                      </div>:<Spinner/>} 
                      </div>:null}

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