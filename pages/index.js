import Head from 'next/head'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link'; 
import { useRouter } from 'next/router';

import Pattern from '../public/artboard.png';
import Sidebar from '../components/sidebar';
import Table from '../components/table';
import Card from '../components/card';
import Dropdown from '../components/dropdown';
import { fetchPartsList, addNewPart ,fetchPartTypeList} from '../services/dashboardService';
import Modal from '../components/modal';
import Spinner from '../components/spinner';

import { FaSistrix, FaExternalLinkAlt, FaList,FaTh,FaArrowRight } from 'react-icons/fa';
import ReactHtmlTableToExcel from "react-html-table-to-excel";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  const router = useRouter();
  // const userToken= localStorage.getItem('token');

  const [searchText, setSearchText]=useState(null);
  const [isList, setIsList]= useState(true);
  const [partsList, setPartsList] = useState(null);
  const [partTypeList, setPartTypeList]= useState(null);
  const [cardFilter, setCardFilter] = useState([]);

  const [showModal, setShowModal]= useState(false);
    const [partType, setPartType] = useState(null);
    const [partName, setPartName] = useState(null);
    const [partDesc, setPartDesc]= useState(null);
    const [showPage, setShowPage]= useState(false);
    const [token,setToken]= useState(null);

    // const [width,setWidth] = useState(getWindowDimensions());

  const columns = [
    { accessor1: 'part_id', label: 'Part ID' ,width:"20%", textalign:"center"},
    { accessor1: 'short_description', accessor2:'long_description' ,label: 'Name & Description' ,width:"60%", textalign:"left"},
    { accessor1: 'quantity', label: 'Quantity',width:"20%" , textalign:"center"},  
  ];

  
  const notify = () => toast("New Part Added Successfully");

  useEffect(()=>{
    if(localStorage.getItem('token') != undefined){
      const token=localStorage.getItem('token')
      setToken(token)
    fetchPartsList(token).then(
      res=>setPartsList(res.data) );
    fetchPartTypeList(token).then(
      res=>setPartTypeList(res.data)
    )
    setShowPage(true);
    // window.addEventListener('click', alert('hey'))
    // return()=> window.removeEventListener('click', alert('hey'))
  }else{
      router.push('/login');
    }
  },[])


  const searchCard=(event) =>{
    const search= event.target.value;
    if(search !== undefined){
        const filterTable = partsList.filter(o => Object.keys(o).some(
          k => String(o[k]).toLowerCase().includes(search.toLowerCase()))
        );
        setCardFilter([...filterTable])
      }else{
        setPartsList([...this.state.partsList])
        setCardFilter([...this.state.partsList])
      }
   }

   const submitPartHandler = () =>{  
    console.log(partType,partName,partDesc)
    setShowModal(false)
    addNewPart(partType,partName,partDesc,token).then(res=>{notify()})
    setPartName(()=>"");
    setPartType(()=>"");
    setPartDesc(()=>"");
}

