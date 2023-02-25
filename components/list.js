import { useEffect, useState } from 'react';
import Router from 'next/router';


const List = (props) =>{
    const [cardFilter, setCardFilter] = useState([]);
    const [data,setData]= useState(props.rows);


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
            {props.search != undefined || props.filter != undefined? cardFilter.map((order,index)=>(
        <div key={index} className="order_list" onClick={()=>Router.push({pathname:props.path,query:{id:order.id}})}>
  {props.columns.map((col,sub_index)=>(
    <div key={sub_index} className="order_list_content" style={{width:col.width,textAlign:col.textalign}}>{order[col.accessor1]}</div>
    ))}
        </div>))
        :
        data.map((order,index)=>(
    <div key={index} className="order_list" onClick={()=>Router.push({pathname:props.path,query:{id:order.id}})}>
  {props.columns.map((col,sub_index)=>(
    <div key={sub_index} className="order_list_content" style={{width:col.width,textAlign:col.textalign}}>{order[col.accessor1]}</div>
    ))}
        </div>
        ))}
        </div>
    )
}

export default List;