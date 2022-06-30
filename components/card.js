import { FaFileContract } from 'react-icons/fa';
import Router from 'next/router';
import { useState, useEffect } from 'react';


const Card = (props) =>{

  const clickHandler=()=>{
    if(props.path){
    Router.push(props.path)}
  
  }

      // calculate screen size
      function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
      
        useEffect(() => {
      
          if (typeof window !== 'undefined') {
            function handleResize() {
              setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
              });
            }
        
            window.addEventListener("resize", handleResize);
           
            handleResize();
        
            return () => window.removeEventListener("resize", handleResize);
          }
        }, []);
        return windowSize;
      }
    const size = useWindowSize();

    return(
        <div className="card" onClick={()=>{localStorage.setItem('partId',props.part_id);clickHandler()}} >
          <div className='card_column'>
           <div className="card_part_id">#{props.part_id}</div>
           
          <div className="card_title"><FaFileContract /> {props.title}</div>
          <div className="card_desc">{props.desc}</div>
          
          {size.width>'600'?<div className="card_footer">
              <div className='footer_quantity'>Quantity: </div>
              <div style={{fontWeight:"600",color:'#6B6B6B',marginLeft:'0.5rem'}} className="footer_quantity"> {props.quantity}</div>
              
          </div>:null}
          </div>
          {size.width<'600'?<div style={{color:'#6B6B6B'}} className="footer_quantity"> {props.quantity}</div>:null}
        </div>
    )
}

export default Card;