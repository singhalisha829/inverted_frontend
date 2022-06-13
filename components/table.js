import { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";

import {BsBoxArrowUp, BsBoxArrowInDown} from 'react-icons/bs';

import Logo  from '../public/Logo_inverted.png';





const Table = (props) => {

    const [data, setData]= useState(props.rows);
    const [order, setOrder]= useState('ASC');
    const [tableFilter, setTableFilter] = useState([]);
    
   useEffect(()=>{
     if(props.search != undefined && props.filter !=undefined ){
      const searchTable = data.filter(o => Object.keys(o).some(
        k => String(o[k]).toLowerCase().includes(props.search.toLowerCase()))
      );

      const filterTable= searchTable.filter(o=> Object.keys(o).some(
        k=> String(o[k]).toLowerCase().includes(props.filter.toLowerCase())
      ))

      setTableFilter([...filterTable])
     }
     else if(props.search != undefined ){
       const searchTable = data.filter(o => Object.keys(o).some(
         k => String(o[k]).toLowerCase().includes(props.search.toLowerCase()))
       );

       setTableFilter([...searchTable])
     }
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

 for(let i=0;i<data.length;i++){
   console.log(data[i].image)
 }
    const sorting= (col) =>{
        if(order === 'ASC'){
            const sorted= [...props.rows].sort((a,b)=>
            a[col]> b[col] ? 1: -1 );
            // console.log(sorted)
            setData(sorted);
            // setTableFilter(sorted);
            setOrder('DSC');
        }

        if(order === 'DSC'){
            const sorted= [...props.rows].sort((a,b)=>
            a[col]< b[col] ? 1: -1 );
            // console.log(sorted);
            setData(sorted);
            // setTableFilter(sorted);
            // console.log(data)
            setOrder('ASC');
        }
    }
     

    const myLoader = ({ src, width, quality }) => {
      return `https://bom-inverted.s3.amazonaws.com/bom/parts/INVC0130016.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6HRCINQKW4SKY4MK%2F20220613%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220613T053319Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=3622bb8cb202c62ddd9a65840ab3102cf7537bf9cf9b3476072a70416942b247`
    }
    
    const clickHandler=()=>{
      if(props.path){
      Router.push(props.path)}
    
    }

    let table_content=null;
    // if(props.path!= null){
      table_content=(<tbody>
        {props.search != undefined || props.filter != undefined?tableFilter
        .map(row => {
          return (
            <tr key={row.part_id} onClick={()=>{localStorage.setItem('partId',row.part_id);localStorage.setItem('orderId',row.order_id);console.log(row.part_id);
            clickHandler()}}>
              {props.columns.map(column => {
                if(column.accessor1==='part_id'){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign,color:'#EB2129'}}
                ><div className="part_id_box">#{row[column.accessor1]}</div></td>
                }

                else if(column.accessor1==='short_description'){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign, color:"#9E9E9E",
                  }}
                ><div style={{display:'flex'}}>
                <div className="parts_image">
                  
                {row.image === null? <Image src={Logo} layout="fill" objectFit="contain"/>
                    :<Image src={row.image} layout="fill" objectFit="contain" />}
                  
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
    else if(column.accessor1==='status' && row.status==="Pending"){
      return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign}}
    ><div className="pending_status_style">Pending</div></td>
    }
    else if(column.accessor1==='status' && row.status==='Partially Processed' ){
      return <td key={column.accessor1} width={column.width} 
    ><div className="partial_status_style">Partially Processed</div></td>
    }
    else if(column.accessor1==='status' && row.status==='Completed' ){
      return <td key={column.accessor1} width={column.width} 
    ><div className="completed_status_style">Completed</div></td>
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
             clickHandler()}}>
              {props.columns.map(column => {
                if(column.accessor1==='part_id'){
                  return <td key={column.accessor1} width={column.width} style={{ margin:'auto', color:'#EB2129'}}
                ><div className="part_id_box">#{row[column.accessor1]}</div></td>
                }
                
                else if(column.accessor1==='short_description'){
                  return <td key={column.accessor1} width={column.width} style={{textAlign:column.textalign, color:'#9E9E9E'}}
                ><div style={{display:'flex'}}>
                  <div className="parts_image">
              
                    {row.image === null? <Image src={Logo} layout="fill" objectFit="contain"/>
                    :<Image src={row.image} layout="fill" objectFit="contain" />}
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
                  else if(column.accessor1==='status' && row.status==='Pending' ){
                    return <td key={column.accessor1} width={column.width} 
                  ><div className="pending_status_style">Pending</div></td>
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
                ><div><input type="number" style={{width:'40%',height:'3rem'}}/></div></td>
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
            return <th style={{textAlign:column.textalign}} key={column.accessor1}
            onClick={()=> sorting(column.accessor1)}>{column.label}</th>
          })}
        </tr>
      </thead>
        {table_content}
      </table>
    )
  }



  export default Table;