import { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp} from 'react-icons/fa';


const Transactions=(props)=>{
    const [showDetails,setShowDetails]= useState(false)
return(
    <div className='transaction'>
       
        <div className="transaction_card common">
            <div className='common' style={{width:'33%'}}>{props.date}</div>
            <div className='common' style={{width:'33%'}}>{props.transaction_id}</div>
            <div className='common' style={{width:'33%'}}>{props.created_by}</div>
            {/* <div className='common' style={{width:'10%'}}>{showDetails?<FaAngleUp/>:<FaAngleDown/>}</div> */}
        </div>
        {showDetails?<div className='transaction_details'>
        <div className="transaction_order_detail_header">
                            <div style={{width:'20%'}} className="common">ORDER TYPE</div>
                            <div style={{width:'20%'}} className="common">ORDER ID</div>
                            <div style={{width:'40%'}} className="common">ORDER DESCRIPTION</div>
                            <div style={{width:'20%'}} className="common">QUANTITY</div>
                        </div>
        </div>:null}
        <hr className='transaction_hr'/>
    </div>
)
}

export default Transactions;