import { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp} from 'react-icons/fa';


const Transactions=(props)=>{
    const [showDetails,setShowDetails]= useState(false)
return(
    <div className='transaction'>
       
        <div className="transaction_card common" onClick = {()=>setShowDetails(!showDetails)}>
            <div className='common' style={{width:'33%'}}>{props.date}</div>
            <div className='common' style={{width:'33%'}}>{props.transaction_id}</div>
            <div className='common' style={{width:'33%'}}>{props.created_by}</div>
            {/* <div className='common' style={{width:'10%'}}>{showDetails?<FaAngleUp/>:<FaAngleDown/>}</div> */}
        </div>
        {showDetails?<div className='transaction_details'>
        <div className="transaction_order_detail_header">
                            <div style={{width:'20%'}} className="common">TYPE</div>
                            <div style={{width:'20%'}} className="common">ID</div>
                            <div style={{width:'40%'}} className="common">DESCRIPTION</div>
                            <div style={{width:'20%'}} className="common">QUANTITY</div>
                        </div>
                        {props.part_details.map((part)=>(<div className='transaction_order_column' key={part.id}>
                            <div style={{width:'20%'}} className="common">{part.ItemType}</div>
                            <div style={{width:'20%'}} className="common">{part.product_code}</div>
                            <div style={{width:'40%'}} className="common">{part.product_description}</div>
                            <div style={{width:'20%'}} className="common">{part.quantity}</div>
                        </div>))
}
        </div>:null}
        <hr className='transaction_hr'/>
    </div>
)
}

export default Transactions;