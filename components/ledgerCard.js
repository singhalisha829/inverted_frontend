import {BsBoxArrowUp, BsBoxArrowInDown} from 'react-icons/bs';

const LedgerCard = (props) =>{
    return(
        <div className="ledger_card">
            <div style={{width:'25%'}} className="card_items">
            {(props.status==='CREDIT' || props.status == 'PROD_RETURN')?<div className='stock_in_style' style={{margin:'0 5px',
            fontWeight:'300'}}><BsBoxArrowInDown />{props.status=='PROD_RETURN'?<div>Production Return</div>:<div>Stock In</div>}</div>
            :
            <div className='stock_out_style' style={{margin:'0 5px',fontWeight:'300'}}><BsBoxArrowUp />{props.status =='LINE_LOSS'?<div>Loss On Line</div>:<div>Stock Out</div>}</div>}</div>
            <div style={{width:'15%'}} className="card_items">{props.date}</div>
            <div style={{width:'15%'}} className="card_items">{props.quantity}</div>
            <div style={{width:'25%'}} className="card_items">{props.vendor}</div>
            <div style={{width:'20%'}} className="card_items">{props.documentId}</div>
        </div>
    )
}

export default LedgerCard;