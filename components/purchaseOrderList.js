import { FaTrashAlt, FaPen } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { fetchPartById } from '../services/stockInService';

const PurchaseOrderList = (props) =>{
    const [orderName, setOrderName] = useState(null);

    useEffect(()=>{
        const token= localStorage.getItem('token')
        fetchPartById(props.order_name,token).then((res)=>{
        setOrderName(res.data.short_description)})
    },[])
    
    
    return(
        <div className="stock_out_list">
        <div style={{width:"25%"}}>{props.order_type}</div>

           <div  style={{width:"25%"}}>{orderName}</div>
           <div  style={{width:"25%",display:'flex'}}>{props.quantity} </div>
           <div className="icons" style={{width:"25%",display:'flex',justifyContent:'center'}}>
               {/* <FaPen style={{color:"#c4c4c4"}} /> */}
           <FaTrashAlt style={{color:"#F16B6B"}} onClick={()=>props.deleteNote(props.order_name)}  size={17} cursor="pointer"/></div>

        </div>
    )
}

export default PurchaseOrderList;