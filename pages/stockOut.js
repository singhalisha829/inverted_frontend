import Sidebar from '../components/sidebar';
import { useState, useEffect } from 'react';
import { FaSistrix } from 'react-icons/fa';
import Router from 'next/router';
import Head from 'next/head';

import Table from '../components/table';
import Header from '../components/header';
import Spinner from '../components/spinner';
import { createProductionOrderTransaction} from '../services/productionOrderService';
import { toast } from 'react-toastify';


const StockOut=() =>{
    const [searchText,setSearchText] = useState(null);
    const [token,setToken]= useState(null);
    const [stockOutList,setStockOutList]= useState(null);
    const [productionOrderId,setProductionOrderId]= useState(null);

    const columns = [
        { accessor1: 'item_name', label: 'Part ID' ,width:"33%", textalign:"center"},
        { accessor1: 'item_description' ,label: 'Name' ,width:"33%", textalign:"center"},
        { accessor1: 'quantity',label: 'Quantity',width:"33%" , textalign:"center"},  
      ];
      

    useEffect(()=>{
      if(localStorage.getItem('token') != undefined){
        const id=localStorage.getItem('production_order_id');
        console.log(id)
        setProductionOrderId(id);
        const token=localStorage.getItem('token');
        setToken(token)
        const list=JSON.parse(localStorage.getItem("stock_out_list") || "{}");
        setStockOutList(list)
        console.log(list)

      
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
    
    const submitHandler=()=>{

      createProductionOrderTransaction(token,stockOutList).then(res=>{
        localStorage.setItem('production_order_id',productionOrderId);
        Router.push('/orderDetails');
      });
    }

    return(
        <div className='layout'>
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            {size.width>'600'?<Sidebar />: <Header />}
            <div className='stockout_page'>
            <div className="order_title">
                <div className='title'>Stock Out</div>
                     <div className='sub_title'>Database for all Available Stocks</div>
                    </div> 
                

                <div className="parts_list">
                    <div className="stock_out">Stock Out</div>
                    <div style={{marginTop:'1rem'}}>{stockOutList?<Table columns={columns} rows={stockOutList.production_order_item} width="100%" outOf={false}/>:<Spinner />}</div>
                    {/* {stockOutList?stockOutList.map((el)=>{<div>{el.id}</div>}:null} */}
                </div>

                <div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button className='cancel_button button2' onClick={()=>{Router.push('/orderDetails');localStorage.setItem('production_order_id',productionOrderId)}}>Cancel</button>
                        <button className='save_button button2' onClick={submitHandler}>Confirm</button>
                        </div>
                </div>
            </div>  
        </div>
    )
}

export default StockOut;