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
           {/* <div style={{border:"green solid", color:"balck",paddingTop:"80px"}}>heyy</div> */}
          <div className="card_title"><FaFileContract /> {props.title}</div>
          <div className="card_desc">{props.desc}</div>
          <div className="card_footer">
              <div style={{color:"#9E9E9E", fontWeight:"500",fontSize:'1.2rem',lineHeight:'1.5rem'}}>Quantity: </div>
              <div style={{color:"rgb(114, 114, 114)", fontWeight:"600",color:'#6B6B6B',
            fontSize:'1.2rem',lineHeight:'1.5rem',marginLeft:'0.5rem'}}>{props.quantity}</div>
              
          </div>
        </div>
    )
}

export default Card;