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

import Parser from 'html-react-parser';


const Table = (props) => {

    const [data, setData]= useState(props.rows);
    const [order, setOrder]= useState('ASC');
    const [tableFilter, setTableFilter] = useState([]);
    const [arrow, setArrow] = useState(null);
    const [sortedColumn,setSortedColumn] = useState(null);
    const [border,setBorder]= useState('#e5e5e5 solid 0.1em');
    const [unitList,setUnitList]= useState(null);
    const [quantity,setQuantity]= useState(null);
    const [unit,setUnit]= useState([]);
    const [token,setToken]= useState(null);
    
   useEffect(()=>{
    const token=localStorage.getItem('token')
    setToken(token)
    fetchUnitList(token).then(res=>setUnitList(res.data))
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

    const handleQuantity=(value,available_quantity,available_qty_symbol,required_quantity,symbol,id,product_code,product_description,item_id,items_type)=>{
      setQuantity(value,unit);
      const factor=null;
      const unitIndex=unit.findIndex(el=>el.id==id);
      if(unitIndex != -1){
      unitConversion(token,available_qty_symbol,unit[unitIndex].unit).then(res=>{console.log(res.data);
        if(res.data.status.code== 404){
          toast.error(res.data.status.description);
        }else if(required_quantity<quantity*factor){
          toast.warning('Entered Quantity exceeds the Available Quantity! ');
        }
        else{
      factor=res.data.output[0].conversion_factor;
      if(available_quantity<value*factor){
        toast.warning('Entered Quantity exceeds the Required Qunatity! ');
      }else{
        const left_quantity=required_quantity-(value*factor);
      props.handleQuantity(value,id,product_code,unit[unitIndex].unit,product_description,item_id,items_type,left_quantity,symbol);
      }
      }})
    }
    }

    const handleUnit=(unit_symbol,available_qty,required_quantity,required_symbol,available_symbol,id,product_code,product_description,item_id,items_type)=>{
      // console.log(unit,available_qty,required_quantity,required_symbol,available_symbol,id,product_code,product_description,item_id,items_type)
      const factor=null;
      unitConversion(token,available_symbol,unit_symbol).then(res=>{console.log(res.data);
        if(res.data.status.code== 404){
          toast.error(res.data.status.description);
        
        }else{
          const unitIndex=unit.findIndex(el=>el.id==id);
          if(unitIndex == -1){
            const unitList=[...unit,{id:id,unit:unit_symbol}]
            setUnit(unitList);
          }else{
            unit[unitIndex].unit=unit_symbol;
          }
      factor=res.data.output[0].conversion_factor;
      if(available_qty<quantity*factor){
        toast.warning('Entered Quantity exceeds the Available Quantity! ');
        
      }else if(required_quantity<quantity*factor){
        toast.warning('Entered Quantity exceeds the Required Quantity! ');
      }
      else{
        const left_quantity=required_quantity-(quantity*factor);
        console.log(left_quantity,factor,available_qty)
      props.handleQuantity(quantity,id,product_code,unit_symbol,product_description,item_id,items_type,left_quantity,required_symbol);
      }
      }})
      
    }

    const handleBOMQuantity=(value,available_quantity,required_quantity,id,product_code,product_description,item_id,items_type)=>{
      if(value>available_quantity){
        toast.warning('Entered Quantity is greater than Available Quantity');

      }else if(value>required_quantity){
        toast.warning('Entered Quantity is greater than Required Quantity');
      }else{
        const left_quantity=required_quantity-value;
        console.log(left_quantity)
      props.handleQuantity(value,id,product_code,"Nos",product_description,item_id,items_type,left_quantity,"Nos");
      }
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
    }else if(column.accessor1==='stock_released'){
      return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
  ><div className="stock_out_quantity">
   {row.ItemType==='BOM'? <input type="number" className="quantity_field" placeholder="1"
  onChange={(e)=>handleBOMQuantity(e.target.value,row.available_qty,
    row.released_quantity_value,row.id,row.product_code,row.product_description,row.item_id,
    row.ItemType)}/>
:
<div style={{display:'flex',width:size.width>'600'?'70%':'90%', border:"#e5e5e5 solid 0.1em",borderRadius:'5px'}}>
                <input style={{width:"35%",height:"3rem",border:'none'}} className="quantity" type="number" value={quantity}
                onChange={(e)=>handleQuantity(e.target.value,row.available_qty,row.available_qty_symbol,
                  row.released_quantity_value,row.released_quantity_unit_symbol,row.id,row.product_code,row.product_description,row.item_id,
                  row.ItemType)} placeholder="0.00"/>
                <div style={{borderLeft:"#e5e5e5 solid 0.1em"}} />
                {unitList?<Dropdown options={unitList} isUnitList="true" placeholder="Unit" width="10%" name="symbol" minWidth="9rem" no_outline={true} value={unit}
                parentCallback={(data)=>{handleUnit(data.symbol,row.available_qty,row.released_quantity_value,row.released_quantity_unit_symbol,row.available_qty_symbol,row.id,row.product_code,row.product_description,row.item_id,row.ItemType,row.product_description)}} 
                dropdownWidth={size.width>'600'?"11vw":'40vw'} searchWidth={size.width>'600'?"8vw":'30vw'} height="3rem"/>:null}</div>}

  <div className="available_quantity">*Only {row.available_qty} {row.available_qty_symbol} available</div></div></td>
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
                  else if(column.accessor1==='stock_released'){
                    return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
                ><div className="stock_out_quantity">
                  {row.ItemType==='BOM'?<input type="number" style={{border:border}} className="quantity_field" placeholder="1"
                onChange={(e)=>handleBOMQuantity(
                  e.target.value,row.available_qty,
                  row.released_quantity_value,row.id,row.product_code,row.product_description,row.item_id,
                  row.ItemType)}/>
                :
                <div style={{display:'flex',width:size.width>'600'?'70%':'90%', border:"#e5e5e5 solid 0.1em",borderRadius:'5px'}}>
                <input style={{width:"35%",height:"3rem",border:'none'}} className="quantity" type="number" 
                onChange={(e)=>handleQuantity(e.target.value,row.available_qty,row.available_qty_symbol,
                  row.released_quantity_value,row.released_quantity_unit_symbol,row.id,row.product_code,row.product_description,row.item_id,
                  row.ItemType)} placeholder="0.00"/>
                <div style={{borderLeft:"#e5e5e5 solid 0.1em"}} />
                {unitList?<Dropdown options={unitList} isUnitList="true" placeholder="Unit" width="10%" name="symbol" minWidth="9rem" no_outline={true}
                parentCallback={(data)=>{handleUnit(data.symbol,row.available_qty,row.released_quantity_value,row.released_quantity_unit_symbol,row.available_qty_symbol,row.id,row.product_code,row.product_description,row.item_id,row.ItemType,row.product_description)}} 
                dropdownWidth={size.width>'600'?"11vw":'40vw'} searchWidth={size.width>'600'?"8vw":'30vw'} height="3rem"/>:null}</div>}
                <div className="available_quantity">*Only {row.available_qty} {row.available_qty_symbol} available</div></div></td>
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