import { FaTrashAlt, FaPen } from 'react-icons/fa';

const PurchaseOrderList = (props) =>{  
    return(
        <div className="stock_out_list">
        <div style={{width:"15%",paddingLeft:'1rem'}}>{props.order_type}</div>
        <div style={{width:"15%"}}>{props.order_name}</div>

           <div  style={{width:"35%"}}>{props.desc}</div>
           <div  style={{width:"20%"}}>{props.quantity} </div>
           <div className="icons" style={{width:"15%",display:'flex',justifyContent:'center'}}>
               {/* <FaPen style={{color:"#c4c4c4"}} /> */}
           <div className='trash'><FaTrashAlt style={{color:"#F16B6B"}} onClick={()=>props.deleteOrder(props.order_name)}  size={17} /></div></div>

        </div>
    )
}

export default PurchaseOrderList;