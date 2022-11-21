import { FaTrashAlt, FaPen } from 'react-icons/fa';

const List = (props) =>{
    
    return(
        <div className="list list_content">
        <div className='part_id_width'><div className="part_id" >#{props.partId}</div></div>
           <div className='part_desc_width'>{props.partDesc}
           <div></div></div>

           <div  className='part_price_width'>{props.price}</div>
           <div  className='quantity_width'>{props.quantity} {props.unit}</div>
           <div className="icons common">
               {/* <FaPen style={{color:"#c4c4c4"}} /> */}
           <FaTrashAlt className='stockin_trash' onClick={()=>props.deleteNote(props.id)} cursor="pointer"/></div>

        </div>
    )
}

export default List;