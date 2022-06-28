import Sidebar from '../components/sidebar';
import { useState, useEffect } from 'react';
import { FaSistrix } from 'react-icons/fa';
import Router from 'next/router';
import Head from 'next/head';

import Table from '../components/table';
import Header from '../components/header';


const StockOut=() =>{
    const [searchText,setSearchText] = useState(null);
    const [token,setToken]= useState(null);

    const columns = [
        { accessor1: 'id', label: 'Part ID' ,width:"33%", textalign:"left"},
        { accessor1: 'name' ,label: 'Name' ,width:"33%", textalign:"left"},
        { accessor1: 'quantity', label: 'Quantity',width:"33%" , textalign:"center"},  
      ];
      
    const rows=[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

    useEffect(()=>{
      if(localStorage.getItem('token') != undefined){
        const token=localStorage.getItem('token')
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
                <div className="stockout_search">
                <input placeholder="Search.." style={{height:'3.5rem',width:'70%'}} value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
                <div className='search_symbol' style={{marginTop:'1rem'}}><FaSistrix size={17} style={{color:"#3F5575"}}/></div>
                </div>

                <div className="parts_list">
                    <div className="stock_out">Stock Out</div>
                    <div style={{marginTop:'1rem'}}><Table columns={columns} rows={rows} width="100%"/></div>
                </div>

                <div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button style={{marginRight:'2rem',backgroundColor: '#F8F8F8',border: '2px solid rgba(63, 85, 117, 0.1)',
                    color:'#3F5575'}} onClick={()=>{Router.back();}}>Cancel</button>
                        <button style={{backgroundColor:"#33B850"}}>Confirm</button>
                        </div>
                </div>
            </div>  
        </div>
    )
}

export default StockOut;