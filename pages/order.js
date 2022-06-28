import Spinner from "../components/spinner";
import Sidebar from "../components/sidebar";
import Dropdown from "../components/dropdown";
import Router from "next/router";
import Head from "next/head";
import Header from "../components/header";
import OrderList from "../components/orderList";

import Table from '../components/table';
import { useState, useEffect } from "react";



const Order=()=>{

    const [rows,setRows]= useState([
      {order_id:1,date:'22-03-2022',created_by:'tony stark', status:'Partially Processed'},
      {order_id:2,date:'12-04-2022',created_by:'barry allen', status:'Completed'},
      {order_id:3,date:'09-12-2022',created_by:'loki', status:'Pending'}
  ]);
    const [searchText,setSearchText]= useState(null);
    const [filterOnStatus,setFilterOnStatus]= useState(null);
    const [token,setToken]= useState(null);
    const [cardFilter, setCardFilter] = useState([]);
    const [listFilter, setListFilter] = useState([]);



    const status=[{name:'Completed',id:'Completed'},{name:'Partially Processed',id:'Partially Processed'},{name:'Pending',id:'Pending'}]

    const columns = [
        { accessor1: 'order_id', label: 'Order Number' ,width:"20%", textalign:"center"},
        { accessor1: 'date' ,label: 'Date' ,width:"20%", textalign:"center"},
        { accessor1: 'created_by', label: 'Created By',width:"30%" , textalign:"center"}, 
        { accessor1: 'status', label: 'Status',width:"30%" , textalign:"center"},  
      ];


    useEffect(()=>{
      if(localStorage.getItem('token') != undefined){
        localStorage.setItem('selected_item','orders')
        const token=localStorage.getItem('token')
        setToken(token)
      
    }else{
        Router.push('/login');
      }
        
    },[])

    useEffect(()=>{
      //  search table based on dropdown filter and searchbar value
       if(searchText != undefined && filterOnStatus !=undefined ){
        const searchList = rows.filter(o => Object.keys(o).some(
          k => String(o[k]).toLowerCase().includes(searchText.toLowerCase()))
        );
  
        const filterList= searchList.filter(o=> Object.keys(o).some(
          k=> String(o[k]).toLowerCase().includes(filterOnStatus.toLowerCase())
        ))
  
        setListFilter([...filterList])
       }
  
      //  search table based on searchbar value
       else if(searchText != undefined ){
         const searchList = rows.filter(o => Object.keys(o).some(
           k => String(o[k]).toLowerCase().includes(searchText.toLowerCase()))
         );
  
         setListFilter([...searchList])
       }
  
      //  search table based on dropdown filter
       else if(filterOnStatus !=undefined){
        const filterList= rows.filter(o=> Object.keys(o).some(
          k=> String(o[k]).toLowerCase().includes(filterOnStatus.toLowerCase())
        ))
        setListFilter([...filterList])
       }
       else{
         setRows([...rows])
         setListFilter([...rows])
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
                <Table columns={columns} rows={rows} search={searchText} filter={filterOnStatus} path="/orderDetails" cursor="pointer"
                width="77vw"/>
                </div>);
    }
    else{
      content=(
        rows?<div className="cards_list">
          {searchText != undefined || filterOnStatus != undefined?listFilter.map((l)=>(
              <OrderList key={l.order_id} order_number={l.order_id} date={l.date} created_by={l.created_by} status={l.status}/>))
          :rows.map((l)=>(
              <OrderList key={l.order_id} order_number={l.order_id} date={l.date} created_by={l.created_by} status={l.status}/>
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
                <div className="title">Orders</div>
                     <div className="sub_title">Database for all Available Stocks</div>
                    </div> 
                <div className="order_section">
                    <Dropdown options={status} placeholder="Status" name="name" width="15vw" height="3.5rem" 
                    parentCallback={(data)=>setFilterOnStatus(data.id)} dropdownWidth={size.width>'600'?'15vw':'30vw'} searchWidth={size.width>'600'?'12vw':'22vw'}/>
                    <input style={{height:'3.5rem',marginLeft:'2rem',width:'70%'}} value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
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

                {content}
                     

                     
                     </div>
        </div>
    )

}

export default Order;