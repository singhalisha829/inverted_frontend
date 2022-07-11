import Spinner from "../components/spinner";
import Sidebar from "../components/sidebar";
import Dropdown from "../components/dropdown";
import Router from "next/router";
import { useState, useEffect } from 'react';
import Head from "next/head";
import Header from "../components/header";

import StockOutList from '../components/stockOutList';


import { FaSistrix,FaCheckCircle, FaTimesCircle} from 'react-icons/fa';



const NewOrder=()=>{
    const status=[{name:'paid',id:1},{name:'in progress',id:2},{name:'unpaid',id:3}]

    const order_type=[{value:'bom',name:'BOM'},{value:'part',name:'Parts'}]

    const [orderType,setOrderType]= useState(null);
    const [name,setName]= useState('');
    const [quantity,setQuantity]= useState('');
    const [stockOutList, setStockOutList]= useState([]);

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


    const submitHandler = () =>{
        if(name !='' && quantity != '' && orderType !=''){
            const data={
                order_type:orderType,
                name:name,
                quantity:quantity
            }
            const newList = [data,...stockOutList];
            setStockOutList(newList);
            setName('');
            setOrderType(()=>'');
            setQuantity('')
        }
    }

    const cancelHandler=() =>{

    }
    return(
        <div  className="layout">
             <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            {size.width>'600'?<Sidebar />: <Header />}
            <div className="new_order_page">
                <div className="new_order_title">
                <div className="title">Orders</div>
                     <div className="sub_title">Database for all Available Stocks</div>
                </div>

                <div className="new_order_subsection">
                    <input  style={{width:"70%"}} placeholder="Search.."/>
                    <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>
                </div>

                <div className="new_order_form">
                    <div style={{width:'25%'}}><label>Order Type:</label>
                    <Dropdown options={order_type} name="name" width="70%" parentCallback={(data)=>setOrderType(data.value)}
                    dropdownWidth={size.width>'600'?'13vw':'20vw'} searchWidth={size.width>'600'?'10vw':'12vw'} border={true}/></div>
                    <div style={{width:'25%'}}><label>Part Name:</label><input value={name} style={{height:'3rem',width:'70%'}}
                    onChange={(e)=>setName(e.target.value)}/></div>
                    <div style={{width:'25%'}}><label>Required Quantity</label>
                    <input type="number" value={quantity} style={{height:'3rem',width:'70%'}} onChange={(e)=>setQuantity(e.target.value)}/></div>
                    <div style={{width:'25%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div className="form_icons">
                   
            <FaCheckCircle onClick={submitHandler} size={30} className="check_icon"/>
            <FaTimesCircle size={30}  onClick={cancelHandler} className="cross_icon" />
            </div>
                    </div>

                    
                </div>

                {stockOutList.map((l)=><StockOutList key={l.name}
            deleteNote={(data)=>handleDeleteNote(data)}/>)}

<div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button className="cancel_button button2" onClick={()=>{Router.back();}}>Cancel</button>
                        <button className="save_button button2">Confirm</button>
                        </div></div>
                </div>
        </div>
    )   

}

export default NewOrder;