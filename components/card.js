import { FaFileContract } from 'react-icons/fa';
import Router from 'next/router';

const Card = (props) =>{

  const clickHandler=()=>{
    if(props.path){
    Router.push(props.path)}
  
  }

    return(
        <div className="card" onClick={()=>{localStorage.setItem('partId',props.part_id);clickHandler()}} >
           <div className="card_part_id">#{props.part_id}</div>
           {/* <div style={{display:'flex',justifyContent:'space-between'}}>
          <div> */}
          <div className="card_title"><FaFileContract /> {props.title}</div>
          <div className="card_desc">{props.desc}</div>
          {/* </div>
          <div className='card_image'></div>

          </div> */}
          <div className="card_footer">
              <div className='footer_quantity'>Quantity: </div>
              <div style={{fontWeight:"600",color:'#6B6B6B',marginLeft:'0.5rem'}} className="footer_quantity"> {props.quantity}</div>
              
          </div>
        </div>
    )
}

export default Card;