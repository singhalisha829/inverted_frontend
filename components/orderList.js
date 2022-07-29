import { useEffect, useState } from 'react';
import Router from 'next/router';


const OrderList = (props) =>{

    useEffect(()=>{
        const token= localStorage.getItem('token')

    },[])

    let status= null;
    if(props.status==="Partially Processed"){
        status=(<div className="order_list_content" style={{paddingLeft:'1rem',marginLeft:'1rem',color:"#F68634",backgroundColor:'#f9ede5',borderRadius:'5px',width:'8rem'}}>{props.status}</div>)
    }else if(props.status==="Completed"){
        status=(<div className="order_list_content" style={{marginLeft:'2rem',color:"#33B850",backgroundColor:'#e8fcec',borderRadius:'5px',width:'7rem',height:'2rem',display:'flex',alignItems:'center'}}>{props.status}</div>)   
    }else{
        status=(<div className="order_list_content" style={{marginLeft:'2rem',color:"#F6C034",backgroundColor:'#f9f1e3',borderRadius:'5px',width:'6rem',height:'2rem',display:'flex',alignItems:'center'}}>{props.status}</div>)   

    }
    
    return(
        <div className="order_list" onClick={()=>{Router.push(props.path);localStorage.setItem('poId',props.id)}}>
        <div className="order_list_content">{props.order_number}</div>
        <div className="order_list_content">{props.date}</div>
        <div className="order_list_content">{props.created_by}</div>
        {status}

        </div>
    )
}

export default OrderList;