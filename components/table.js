import { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";

import {BsBoxArrowUp, BsBoxArrowInDown, BsArrowDownUp,BsArrowUp,BsArrowDown} from 'react-icons/bs';

import Logo  from '../public/Logo_inverted.png';
import Parser from 'html-react-parser';


const Table = (props) => {

    const [data, setData]= useState(props.rows);
    const [order, setOrder]= useState('ASC');
    const [tableFilter, setTableFilter] = useState([]);
    const [initialFilteredData,setInitialFilteredData] = useState([]);
    const [arrow, setArrow] = useState(null);
    const [sortedColumn,setSortedColumn] = useState(null);

    
   useEffect(()=>{
    
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
      setInitialFilteredData([...searchTable])
     }

    //  search table based on searchbar value
     else if(props.search != undefined ){
       const searchTable = data.filter(o => Object.keys(o).some(
         k => String(o[k]).toLowerCase().includes(props.search.toLowerCase()))
       );

       setTableFilter([...searchTable])
       setInitialFilteredData([...searchTable])

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
      setInitialFilteredData([...filterTable])

     }
     else{
       setData([...data])
     }
   },[props.search,props.filter])


   //check if any column has default sorting on page load
   useEffect(()=>{
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
   },[])


 
      useEffect(() => {
        setData([...props.rows])
      }, [props.rows]);
  

    const sorting = (col)=>{
      const dataToSort=[];
      if(tableFilter.length == 0){
        dataToSort= props.rows;
      }else{
        dataToSort = tableFilter;
      }
      sortingNext(col,dataToSort)
    }


  //  sort table rows based on selected column
    const sortingNext= (col,dataToSort) =>{
    
      if(col != sortedColumn){
        const sorted=dataToSort.slice().sort(
          (a, b) =>{
            if (typeof a[col] === 'string' && typeof b[col] === 'string') {
              return (a[col] || '').localeCompare(b[col] || '', undefined, { numeric: true });
            } else {
              return (a[col] || 0) - (b[col] || 0);
            }
          }
          )
          if(tableFilter.length == 0){
            setData(sorted);
          }else{
            setTableFilter(sorted)
          }
        setOrder('DSC');
        setArrow(<BsArrowUp/>)
      }else{
        if(order === 'ASC'){
            sortAsc(col,dataToSort);
        }

        if(order === 'DSC'){
            sortDsc(col,dataToSort);
        }

        if(order === 'NONE'){
          if(tableFilter.length == 0){
            setData(props.rows);
          }else{
            setTableFilter([...initialFilteredData])
          }
          setOrder('ASC');
        }
      }
      
        setSortedColumn(col)
    }

    const sortAsc=(col,data)=>{
      const sorted=data.slice().sort((a, b) => 
      {
        if (typeof a[col] === 'string' && typeof b[col] === 'string') {
          return (a[col] || '').localeCompare(b[col] || '', undefined, { numeric: true });
        } else {
          return (a[col] || 0) - (b[col] || 0);
        }
      })
      if(tableFilter.length == 0){
        setData(sorted);
      }else{
        setTableFilter(sorted)
      }
      setOrder('DSC');
      setArrow(<BsArrowUp/>)
    }

    const sortDsc=(col,data)=>{
      const sorted=data.slice().sort((a, b) => 
      {
        if (typeof a[col] === 'string' && typeof b[col] === 'string') {
          return -(a[col] || '').localeCompare(b[col] || '', undefined, { numeric: true });
        } else {
          return (b[col] || 0) - (a[col] || 0);
        }
      }
      )
      if(tableFilter.length == 0){
        setData(sorted);
      }else{
        setTableFilter(sorted)
      }
            setOrder('NONE');
            setArrow(<BsArrowDown/>)
    }
     
    // navigate to given page on clicking a row
    const clickHandler=(id)=>{
      if(props.path){
        // localStorage.setItem('partId',part_id);localStorage.setItem('orderId',order_id);
        //     localStorage.setItem('poId',id);localStorage.setItem('production_order_id',id);
      if(props.path == '/ledger'){
        Router.push('/ledger/'+id);
      }
      else if(props.path =='/orderDetails'){
        Router.push({pathname:props.path,query:{id:id}})
      }else if(props.path =='/vendorList'){
        Router.push({pathname:props.path,query:{id:id}})
      }else{
          Router.push(props.path)
      }
    }
      
      }
    
  

    let table_content=null;
    
      table_content=(<tbody>
        {props.search != undefined || props.filter != undefined?tableFilter
        .map((row,index) => {
          return (
            <tr key={index} onClick={()=>{
            clickHandler(row[props.pathId])}}>
              {props.columns.map((column,columnIndex)=> {
                       
          var prefix=column.prefix?column.prefix:'';
          var suffix=column.suffix?column.suffix:'';
          var cellValue =prefix+row[column.accessor1]+suffix;
              
                 if(column.accessor2==='long_description'){
                  return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign, color:"#9E9E9E",
                  }}
                ><div style={{display:'flex'}}>
                <div className="parts_image">
                  
                {row.image1 == null? <Image src={Logo} layout="fill" objectFit="contain" alt=""/>
                    :<Image src={row.image} layout="fill" objectFit="fill" alt="" />}
                  
                </div><div><div style={{color:"#3F5575", fontFamily: 'Inter',fontStyle: "normal",fontWeight: "500",fontSize: "1.6rem",lineHeight: "1.9rem",marginBottom:'7px'}}>{row[column.accessor1]}</div>
                <div style={{fontFamily: 'Inter',fontStyle: "normal",fontWeight: "400",fontSize: "1.2rem",lineHeight: "1.5rem"}}>{row[column.accessor2]}</div></div>
                </div></td>
                }
                
                else if((row.transaction_type==='Stock In' || row.transaction_type==='Production Return' || row.transaction_type==='Positive Adjustment')  && (column.accessor1==="transaction_type")){
                  return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
  ><div className="stock_in_style"><BsBoxArrowInDown style={{marginRight:'0.2rem'}}/> {row[column.accessor1]}</div></td>
  }
 else if((row.transaction_type==='Stock Out' || row.transaction_type==='Loss On Line' || row.transaction_type==='Quality Reject' || row.transaction_type==='Negative Adjustment') && (column.accessor1==="transaction_type")){
    return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
    ><div className="stock_out_style"><BsBoxArrowUp style={{marginRight:'0.2rem'}}/>{row[column.accessor1]}</div></td>
    }
    else if((row.transaction_type==='Stock In' || row.transaction_type==='Production Return' || row.transaction_type==='Positive Adjustment')  && (column.accessor2==="colored_quantity")){
      return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign,color:"#33B850"}}
>{row[column.accessor1]}</td>
}
else if((row.transaction_type==='Stock Out' || row.transaction_type==='Loss On Line' || row.transaction_type==='Quality Reject' || row.transaction_type==='Negative Adjustment') && (column.accessor2==="colored_quantity" )){
return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign,color:"#F16B6B"}}
>{row[column.accessor1]}</td>
}
    else if(column.accessor1==='status' && row.status==="Created"){
      return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
    ><div className="pending_status_style">Created</div></td>
    }
    else if(column.accessor1==='status' && row.status==='Partial Processed' ){
      return <td key={columnIndex} width={column.width} 
    ><div className="partial_status_style">Partially Processed</div></td>
    }
    else if(column.accessor1==='status' && row.status==='Completed' ){
      return <td key={columnIndex} width={column.width} 
    ><div className="completed_status_style">Completed</div></td>
    }else if(column.accessor2==='part_short_description'  || column.accessor2 =="vendor"){
      return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
      ><div style={{display:'flex',flexDirection:'column'}}>{row[column.accessor1]} <span style={{color:"rgb(200, 198, 198)",fontSize:'1.3rem'}}>{row[column.accessor2] != null?<span>({row[column.accessor2]})</span>:null} </span></div></td>
    }
                else{
                return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
                >{row[column.accessor1]=== null? '—':<div>{Parser(cellValue)} {column.accessor2?row[column.accessor2]:null}</div>}</td>
                }
              })}
            </tr>
          )
        }):data
        .map((row,index) => {

          return (
            <tr key={index} onClick={()=> { clickHandler(row[props.pathId])}}>
              {props.columns.map((column,columnIndex) => {
          
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
                  return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign, color:'#9E9E9E'}}
                ><div style={{display:'flex'}}>
                  <div className="parts_image">
              
                    {row.image1 == null? <Image src={Logo} layout="fill" objectFit="contain" alt=""/>
                    :<Image src={row.image} layout="fill" objectFit="fill" alt="" />}
                  </div><div><div style={{color:"#3F5575", fontWeight:"500",fontSize:"1.6rem",lineHeight:'1.9rem',marginBottom:'7px'}}>{row[column.accessor1]}</div>
                  <div style={{fontSize:'1.2rem', lineHeight:'1.5rem',fontWeight:'400'}}>{row[column.accessor2]}</div></div>
                  </div></td>
                }
                
                else if((row.transaction_type==='Stock In' || row.transaction_type==='Production Return' || row.transaction_type==='Positive Adjustment')  && ( column.accessor1==="transaction_type")){
                  return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
  ><div className="stock_in_style"><BsBoxArrowInDown style={{marginRight:'0.2rem'}}/> {row[column.accessor1]}</div></td>
  }
 else if((row.transaction_type==='Stock Out' || row.transaction_type==='Loss On Line' || row.transaction_type==='Quality Reject' || row.transaction_type==='Negative Adjustment') && ( column.accessor1==="transaction_type")){
    return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
    ><div className="stock_out_style"><BsBoxArrowUp style={{marginRight:'0.2rem'}}/>{row[column.accessor1]}</div></td>
    }

    else if((row.transaction_type==='Stock In' || row.transaction_type==='Production Return' || row.transaction_type==='Positive Adjustment')  && (column.accessor2==="colored_quantity")){
      return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign,color:"#33B850"}}
>{row[column.accessor1]}</td>
}
else if((row.transaction_type==='Stock Out' || row.transaction_type==='Loss On Line' || row.transaction_type==='Quality Reject' || row.transaction_type==='Negative Adjustment') && (column.accessor2==="colored_quantity" )){
return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign,color:"#F16B6B"}}
>{row[column.accessor1]}</td>
}
                  else if(column.accessor1==='status' && row.status==='Created' ){
                    return <td key={columnIndex} width={column.width} 
                  ><div className="pending_status_style">Created</div></td>
                  }
                  else if(column.accessor1==='status' && row.status==='Partial Processed' ){
                    return <td key={columnIndex} width={column.width} 
                  ><div className="partial_status_style">Partially Processed</div></td>
                  }
                  else if(column.accessor1==='status' && row.status==='Completed' ){
                    return <td key={columnIndex} width={column.width} 
                  ><div className="completed_status_style">Completed</div></td>
                  }
                 
                  else if(column.accessor1==='quantity_value' && props.outOf==true ){
                    return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
                    ><div>{row.released_quantity_value} {row.released_quantity_value==0?null:row.released_quantity_unit_symbol} / {row[column.accessor1]} {row[column.accessor2]}</div></td>
                  }else if(column.accessor2==='part_short_description'  || column.accessor2 =="vendor"){
                    return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
                    ><div style={{display:'flex',flexDirection:'column'}}>{row[column.accessor1]} <span style={{color:"rgb(200, 198, 198)",fontSize:'1.3rem'}}>{row[column.accessor2] != null?<span>({row[column.accessor2]})</span>:null} </span></div></td>
                  }
                else{
                return <td key={columnIndex} width={column.width} style={{textAlign:column.textalign}}
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
          {props.columns.map((column,columnIndex) => {
           if(column.accessor1 === sortedColumn){
            return <th style={{textAlign:column.textalign}} key={columnIndex}
            onClick={()=> sorting(column.accessor1)}>
              <div className="header_fields">
                <div className="header_title">
                  <div className="title_name">{column.label}</div>
                <div className="sort_direction">{order != 'ASC'?order === 'DSC'?<BsArrowUp className="arrow_icon"/>:<BsArrowDown className="arrow_icon"/>:null}</div>
                
                </div>
                {/* <div className="arrow"><BsArrowDownUp className="arrow_icon"/></div> */}
                </div></th>
           }else{
                 return <th style={{textAlign:column.textalign}} key={columnIndex}
            onClick={()=> sorting(column.accessor1)}>
              <div className="header_fields">
                <div className="header_title">
                  
                  <div className="title_name">{column.label}</div>

                </div>
                {/* <div className="arrow"><BsArrowDownUp className="arrow_icon"/></div> */}
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