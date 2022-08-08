import { useEffect, useState } from 'react';
import Router from 'next/router';


const OrderList = (props) =>{
    const [cardFilter, setCardFilter] = useState([]);
    const [data,setData]= useState(props.ordersList);

    useEffect(()=>{
        const token= localStorage.getItem('token')

    },[])

     // search feature in cards list
   useEffect(() =>{
    console.log(props.search)
        //  search table based on dropdown filter and searchbar value
        if(props.search != undefined && props.filter !=undefined ){
         const searchCard = data.filter(o => Object.keys(o).some(
           k => String(o[k]).toLowerCase().includes(props.search.toLowerCase()))
         );
   
         const filterCard= searchCard.filter(o=> Object.keys(o).some(
           k=> String(o[k]).toLowerCase().includes(props.filter.toLowerCase())
         ))
   
         setCardFilter([...filterCard])
        }
   
       //  search table based on searchbar value
        else if(props.search != undefined ){
          const searchCard = data.filter(o => Object.keys(o).some(
            k => String(o[k]).toLowerCase().includes(props.search.toLowerCase()))
          );
   
          setCardFilter([...searchCard])
        }
   
       //  search table based on dropdown filter
        else if(props.filter !=undefined){
         const filterCard= data.filter(o=> Object.keys(o).some(
           k=> String(o[k]).toLowerCase().includes(props.filter.toLowerCase())
         ))
         setCardFilter([...filterCard])
        }
        else{
          setData([...data])
          setCardFilter([...data])
        }
      },[props.search,props.filter])
   

    let status= null;
    if(props.status==="Partially Processed"){
        status=(<div className="order_list_content" style={{paddingLeft:'1rem',marginLeft:'1rem',color:"#F68634",backgroundColor:'#f9ede5',borderRadius:'5px',width:'8rem'}}>{props.status}</div>)
    }else if(props.status==="Completed"){
        status=(<div className="order_list_content" style={{marginLeft:'2rem',color:"#33B850",backgroundColor:'#e8fcec',borderRadius:'5px',width:'7rem',height:'2rem',display:'flex',alignItems:'center'}}>{props.status}</div>)   
    }else{
        status=(<div className="order_list_content" style={{marginLeft:'2rem',color:"#F6C034",backgroundColor:'#f9f1e3',borderRadius:'5px',width:'6rem',height:'2rem',display:'flex',alignItems:'center'}}>Created</div>)   

    }
    
    return(
        <div className='order_card_list'>
            {props.search != undefined || props.filter != undefined? cardFilter.map(order=>(
        <div key={order.id} className="order_list" onClick={()=>{Router.push(props.path);localStorage.setItem('poId',order.id);
        localStorage.setItem('production_order_id',order.id)}}>
        <div className="order_list_content">{order.production_order_no?order.production_order_no:order.purchase_order_no}</div>
        <div className="order_list_content">{order.date}</div>
        <div className="order_list_content">{order.created_by}</div>
        {status}
        </div>))
        :
        data.map(order=>(
<div key={order.id} className="order_list" onClick={()=>{Router.push(props.path);localStorage.setItem('poId',order.id);
        localStorage.setItem('production_order_id',order.id)}}>
        <div className="order_list_content">{order.production_order_no?order.production_order_no:order.purchase_order_no}</div>
        <div className="order_list_content">{order.date}</div>
        <div className="order_list_content">{order.created_by}</div>
        {status}
        </div>
        ))}
        </div>
    )
}

export default OrderList;