import Sidebar from '../components/sidebar';
import { useState, useEffect } from 'react';
import { FaSistrix } from 'react-icons/fa';
import Router from 'next/router';
import Head from 'next/head';

import Table from '../components/table';
import Header from '../components/header';
import Spinner from '../components/spinner';


const StockOut=() =>{
    const [searchText,setSearchText] = useState(null);
    const [token,setToken]= useState(null);
    const [stockOutList,setStockOutList]= useState(null);

    const columns = [
        { accessor1: 'item_name', label: 'Part ID' ,width:"33%", textalign:"center"},
        { accessor1: 'item_description' ,label: 'Name' ,width:"33%", textalign:"center"},
        { accessor1: 'quantity_value', accessor2:'quantity_symbol',label: 'Quantity',width:"33%" , textalign:"center"},  
      ];
      

    useEffect(()=>{
      if(localStorage.getItem('token') != undefined){
        const token=localStorage.getItem('token')
        setToken(token)
        const list=JSON.parse(localStorage.getItem("stock_out_list") || "[]");
        console.log(list[0])
        setStockOutList(list)
      
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
    // console.log(stockOutList)
    // console.log(stockOutList[0]?stockOutList[0]:null)

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
                    <div style={{marginTop:'1rem'}}>{stockOutList?<Table columns={columns} rows={stockOutList} width="100%"/>:<Spinner />}</div>
                    {/* {stockOutList?stockOutList.map((el)=>{<div>{el.id}</div>}:null} */}
                </div>

                <div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button className='cancel_button button2' onClick={()=>{Router.back();}}>Cancel</button>
                        <button className='save_button button2'>Create Order</button>
                        </div>
                </div>
            </div>  
        </div>
    )
}

export default StockOut;