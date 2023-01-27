import { FaFileContract } from 'react-icons/fa';
import {BsBoxArrowUp, BsBoxArrowInDown} from 'react-icons/bs';



const LedgerCard = (props) =>{


    return(
        <div className="ledger_card">
            <div style={{width:'25%'}} className="card_items">{props.status==='CREDIT'?<div className='stock_in_style' style={{width:'7rem',display:'flex',justifyContent:'center',
            fontWeight:'300'}}><BsBoxArrowInDown />Stock In</div>:
            <div className='stock_out_style' style={{width:'8rem',display:'flex',justifyContent:'center',fontWeight:'300'}}><BsBoxArrowUp />Stock Out</div>}</div>
            <div style={{width:'15%'}} className="card_items">{props.date}</div>
            <div style={{width:'15%'}} className="card_items">{props.quantity}</div>
            <div style={{width:'25%'}} className="card_items">{props.vendor}</div>
            <div style={{width:'20%'}} className="card_items">{props.documentId}</div>
        </div>
    )
}

export default LedgerCard;