const modalCancelHandler = () =>{
  setShowModal(false);
  setPartName(()=>"");
  setPartDesc(()=>"");
  setPartType(()=>"");
}



  let content =null;
  if(isList){
    content= (partsList?<Table id="partsTable" rows={partsList} columns={columns} search={searchText} path="/ledger" cursor="pointer"
    width="77vw" />:<Spinner/>)
}
else{
        
  content=(
      <div className="cards_list">
          {searchText != undefined?cardFilter.map((card)=>(
              <Card key={card.part_id} part_id={card.part_id} title={card.short_description} quantity={card.quantity} desc={card.long_description} />
          )):partsList.map((card)=>(
              <Card key={card.part_id} part_id={card.part_id} title={card.short_description} quantity={card.quantity} desc={card.long_description} />
          ))}
      </div>
  );
}
 let dashboardPage= <Spinner />;
 if(showPage){
   dashboardPage=(<div className='layout' >
   <Sidebar />
 <div className="dashboard_page" >
 <div className="dashboard_title" >

                <div style={{fontWeight:'600',fontSize:'3rem',lineHeight:'3.6rem',marginBottom:'0.5rem'}}>Available Stocks</div>
                     <div style={{fontWeight:'400',fontSize:'1.6rem',lineHeight:'1.9rem'}}>Database for all Available Stocks</div>
                    </div> 

                    <div className="search_section">
                     <input placeholder="Search for code or name" value={searchText} 
                     style={{width: "75%",height: "44px",background: "#F6F7FB",
                       border: "1px solid #E5E5E5",boxSizing: "border-box",boxShadow: "0px 2px 1px rgba(225, 228, 237, 0.2)",
                       borderRadius: "3px", paddingLeft:'10px',fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "18px"}}
                     onChange={(e) => {setSearchText(e.target.value);searchCard(e)}}/>
                     <div className='search_symbol'><FaSistrix size={17} style={{color:"#3F5575"}}/></div>
                     <ReactHtmlTableToExcel
         table="partsTable"
         filename="stock_report"
         sheet="stock_report"
         buttonText="Export" 
         className="export_button" />

                     <div className='export_symbol'><FaExternalLinkAlt size={15} style={{color:"#3F5575"}} /></div>
             </div>

             <div className="subsection">
                 <div className="subheading">Your Available Stocks Report </div>
                 <ToastContainer/>
                 <div style={{display:'flex',width:'28rem'}}>
                     <div className="icon_box" onClick={()=>setIsList(!isList)}>
                         {isList? <FaList cursor="pointer"/>: <FaTh cursor="pointer"/>} 
                     </div> 
                     <Link href="/stockIn" ><div style={{marginRight:'2rem', width:'7.5rem'}} className='dashboard_button'>Stock In</div></Link>
                     <Link href="" ><div onClick={()=>setShowModal(true)} style={{marginLeft:'1%'}} className='dashboard_button'>Add New Part</div></Link>

                 </div></div>
                

                 <div className="dashboard_table" >{content}</div>   


            </div>
      
             <Modal show={showModal} modalClosed={()=> setShowModal(false)}>
            <div style={{color:"#6B6B6B", padding:'20px',paddingBottom:"40px",fontStyle: "normal",fontWeight: "600",
            fontSize: "16px",lineHeight: "19px"}}>Add Part</div>
            <div className='add_part_form'>
          
              {partTypeList?<Dropdown  options={partTypeList} placeholder='Select Part Type' name="name" width="70%" 
            parentCallback={(data)=>setPartType(data.id)} value={partType}/> : <Spinner/>}
      
    
                <input name="part_name" onChange={(e)=>setPartName(e.target.value)} value={partName} placeholder="Part Name" 
                style={{height:"35px", width:"70%", borderRadius:'3px', marginBottom:'10px',marginTop:'10px'}}/>
            <textarea name="part_desc" value={partDesc} placeholder="Description" onChange={(e)=>setPartDesc(e.target.value)}/>
            
            <hr style={{border:"#e5e5e5 solid 0.001em", width:"70%", marginTop:"20px"}}/>
          
            <div className="add_parts_button">
                <button style={{backgroundColor:"white", color:"#ACB3BF",border:"#ACB3BF solid 0.15em", fontFamily: 'Inter',
                fontStyle: "normal",fontWeight: "600",fontSize: "15px",linHeight: "15px",marginRight:'1rem'}}
                onClick={modalCancelHandler}>Cancel</button>
                <button style={{backgroundColor:"#33B850",fontFamily:'Inter',fontStyle: "normal",fontWeight: "600",fontSize: "15px",linHeight: "15px"}}
                onClick={submitPartHandler}>Save</button></div>
            </div>
        </Modal>
             </div>)
 }
  return (
    
    <div>
      {dashboardPage}</div>
  )
}
