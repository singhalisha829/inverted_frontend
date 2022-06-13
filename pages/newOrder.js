import Spinner from "../components/spinner";
import Sidebar from "../components/sidebar";
import Dropdown from "../components/dropdown";
import Router from "next/router";
import { useState } from 'react';
import Head from "next/head";

import StockOutList from '../components/stockOutList';


import { FaSistrix,FaCheckCircle, FaTimesCircle} from 'react-icons/fa';



const NewOrder=()=>{
    const status=[{name:'paid',id:1},{name:'in progress',id:2},{name:'unpaid',id:3}]

    const order_type=[{value:'bom',name:'BOM'},{value:'part',name:'Parts'}]

    const [orderType,setOrderType]= useState(null);
    const [name,setName]= useState('');
    const [quantity,setQuantity]= useState('');
    const [stockOutList, setStockOutList]= useState([]);


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
            <Sidebar />
            <div className="new_order_page">
                <div className="new_order_title">
                <div style={{fontWeight:'600',fontSize:'3rem',lineHeight:'3.6rem',marginBottom:'0.5rem'}}>Orders</div>
                     <div style={{fontWeight:'400',fontSize:'1.6rem',lineHeight:'1.9rem'}}>Database for all Available Stocks</div>
                </div>

                <div className="new_order_subsection">
                    <input  style={{width:"70%"}} placeholder="Search.."/>
                    <div style={{marginTop:'1rem',position:'absolute',right:'27.5vw'}}><FaSistrix size={17} color="#3F5575"/></div>
                </div>

                <div className="new_order_form">
                    <div style={{width:'25%'}}><label>Order Type:</label>
                    <Dropdown options={order_type} name="name" width="70%" parentCallback={(data)=>setOrderType(data.value)}
                    dropdownWidth="13vw" searchWidth="10vw"/></div>
                    <div style={{width:'25%'}}><label>Part Name:</label><input value={name} style={{height:'3rem',width:'70%'}}
                    onChange={(e)=>setName(e.target.value)}/></div>
                    <div style={{width:'25%'}}><label>Required Quantity</label>
                    <input type="number" value={quantity} style={{height:'3rem',width:'70%'}} onChange={(e)=>setQuantity(e.target.value)}/></div>
                    <div style={{width:'25%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div className="form_icons">
                   
            <FaCheckCircle onClick={submitHandler} size={30} color="#33B850" cursor="pointer"/>
            <FaTimesCircle size={30} color="#F16B6B" onClick={cancelHandler} cursor="pointer"/>
            </div>
                    </div>

                    
                </div>

                {stockOutList.map((l)=><StockOutList key={l.name}
            deleteNote={(data)=>handleDeleteNote(data)}/>)}

<div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button style={{marginRight:'2rem',backgroundColor: '#F8F8F8',border: '2px solid rgba(63, 85, 117, 0.1)',
                    color:'#3F5575'}} onClick={()=>{Router.back();}}>Cancel</button>
                        <button style={{backgroundColor:"#33B850"}}>Confirm</button>
                        </div></div>
                </div>
        </div>
    )   

}

export default NewOrder;