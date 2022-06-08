import { FaTrashAlt, FaPen } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { fetchPartById } from '../services/stockInService';

const List = (props) =>{
    const [partId, setPartId] = useState(null);
    const [partName, setPartName] = useState(null);

    useEffect(()=>{
        const token= localStorage.getItem('token')
        fetchPartById(props.partId,token).then((res)=>{setPartId(res.data.part_id);
        setPartName(res.data.short_description)})

    },[])
    
    return(
        <div className="list">
        <div style={{width:"15%"}}><div className="part_id" >#{partId}</div></div>
           <div style={{width:"30%",textAlign:'center',display:'flex',flexDirection:'column'}}><div
           style={{color:'#3F5575',fontSize:'1.5rem',fontWeight:'600',lineHeight:'1.9rem'}}>{partName}</div>
           <div></div></div>

           <div className='list_content' style={{width:"10%", textAlign:"center"}}>{props.price}</div>
           <div className='list_content' style={{width:"30%",textAlign:'center'}}>{props.quantity} {props.unit}</div>
           <div className="icons" style={{width:"10%",paddingLeft:'8%'}}>
               {/* <FaPen style={{color:"#c4c4c4"}} /> */}
           <FaTrashAlt style={{color:"#F16B6B"}} onClick={()=>props.deleteNote(props.partId)}  size={17}/></div>

        </div>
    )
}

export default List;