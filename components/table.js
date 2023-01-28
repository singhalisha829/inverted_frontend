import { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";

import {BsBoxArrowUp, BsBoxArrowInDown, BsArrowDownUp,BsArrowUp,BsArrowDown} from 'react-icons/bs';

import Logo  from '../public/Logo_inverted.png';

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Parser from 'html-react-parser';


const Table = (props) => {

    const [data, setData]= useState(props.rows);
    const [order, setOrder]= useState('ASC');
    const [tableFilter, setTableFilter] = useState([]);
    const [arrow, setArrow] = useState(null);
    const [sortedColumn,setSortedColumn] = useState(null);
    const [token,setToken]= useState(null);
    
   useEffect(()=>{
    const token=localStorage.getItem('token')
    setToken(token)
    props.columns.forEach(el=>{
      if(el.sort!= undefined){
        if(el.sort=='ASC'){
          sortAsc(el.accessor1);
        }else if(el.sort=='DSC'){
          sortDsc(el.accessor1);
        }
        setSortedColumn(el.accessor1)
      }
    })
    //  search table based on dropdown filter and searchbar value
     if(props.search != undefined && props.filter !=undefined ){
      const filterTable=[];

      for(let i=0;i<data.length;i++){
        if(data[i][props.filterIn]== props.filter){
          filterTable.push(data[i])
        }
      }

      const searchTable = filterTable.filter(o => Object.keys(o).some(
        k => String(o[k]).toLowerCase().includes(props.search.toLowerCase()))
      );

      

      setTableFilter([...searchTable])
     }

    //  search table based on searchbar value
     else if(props.search != undefined ){
       const searchTable = data.filter(o => Object.keys(o).some(
         k => String(o[k]).toLowerCase().includes(props.search.toLowerCase()))
       );

       setTableFilter([...searchTable])
     }

    //  search table based on dropdown filter
     else if(props.filter !=undefined){
      const filterTable=[];
      for(let i=0;i<data.length;i++){
        if(data[i][props.filterIn]== props.filter){
          filterTable.push(data[i])
        }
      }
      
      setTableFilter([...filterTable])
     }
     else{
       setData([...data])
       setTableFilter([...data])
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



  //  sort table rows based on selected column
    const sorting= (col) =>{
      if(col != sortedColumn){
        const sorted=props.rows.slice().sort((a, b) => (a[col] || '').localeCompare(b[col] || '', undefined, {numeric: true}))
        setData(sorted);
        setOrder('DSC');
        setArrow(<BsArrowUp/>)
      }else{
        if(order === 'ASC'){
            sortAsc(col);
        }

        if(order === 'DSC'){
            sortDsc(col);
        }

        if(order === 'NONE'){
          setData(props.rows);
          setOrder('ASC');
        }
      }
      
        setSortedColumn(col)
    }

    const sortAsc=(col)=>{
      const sorted=props.rows.slice().sort((a, b) => (a[col] || '').localeCompare(b[col] || '', undefined, {numeric: true}))
      setData(sorted);
      // data=sorted;
      setOrder('DSC');
      setArrow(<BsArrowUp/>)
    }

    const sortDsc=(col)=>{
      const sorted=props.rows.slice().sort((a, b) => -(a[col] || '').localeCompare(b[col] || '', undefined, {numeric: true}))
            setData(sorted);
            // data=sorted;
            setOrder('NONE');
            setArrow(<BsArrowDown/>)
    }
     
    // navigate to given page on clicking a row
    const clickHandler=(part_id,id,order_id)=>{
      if(props.path){
        localStorage.setItem('partId',part_id);localStorage.setItem('orderId',order_id);
            localStorage.setItem('poId',id);localStorage.setItem('production_order_id',id);
      Router.push(props.path)}
    
    }   


    let table_content=null;
    
      table_content=(<tbody>
        {props.search != undefined || props.filter != undefined?tableFilter
        .map(row => {
          return (
            <tr key={row.part_id} onClick={()=>{
            clickHandler(row.part_id,row.id,row.order_id)}}>
              {props.columns.map(column => {
                       
          var prefix=column.prefix?column.prefix:'';
          var suffix=column.suffix?column.suffix:'';
          var cellValue =prefix+row[column.accessor1]+suffix;
              
                 if(column.accessor2==='long_description'){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign, color:"#9E9E9E",
                  }}
                ><div style={{display:'flex'}}>
                <div className="parts_image">
                  
                {row.image1 == null? <Image src={Logo} layout="fill" objectFit="contain" alt=""/>
                    :<Image src={row.image} layout="fill" objectFit="fill" alt="" />}
                  
                </div><div><div style={{color:"#3F5575", fontFamily: 'Inter',fontStyle: "normal",fontWeight: "500",fontSize: "1.6rem",lineHeight: "1.9rem",marginBottom:'7px'}}>{row[column.accessor1]}</div>
                <div style={{fontFamily: 'Inter',fontStyle: "normal",fontWeight: "400",fontSize: "1.2rem",lineHeight: "1.5rem"}}>{row[column.accessor2]}</div></div>
                </div></td>
                }
                
                else if(row.transaction_type==='CREDIT' && column.accessor1==="status"){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
  ><div className="stock_in_style"><BsBoxArrowInDown /> Stock In</div></td>
  }
 else if(row.transaction_type==='DEBIT' && column.accessor1==="status"){
    return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
    ><div className="stock_out_style"><BsBoxArrowUp />Stock Out</div></td>
    }
    else if(column.accessor1==='status' && row.status==="Created"){
      return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
    ><div className="pending_status_style">Created</div></td>
    }
    else if(column.accessor1==='status' && row.status==='Partial Processed' ){
      return <td key={column.accessor1} width={column.width} 
    ><div className="partial_status_style">Partially Processed</div></td>
    }
    else if(column.accessor1==='status' && row.status==='Completed' ){
      return <td key={column.accessor1} width={column.width} 
    ><div className="completed_status_style">Completed</div></td>
    }
                else{
                return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                >{row[column.accessor1]=== null? '—':<div>{Parser(cellValue)} {column.accessor2?row[column.accessor2]:null}</div>}</td>
                }
              })}
            </tr>
          )
        }):data
        .map(row => {

          return (
            <tr key={row.part_id} onClick={()=> { clickHandler(row.part_id,row.id,row.order_id)}}>
              {props.columns.map(column => {
          
          var prefix=column.prefix?column.prefix:'';
          var suffix=column.suffix?column.suffix:'';
          

          var color=null;var backgroundColor=null;

          if(column.accessor1 == 'status'){
            color=row.status=="Created"?"#F6C034":row.status == "Partial Processed"?"#F68634":"#33B850";
            backgroundColor=row.status=="Created"?"#f9f1e3":row.status == "Partial Processed"?"#f9ede5":"#e8fcec";
            prefix=prefix.substr(0,prefix.length-1)+'style={color:"'+color+'",backgroundColor:"'+backgroundColor+'"} >';
          }   
                
          var cellValue =prefix+row[column.accessor1]+suffix;

          
          

          

                if(column.accessor2==='long_description'){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign, color:'#9E9E9E'}}
                ><div style={{display:'flex'}}>
                  <div className="parts_image">
              
                    {row.image1 == null? <Image src={Logo} layout="fill" objectFit="contain" alt=""/>
                    :<Image src={row.image} layout="fill" objectFit="fill" alt="" />}
                  </div><div><div style={{color:"#3F5575", fontWeight:"500",fontSize:"1.6rem",lineHeight:'1.9rem',marginBottom:'7px'}}>{row[column.accessor1]}</div>
                  <div style={{fontSize:'1.2rem', lineHeight:'1.5rem',fontWeight:'400'}}>{row[column.accessor2]}</div></div>
                  </div></td>
                }
                
                else if(row.transaction_type==='CREDIT' && column.accessor1==="status"){
                                return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                ><div className="stock_in_style"><BsBoxArrowInDown /> Stock In</div></td>
                }
               else if(row.transaction_type==='DEBIT' && column.accessor1==="status"){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                  ><div className="stock_out_style"><BsBoxArrowUp />Stock Out</div></td>
                  }
                  else if(column.accessor1==='status' && row.status==='Created' ){
                    return <td key={column.accessor1} width={column.width} 
                  ><div className="pending_status_style">Created</div></td>
                  }
                  else if(column.accessor1==='status' && row.status==='Partial Processed' ){
                    return <td key={column.accessor1} width={column.width} 
                  ><div className="partial_status_style">Partially Processed</div></td>
                  }
                  else if(column.accessor1==='status' && row.status==='Completed' ){
                    return <td key={column.accessor1} width={column.width} 
                  ><div className="completed_status_style">Completed</div></td>
                  }
                 
                  else if(column.accessor1==='quantity_value' && props.outOf==true ){
                    return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                    ><div>{row.released_quantity_value} {row.released_quantity_value==0?null:row.released_quantity_unit_symbol} / {row[column.accessor1]} {row[column.accessor2]}</div></td>
                  }
                else{
                return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                >{row[column.accessor1]=== null? '-':<div>{Parser(cellValue)} {column.accessor2?row[column.accessor2]:null}</div>}</td>
                }
              })}
            </tr>
          )
        })
        }
      </tbody>)
 
  
    return (
      <table  id={props.id} style={{width:props.width,cursor:props.cursor}}>
        <thead >
        <tr>
          {props.columns.map(column => {
           if(column.accessor1 === sortedColumn){
            return <th style={{textAlign:column.textalign}} key={column.accessor1}
            onClick={()=> sorting(column.accessor1)}>
              <div className="header_fields">
                <div className="header_title">
                  <div className="title_name">{column.label}</div>
                <div className="sort_direction">{order != 'ASC'?order === 'DSC'?<BsArrowUp className="arrow_icon"/>:<BsArrowDown className="arrow_icon"/>:null}</div>
                
                </div>
                <div className="arrow"><BsArrowDownUp className="arrow_icon"/></div>
                </div></th>
           }else{
                 return <th style={{textAlign:column.textalign}} key={column.accessor1}
            onClick={()=> sorting(column.accessor1)}>
              <div className="header_fields">
                <div className="header_title">
                  
                  <div className="title_name">{column.label}</div>

                </div>
                <div className="arrow"><BsArrowDownUp className="arrow_icon"/></div>
                </div></th>
           }
              
          })}
        </tr>
      </thead>
        {table_content}
      </table>
    )
  }



  export default Table;