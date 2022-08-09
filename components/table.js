import { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";

import {BsBoxArrowUp, BsBoxArrowInDown, BsArrowDownUp,BsArrowUp,BsArrowDown} from 'react-icons/bs';

import Logo  from '../public/Logo_inverted.png';

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from "./dropdown";

import { fetchUnitList } from "../services/stockInService";
import { unitConversion } from "../services/purchaseOrderService";





const Table = (props) => {

    const [data, setData]= useState(props.rows);
    const [order, setOrder]= useState('ASC');
    const [tableFilter, setTableFilter] = useState([]);
    const [arrow, setArrow] = useState(null);
    const [sortedColumn,setSortedColumn] = useState(null);
    const [border,setBorder]= useState('#e5e5e5 solid 0.1em');
    const [unitList,setUnitList]= useState(null);
    const [quantity,setQuantity]= useState(null);
    const [unit,setUnit]= useState(null);
    const [token,setToken]= useState(null);
    
   useEffect(()=>{
    const token=localStorage.getItem('token')
    setToken(token)
    fetchUnitList(token).then(res=>setUnitList(res.data))
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

    const handleQuantity=(value,quantity,required_quantity,symbol,id,product_code,product_description,item_id,items_type)=>{
      if(value>quantity){
        toast.warning('Entered Quantity exceeds the Required Qunatity! ');
        setBorder("red solid 0.1em");
      }else{
        const left_quantity=required_quantity-value;
      props.handleQuantity(value,id,product_code,symbol,product_description,item_id,items_type,left_quantity);
      setBorder('#e5e5e5 solid 0.1em');
      }
    }

    const handleUnit=(unit,available_qty,required_quantity,required_symbol,available_symbol,id,product_code,product_description,item_id,items_type)=>{
      const factor=null;
      unitConversion(token,available_symbol,unit).then(res=>{console.log(res.data.output[0].conversion_factor);
      factor=res.data.output[0].conversion_factor;
      if(available_qty<quantity*factor){
        toast.warning('Entered Quantity exceeds the Required Qunatity! ');
      }else{
        const left_quantity=required_quantity-(quantity*factor);
        console.log(left_quantity,factor,available_qty)
      props.handleQuantity(quantity,id,product_code,unit,product_description,item_id,items_type,left_quantity);

      }})
      
    }
    
    // console.log(data)

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
    else if(column.accessor1==='status' && row.status==='Partially Processed' ){
      return <td key={column.accessor1} width={column.width} 
    ><div className="partial_status_style">Partially Processed</div></td>
    }
    else if(column.accessor1==='status' && row.status==='Completed' ){
      return <td key={column.accessor1} width={column.width} 
    ><div className="completed_status_style">Completed</div></td>
    }else if(column.accessor1==='stock_released'){
      return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
  ><div className="stock_out_quantity">
   {row.ItemType==='BOM'? <input type="number" className="quantity_field" placeholder="1"
  onChange={(e)=>handleQuantity(e.target.value,row.available_qty,row.available_qty_symbol,row.quantity_value,row.quantity_symbol,row.id,row.product_code,row.product_description,row.item_id,row.ItemType,row.product_description)}/>
:
<div style={{display:'flex',width:size.width>'600'?'70%':'90%', border:"#e5e5e5 solid 0.1em",borderRadius:'5px'}}>
                <input style={{width:"35%",height:"3rem",border:'none'}} className="quantity" type="number" value={quantity}
                onChange={(e)=>setQuantity(e.target.value)} placeholder="0.00"/>
                <div style={{borderLeft:"#e5e5e5 solid 0.1em"}} />
                {unitList?<Dropdown options={unitList} placeholder="Unit" width="10%" name="name" minWidth="9rem" no_outline={true} value={unit}
                parentCallback={(data)=>{setUnit(data.symbol);handleUnit(data.symbol,row.available_qty,row.quantity_value,row.quantity_symbol,row.available_qty_symbol,row.id,row.product_code,row.product_description,row.item_id,row.ItemType,row.product_description)}} 
                dropdownWidth={size.width>'600'?"11vw":'40vw'} searchWidth={size.width>'600'?"8vw":'30vw'} height="3rem"/>:null}</div>}

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
                  return <td key={column.accessor1} width={column.width} style={{ margin:'auto'}}
                ><div className="part_id_box">#{row[column.accessor1]}</div></td>
                }
                
                else if(column.accessor2==='long_description'){
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
                  else if(column.accessor1==='status' && row.status==='Partially Processed' ){
                    return <td key={column.accessor1} width={column.width} 
                  ><div className="partial_status_style">Partially Processed</div></td>
                  }
                  else if(column.accessor1==='status' && row.status==='Completed' ){
                    return <td key={column.accessor1} width={column.width} 
                  ><div className="completed_status_style">Completed</div></td>
                  }else if(column.accessor1==='stock_released'){
                    return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                ><div className="stock_out_quantity">
                  {row.ItemType==='BOM'?<input type="number" style={{border:border}} className="quantity_field" placeholder="1"
                onChange={(e)=>handleQuantity(e.target.value,row.available_qty,row.quantity_value,row.quantity_symbol,row.available_qty_symbol,row.id,row.product_code,row.product_description,row.item_id,row.ItemType,row.product_description)}/>
                :
                <div style={{display:'flex',width:size.width>'600'?'70%':'90%', border:"#e5e5e5 solid 0.1em",borderRadius:'5px'}}>
                <input style={{width:"35%",height:"3rem",border:'none'}} className="quantity" type="number" 
                onChange={(e)=>setQuantity(e.target.value)} placeholder="0.00"/>
                <div style={{borderLeft:"#e5e5e5 solid 0.1em"}} />
                {unitList?<Dropdown options={unitList} placeholder="Unit" width="10%" name="name" minWidth="9rem" no_outline={true}
                parentCallback={(data)=>{setUnit(data.symbol);handleUnit(data.symbol,row.available_qty,row.quantity_value,row.quantity_symbol,row.available_qty_symbol,row.id,row.product_code,row.product_description,row.item_id,row.ItemType,row.product_description)}} 
                dropdownWidth={size.width>'600'?"11vw":'40vw'} searchWidth={size.width>'600'?"8vw":'30vw'} height="3rem"/>:null}</div>}
                <div className="available_quantity">*Only {row.available_qty} {row.available_qty_symbol} available</div></div></td>
                  }
                  else if((column.accessor1==='quantity_value' && props.outOf==false) || column.accessor1=="part_quantity_value"){
                    return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                    ><div>{row[column.accessor1]} {row[column.accessor2]}</div></td>
                  }
                  else if(column.accessor1==='quantity_value' && props.outOf==true ){
                    return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                    ><div>{row.released_quantity_value} {row.released_quantity_value==0?null:row.released_quantity_unit_symbol} / {row[column.accessor1]} {row[column.accessor2]}</div></td>
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