import Spinner from "../components/spinner";
import Sidebar from "../components/sidebar";
import Dropdown from "../components/dropdown";
import Router from "next/router";
import Head from "next/head";
import Header from "../components/header";
import OrderList from "../components/orderList";

import Table from '../components/table';
import {FaSistrix} from 'react-icons/fa';
import { useState, useEffect } from "react";

import { fetchProductionOrderList } from "../services/productionOrderService";
import { fetchPurchaseOrderList } from "../services/purchaseOrderService";



const Order=()=>{

    const [searchText,setSearchText]= useState(null);
    const [filterOnStatus,setFilterOnStatus]= useState(null);
    const [token,setToken]= useState(null);
    const [cardFilter, setCardFilter] = useState([]);
    const [listFilter, setListFilter] = useState([]);
    const [productionOrderList,setProductionOrderList]= useState([]);



    const status=[{name:'Completed',id:'Completed'},{name:'Partially Processed',id:'Partially Processed'},{name:'Created',id:'Created'}]

    const columns = [
        { accessor1: 'production_order_no', label: 'Order Number' ,width:"20%", textalign:"center"},
        { accessor1: 'date' ,label: 'Date' ,width:"20%", textalign:"center"},
        { accessor1: 'created_by', label: 'Created By',width:"30%" , textalign:"center"}, 
        { accessor1: 'status', label: 'Status',width:"30%" , textalign:"center"},  
      ];


    useEffect(()=>{
      if(localStorage.getItem('token') != undefined){
        localStorage.setItem('selected_item','production_orders')
        const token=localStorage.getItem('token')
        setToken(token)
        fetchProductionOrderList(token).then(res=>setProductionOrderList(res.data.data.output))
      
    }else{
        Router.push('/login');
      }
        
    },[])
    console.log(productionOrderList)

    useEffect(()=>{
      //  search table based on dropdown filter and searchbar value
       if(searchText != undefined && filterOnStatus !=undefined ){
        const searchList = productionOrderList.filter(o => Object.keys(o).some(
          k => String(o[k]).toLowerCase().includes(searchText.toLowerCase()))
        );
  
        const filterList= searchList.filter(o=> Object.keys(o).some(
          k=> String(o[k]).toLowerCase().includes(filterOnStatus.toLowerCase())
        ))
  
        setListFilter([...filterList])
       }
  
      //  search table based on searchbar value
       else if(searchText != undefined ){
         const searchList = productionOrderList.filter(o => Object.keys(o).some(
           k => String(o[k]).toLowerCase().includes(searchText.toLowerCase()))
         );
  
         setListFilter([...searchList])
       }
  
      //  search table based on dropdown filter
       else if(filterOnStatus !=undefined){
        const filterList= productionOrderList.filter(o=> Object.keys(o).some(
          k=> String(o[k]).toLowerCase().includes(filterOnStatus.toLowerCase())
        ))
        setListFilter([...filterList])
       }
       else{
         setProductionOrderList([...productionOrderList])
         setListFilter([...productionOrderList])
       }
     },[searchText,filterOnStatus])

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


    let content= null;
    if(size.width>'600'){
      content=(<div className="order_table" >
                {productionOrderList?<Table columns={columns} rows={productionOrderList} search={searchText} filter={filterOnStatus} path="/orderDetails" cursor="pointer"
                width="77vw"/>:null}
                </div>);
    }
    else{
      content=(
        productionOrderList?<div className="order_card_list">
          {searchText != undefined || filterOnStatus != undefined?listFilter.map((l)=>(
              <OrderList key={l.id} order_number={l.production_order_no} date={l.date} path="/orderDetails" created_by={l.created_by} status={l.status}/>))
          :productionOrderList.map((l)=>(
              <OrderList key={l.id} order_number={l.production_order_no} date={l.date} path="/orderDetails" created_by={l.created_by} status={l.status}/>
          ))}
      </div> : <Spinner />
      )
    }

    return(
        <div  className="layout">
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            {size.width>'600'?<Sidebar /> : <Header />}
            <div className="order_page">
                <div className="order_title">
                <div className="title">Production Orders</div>
                     <div className="sub_title">Database for all Orders</div>
                    </div> 
                <div className="order_section">
                    <Dropdown options={status} placeholder="Status" name="name" width="15vw" height="3.5rem" border={true}
                    parentCallback={(data)=>setFilterOnStatus(data.id)} dropdownWidth={size.width>'600'?'15vw':'30vw'} searchWidth={size.width>'600'?'12vw':'22vw'}/>
                    <input style={{height:'3.5rem',marginLeft:'2rem',width:'70%'}} value={searchText} onChange={(e)=>setSearchText(e.target.value)}/><div><FaSistrix className="search_order"/></div>
                </div>

                <div style={{marginTop:'2rem',justifyContent:'space-between'}} className="order_section">
                    <div className="order_subtitle">Your Orders</div>
                    <div></div>
                    <button className="order_button" onClick={()=>Router.push('/newOrder')}>Create Order</button>
                </div>

                
                
                {size.width<'600'?<div className="order_list_header">
                  <div className="order_list_content" style={{paddingLeft:'1rem'}}>Order Number</div>
                  <div className="order_list_content">Date</div>
                  <div className="order_list_content">Created By</div>
                  <div className="order_list_content">Status</div>
                </div>:null}

                <div className="order_table" >
                {productionOrderList?<Table key={productionOrderList.length} columns={columns} rows={productionOrderList} search={searchText} filter={filterOnStatus} path="/orderDetails" cursor="pointer"
                width="77vw"/>:<Spinner/>}
                </div>
                     

                     
                     </div>
        </div>
    )

}

export default Order;