import { FaFileContract } from 'react-icons/fa';
import Router from 'next/router';
import { useState, useEffect } from 'react';


const Card = (props) =>{
  const [cardFilter, setCardFilter] = useState([]);
  const [data,setData]= useState(props.partsList);


  const clickHandler=()=>{
    if(props.path){
    Router.push(props.path)}
  
  }

   // search feature in cards list
   useEffect(() =>{

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
      <div className='cards_list'>{props.search != undefined || props.filter != undefined?cardFilter.map((part)=>(
        <div key={part.id} className="card" onClick={()=>{localStorage.setItem('partId',part.part_id);clickHandler()}} >
          <div className='card_column'>
           <div className="card_part_id">#{part.part_id}</div>
           
          <div className="card_title"><FaFileContract /> {part.short_description}</div>
          <div className="card_desc">{part.long_description}</div>
          
          {size.width>'600'?<div className="card_footer">
              <div className='footer_quantity'>Quantity: </div>
              <div style={{fontWeight:"600",color:'#6B6B6B',marginLeft:'0.5rem'}} className="footer_quantity"> {part.quantity}</div>
              
          </div>:null}
          </div>
          {size.width<'600'?<div style={{color:'#6B6B6B'}} className="footer_quantity"> {part.quantity}</div>:null}
        </div>))
        :
        data.map((part)=>(
          <div key={part.id} className="card" onClick={()=>{localStorage.setItem('partId',part.part_id);clickHandler()}} >
          <div className='card_column'>
           <div className="card_part_id">#{part.part_id}</div>
           
          <div className="card_title"><FaFileContract /> {part.short_description}</div>
          <div className="card_desc">{part.long_description}</div>
          
          {size.width>'600'?<div className="card_footer">
              <div className='footer_quantity'>Quantity: </div>
              <div style={{fontWeight:"600",color:'#6B6B6B',marginLeft:'0.5rem'}} className="footer_quantity"> {part.quantity}</div>
              
          </div>:null}
          </div>
          {size.width<'600'?<div style={{color:'#6B6B6B'}} className="footer_quantity"> {part.quantity}</div>:null}
        </div>
        ))}
        </div>
    )
}

export default Card;