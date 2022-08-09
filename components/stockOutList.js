import { FaTrashAlt, FaPen } from 'react-icons/fa';

const StockOutList = (props) =>{
        
   return(
        <div className="stock_out_list">
        <div style={{width:"25%"}}>Order Type</div>

           <div  style={{width:"25%"}}>Part Name</div>
           <div  style={{width:"25%"}}>Quantity</div>
           <div className="icons" style={{width:"25%",display:'flex',justifyContent:'center'}}>
               {/* <FaPen style={{color:"#c4c4c4"}} /> */}
           <FaTrashAlt style={{color:"#F16B6B"}} onClick={()=>props.deleteNote(props.partId)}  size={17} cursor="pointer"/></div>

        </div>
    )
}

export default StockOutList;