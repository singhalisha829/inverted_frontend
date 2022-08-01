import { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";

import {BsBoxArrowUp, BsBoxArrowInDown, BsArrowDownUp,BsArrowUp,BsArrowDown} from 'react-icons/bs';

import Logo  from '../public/Logo_inverted.png';

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';





const Table = (props) => {

    const [data, setData]= useState(props.rows);
    const [order, setOrder]= useState('ASC');
    const [tableFilter, setTableFilter] = useState([]);
    const [arrow, setArrow] = useState(null);
    const [sortedColumn,setSortedColumn] = useState(null);
    
   useEffect(()=>{
    //  search table based on dropdown filter and searchbar value
     if(props.search != undefined && props.filter !=undefined ){
      const searchTable = data.filter(o => Object.keys(o).some(
        k => String(o[k]).toLowerCase().includes(props.search.toLowerCase()))
      );

      const filterTable= searchTable.filter(o=> Object.keys(o).some(
        k=> String(o[k]).toLowerCase().includes(props.filter.toLowerCase())
      ))

      setTableFilter([...filterTable])
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
      const filterTable= data.filter(o=> Object.keys(o).some(
        k=> String(o[k]).toLowerCase().includes(props.filter.toLowerCase())
      ))
      setTableFilter([...filterTable])
     }
     else{
       setData([...data])
       setTableFilter([...data])
     }
   },[props.search,props.filter])



  //  sort table rows based on selected column
    const sorting= (col) =>{
      if(col != sortedColumn){
        const sorted= [...props.rows].sort((a,b)=>
        a[col]> b[col] ? 1: -1 );
        setData(sorted);
        setOrder('DSC');
        setArrow(<BsArrowUp/>)
      }else{
        if(order === 'ASC'){
            const sorted= [...props.rows].sort((a,b)=>
            a[col]> b[col] ? 1: -1 );
            setData(sorted);
            setOrder('DSC');
            setArrow(<BsArrowUp/>)
        }

        if(order === 'DSC'){
            const sorted= [...props.rows].sort((a,b)=>
            a[col]< b[col] ? 1: -1 );
            setData(sorted);
            setOrder('NONE');
            setArrow(<BsArrowDown/>)
        }

        if(order === 'NONE'){
          setData(props.rows);
          setOrder('ASC');
        }
      }
        setSortedColumn(col)
      
    }
     
    // navigate to given page on clicking a row
    const clickHandler=()=>{
      if(props.path){
      Router.push(props.path)}
    
    } 

    const border='#e5e5e5 solid 0.1em';

    const handleQuantity=(value,quantity,symbol,id,product_code,product_description)=>{
      if(value>quantity){
        toast.warning('Entered Quantity exceeds the Required Qunatity! ');
        border="red solid 0.1em";
      }else{
      props.handleQuantity(value,id,product_code,symbol,product_description);
      border='#e5e5e5 solid 0.1em';
      }
    }
    
    console.log(data)

    let table_content=null;
    
      table_content=(<tbody>
        {props.search != undefined || props.filter != undefined?tableFilter
        .map(row => {
          return (
            <tr key={row.part_id} onClick={()=>{localStorage.setItem('partId',row.part_id);localStorage.setItem('orderId',row.order_id);
            localStorage.setItem('poId',row.id);localStorage.setItem('production_order_id',row.id);
            clickHandler()}}>
              {props.columns.map(column => {
                if(column.accessor1==='part_id'){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign,color:'#EB2129'}}
                ><div className="part_id_box">#{row[column.accessor1]}</div></td>
                }

                else if(column.accessor2==='long_description'){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign, color:"#9E9E9E",
                  }}
                ><div style={{display:'flex'}}>
                <div className="parts_image">
                  
                {row.image === null? <Image src={Logo} layout="fill" objectFit="contain" alt=""/>
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
    else if(column.accessor1==='status' && row.status==='Partially Processed' ){
      return <td key={column.accessor1} width={column.width} 
    ><div className="partial_status_style">Partially Processed</div></td>
    }
    else if(column.accessor1==='status' && row.status==='Completed' ){
      return <td key={column.accessor1} width={column.width} 
    ><div className="completed_status_style">Completed</div></td>
    }else if(column.accessor1==='stock_released'){
      return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
  ><div style={{marginLeft:"20%",display:'flex',alignItems:'center'}}><input type="number" style={{width:'40%',height:'3rem'}} 
  onChange={(e)=>handleQuantity(e.target.value,row.available_qty,row.available_qty_symbol,row.id,row.product_code,row.product_description)}/>
  <div className="available_quantity">*Only {row.available_qty} {row.available_qty_symbol} available</div></div></td>
    }else if(column.accessor1==='quantity_value'){
      return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
      ><div>{row[column.accessor1]} {row[column.accessor2]}</div></td>
    }
                else{
                return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                ><div>{row[column.accessor1]=== null? '—':row[column.accessor1]}</div></td>
                }
              })}
            </tr>
          )
        }):data
        .map(row => {
          return (
            <tr key={row.part_id} onClick={()=> {localStorage.setItem('partId',row.part_id);localStorage.setItem('orderId',row.order_id);
            localStorage.setItem('poId',row.id);localStorage.setItem('production_order_id',row.id);
             clickHandler()}}>
              {props.columns.map(column => {
                if(column.accessor1==='part_id'){
                  return <td key={column.accessor1} width={column.width} style={{ margin:'auto', color:'#EB2129'}}
                ><div className="part_id_box">#{row[column.accessor1]}</div></td>
                }
                
                else if(column.accessor2==='long_description'){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign, color:'#9E9E9E'}}
                ><div style={{display:'flex'}}>
                  <div className="parts_image">
              
                    {row.image === null? <Image src={Logo} layout="fill" objectFit="contain" alt=""/>
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
                  else if(column.accessor1==='status' && row.status==='Partially Processed' ){
                    return <td key={column.accessor1} width={column.width} 
                  ><div className="partial_status_style">Partially Processed</div></td>
                  }
                  else if(column.accessor1==='status' && row.status==='Completed' ){
                    return <td key={column.accessor1} width={column.width} 
                  ><div className="completed_status_style">Completed</div></td>
                  }else if(column.accessor1==='stock_released'){
                    console.log(row.available_qty,row.available_qty_symbol)
                    return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                ><div style={{marginLeft:"20%",display:'flex',alignItems:'center'}}><input type="number" style={{width:'40%',height:'3rem',border:border}} 
                onChange={(e)=>handleQuantity(e.target.value,row.available_qty,row.available_qty_symbol,row.id,row.product_code,row.product_description)}/>
                <div className="available_quantity">*Only {row.available_qty} {row.available_qty_symbol} available</div></div></td>
                  }
                  else if(column.accessor1==='quantity_value'){
                    return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                    ><div>{row[column.accessor1]} {row[column.accessor2]}</div></td>
                  }
                else{
                return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                ><div>{row[column.accessor1]=== null? '—':row[column.accessor1]}</div></td>
                }
              })}
            </tr>
          )
        })
        }
      </tbody>)
 
  
    return (
      <table  id="table" style={{width:props.width,cursor:props.cursor}}>
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