import Image from 'next/image';
import Head from 'next/head';
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
import Header from '../components/header';


export default function Home() {
  const router = useRouter();

  const [searchText, setSearchText]=useState(null);
  const [isList, setIsList]= useState(true);
  const [partsList, setPartsList] = useState(null);
  const [partTypeList, setPartTypeList]= useState(null);

  const [showModal, setShowModal]= useState(false);
    const [partType, setPartType] = useState(null);
    const [partName, setPartName] = useState(null);
    const [partDesc, setPartDesc]= useState(null);
    const [token,setToken]= useState(null);
    const [filterOnPartType,setFilterOnPartType]= useState(null);


  const columns = [
    { accessor1: 'part_id', label: 'Part ID' ,width:"20%", textalign:"center"},
    { accessor1: 'part_type_name', label: 'Part Type' ,width:"20%", textalign:"center"},
    { accessor1: 'short_description', accessor2:'long_description' ,label: 'Name & Description' ,width:"60%", textalign:"left"},
    { accessor1: 'quantity', label: 'Quantity',width:"20%" , textalign:"center"},  
  ];
  
  const columns1 = [
    { accessor1: 'part_id', label: 'Part ID' ,width:"20%", textalign:"center"},
    { accessor1: 'part_type_name', label: 'Part Type' ,width:"20%", textalign:"center"},
    { accessor1: 'short_description' ,label: 'Description' ,width:"60%", textalign:"left"},
    { accessor1: 'long_description' ,label: 'Long Description' ,width:"60%", textalign:"left"},
    { accessor1: 'quantity', label: 'Quantity',width:"20%" , textalign:"center"},  
  ];

  
  const notify = () => toast.success("New Part Added Successfully");

  useEffect(()=>{
    // fetch data only if token is defined or redirect to login
    if(localStorage.getItem('token') != undefined){
      localStorage.setItem('selected_item','dashboard')
      const token=localStorage.getItem('token')
      setToken(token)
    fetchPartsList(token).then(
      res=>{
        setPartsList(res.data)}).catch(err=>toast.error(err.message))
    fetchPartTypeList(token).then(
      res=>setPartTypeList(res.data)
    ).catch(err=>toast.error(err.message))
    
  }else{
      router.push('/login');
    }
  },[])



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

 

  //  submit new part details
   const submitPartHandler = () =>{  
    if(partType === null){
      toast.warning('Enter Part Type!');
      return;
    }else if(partName === null){
      toast.warning('Enter Part Name!');
      return;
    }if(partDesc === null){
      toast.warning('Enter Part Description!');
      return;
    }else{
    setShowModal(false)
    addNewPart(partType,partName,partDesc,token).then(res=>{
      notify();
      fetchPartsList(token).then(
        res=>{
          setPartsList(res.data)}).catch(err=>toast.error(err.message))
        })
    setPartName(()=>"");
    setPartType(()=>"");
    setPartDesc(()=>"");
    }
}

// cancel button on modal
const modalCancelHandler = () =>{
  setShowModal(false);
  setPartName(()=>"");
  setPartDesc(()=>"");
  setPartType(()=>"");
}



// display either table or card
  let content =null;
  if(isList && size.width>'600'){
    content= (partsList?<Table key={partsList.length} rows={partsList} columns={columns} search={searchText} path="/ledger" cursor="pointer"
    width="77vw" filter={filterOnPartType} filterIn="part_type_name"/>:<Spinner />)
}
else{
        
  content=(
      partsList?
      <Card partsList={partsList} search={searchText} filter={filterOnPartType} path="/ledger" />
      : <Spinner />
  );
}


  return (
    
    <div className='layout' >
    <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
   {size.width>'600'?<Sidebar />:<Header />}
 <div className="dashboard_page" >
 <div className="dashboard_title" >

                <div className='title'>Available Stocks</div>
                     <div className='sub_title'>Database for all Available Stocks</div>
                    </div> 

                    <div className="search_section">
                    <div style={{marginRight:'2%'}}>{partTypeList?<Dropdown  options={partTypeList} placeholder='Select Part Type' name="name" width="100%" backGround="#F6F7FB"
            parentCallback={(data)=>{setFilterOnPartType(data.name)}} value={partType} dropdownWidth={size.width>'600'?'13vw':'30vw'} border={true} height={size.width>'600'?'4rem':'3rem'}
            searchWidth={size.width>'600'?'10vw':'20vw'}/> : null}</div>

                     <input placeholder="Search.." value={searchText} 
                     className="searchbar" onChange={(e) => {setSearchText(e.target.value)}}/>
                     <div className='search_symbol'><FaSistrix size={17} style={{color:"#3F5575"}}/></div>
                     
                     {/* export parts table */}
                     <div style={{width:'10rem',marginLeft:'5vw',marginRight:'1.5rem'}}>
                     <ReactHtmlTableToExcel

         table="partsTable"
         filename="stock_report"
         sheet="stock_report"
         buttonText="Export" 
         className="export_button" /></div>

                     <div className='export_symbol'><FaExternalLinkAlt size={15} style={{color:"#3F5575"}} /></div>
             </div>

             <div className="subsection">
                 <div className="subheading">Your Available Stocks Report </div>
                 <ToastContainer/>
                 <div className='buttons1'>
                     {size.width>'600'?<div className="icon_box" onClick={()=>setIsList(!isList)}>
                         {isList? <FaList className='list_type_icon'/>: <FaTh className='list_type_icon'/>} 
                     </div>:null }
                     <Link href="/stockIn" ><div  className='stockin_button'>Stock In</div></Link>
                     <Link href="" ><div onClick={()=>setShowModal(true)}  className='dashboard_button'>Add New Part</div></Link>

                 </div></div>
                

                 <div className="dashboard_table" >{content}</div>   


            </div>
      
      {/* modal for adding new parts */}
             <Modal show={showModal} modalClosed={()=> setShowModal(false)}>
            <div className='add_part_title'>Add Part</div>
            <div className='add_part_form'>
          
              {partTypeList?<Dropdown  options={partTypeList} placeholder='Select Part Type' name="name" width="70%" 
            parentCallback={(data)=>setPartType(data.id)} value={partType} dropdownWidth={size.width>'600'?'21vw':'56vw'} border={true}
            searchWidth={size.width>'600'?'17vw':'48vw'} height="3.5rem"/> : null}
      
    
              <input name="part_name" onChange={(e)=>setPartName(e.target.value)} value={partName} placeholder="Part Name" className='modal_input'/>
            <textarea name="part_desc" value={partDesc} className="modal_textarea" placeholder="Description" onChange={(e)=>setPartDesc(e.target.value)}/>
            
            <hr className='modal_hr'/>
          
            <div className="add_parts_button">
                <button  className="cancel_button button2"
                onClick={modalCancelHandler}>Cancel</button>
                <button  className="save_button button2"
                onClick={submitPartHandler}>Save</button></div>
            </div>
        </Modal>
        <div style={{display:'none'}}>{partsList?<Table key={partsList.length} id="partsTable" rows={partsList} columns={columns1} search={searchText} path="/ledger" cursor="pointer"
    width="77vw" filter={filterOnPartType} filterIn="part_type_name" />:<Spinner />}</div>
             </div>
  )
}

// export async function getStaticProps(context) {
//   return {
//     props: {
//       protected: true,
//     },
//   }
// }


