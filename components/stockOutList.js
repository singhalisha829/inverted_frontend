import { FaTrashAlt, FaPen } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { fetchPartById } from '../services/stockInService';

const StockOutList = (props) =>{
    const [partId, setPartId] = useState(null);
    const [partName, setPartName] = useState(null);

    useEffect(()=>{
        const token= localStorage.getItem('token')

    },[])
    
    return(
        <div className="stock_out_list">
        <div style={{width:"25%"}}>Order Type</div>

           <div  style={{width:"25%"}}>Part Name</div>
           <div  style={{width:"25%"}}>Quantity</div>
           <div className="icons" style={{width:"25%",display:'flex',justifyContent:'center'}}>
               {/* <FaPen style={{color:"#c4c4c4"}} /> */}
           <FaTrashAlt style={{color:"#F16B6B"}} onClick={()=>props.deleteNote(props.partId)}  size={17}/></div>

        </div>
    )
}

export default StockOutList;