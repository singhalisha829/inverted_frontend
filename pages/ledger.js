import Router from 'next/router';
import Head from 'next/head';
import { useState, useEffect,useRef} from 'react';

import Sidebar from '../components/sidebar';
import { FaFileContract, FaPlus, FaTrashAlt, FaSistrix } from 'react-icons/fa';
import Table from '../components/table';
import Dropdown from '../components/dropdown';
import Header from '../components/header';
import { fetchPartByPartId, fetchLedgerByPartId, fetchVendorList, fetchUnitList, addNewLedger } from '../services/ledgerService';
import LedgerCard from '../components/ledgerCard';

import Spinner from '../components/spinner';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ledger =(props)=>{
    
    const [showForm, setShowForm]= useState(false);
    const [ledger,setLedger]= useState(null);
    const [showLedger, setShowLedger] = useState(false);

    const[selectedDate, setSelectedDate]= useState(null);
    const [vendorList, setVendorList]= useState(null);
    const [unitList, setUnitList]= useState(null);
    const [searchText, setSearchText]= useState(null);
    const [shortDescription, setShortDescription]= useState(null);
    const [longDescription, setlongDescription]= useState(null);
    const [partQuantity, setPartQuantity]= useState(null);
  const [cardFilter, setCardFilter] = useState([]);



    const [selectedStatus,setSelectedStatus]=useState(null);
    const [invoice,setInvoice]=useState(null);
    const [quantity,setQuantity]=useState(null);
    const [unit, setUnit]= useState(null);
    const [price,setPrice]=useState(null);
    const [vendor,setVendor]=useState(null);
    const [partId, setPartId]= useState(null);
    const [ledgerPart, setLedgerPart] = useState(null);
    const [token,setToken] = useState(null);

    const [showPage, setShowPage]= useState(false);

    
    const columns = [
        {accessor1: 'status', label: 'Status' ,width:"15%", textalign:"center"},
        {accessor1: 'date' ,label: 'Date',width:"25%", textalign:"center" },
        {accessor1: 'quantity', label: 'Quantity',width:"25%" , textalign:"center"},
        {accessor1:'vendor_name', label:'Vendor',width:"26%", textalign:"center"},
        {accessor1:'edit', width:"10%"}  
      ];

      const notifySuccessPost = () => toast.success("New Ledger Added Successfully");


    useEffect(()=>{
    // fetch data only if token is defined or redirect to login
    if(localStorage.getItem('token') != null){
    const token = localStorage.getItem('token')
    setToken(token)
    const partName= localStorage.getItem("partId");
    setLedgerPart(partName)

    fetchPartByPartId(partName,token).then(res=>{
        setPartId(res.data[0].id)
        setShortDescription(res.data[0].short_description)
        setlongDescription(res.data[0].long_description)
        setPartQuantity(res.data[0].quantity)})
        
    fetchVendorList(token).then(res=>{   
        setVendorList(res.data)})
    fetchUnitList(token).then(res=>setUnitList(res.data))
    fetchLedgerByPartId(partName,token)
    .then(res=>
        {setLedger(res.data);
            console.log(res.data)
        setShowLedger(true);
        setShowPage(true);
       })}else{
           Router.push('/login')
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

    
    //   submit new ledger only if all values are entered
    const submitPartHandler = () =>{  
        const partName= localStorage.getItem("partId");

        console.log(selectedStatus,invoice,selectedDate,quantity,unit,price,vendor)
        if(selectedStatus === null){
            toast.warning("Enter Status!")
            return;
        }else if(invoice === null){
            toast.warning("Enter Invoice Number!")
            return;
        }else if(selectedDate === null){
            toast.warning("Enter Date!")
            return;
        }else if(unit === null){
            toast.warning("Enter Unit!")
            return;
        }else if(price === null){
            toast.warning("Enter Price!")
            return;
        }else if(quantity === null){
            toast.warning("Enter Quantity!")
            return;
        }else if(vendor === null){
            toast.warning("Enter Vendor!")
            return;
        }else{
            setShowForm(false);
        const formData={
            date:selectedDate,
             quantity:quantity,
            transaction_type:selectedStatus,vendor:vendor,price:price,
            invoice:invoice,unit:unit,part:partId
        };
        console.log(formData)
        addNewLedger(formData,token).then(()=>{
            setSelectedDate(()=>'')

            // fetch list of ledgers again
            fetchLedgerByPartId(partName,token)
            .then(res=>
                setLedger(res.data));
                notifySuccessPost();
        }
        ).catch(function (err){
            console.log(err)
        })
        
    }

    console.log('end')

    }

      // search feature in cards list
  const searchCard=(event) =>{
    const search= event.target.value;
    console.log(search)
    if(search !== undefined){
        const filterTable = ledger.filter(o => Object.keys(o).some(
          k => String(o[k]).toLowerCase().includes(search.toLowerCase()))
        );
        setCardFilter([...filterTable])
      }else{
        setLedger([...ledger])
        setCardFilter([...ledger])
      }
   }


    // cancel button of ledger form
    const cancelPartHandler = () =>{
        setShowForm(false);
        setSelectedDate(()=>'')
    }


    const status=[{name:'Stock In', value:'CREDIT'},{name:'Stock Out', value:'DEBIT'}]
    let form = null;

    // ledger form visible on clicking add button
    if(showForm){
        form=(<div className="ledger_form">
            <div className='ledger_form_row'>
                <div className="field_width">Status:
                <div >
                <Dropdown placeholder='Select Status' options={status} name="name" parentCallback={(data)=>setSelectedStatus(data.value)} width={size.width>'600'?'70%':'100%'}
                dropdownWidth={size.width>'600'?'16vw':'30vw'} searchWidth={size.width>'600'?'13vw':'22vw'} height="3rem" border={true}/></div>
                </div>
                <div className="field_width"><label>Invoice Number:</label>
                    <input style={{marginTop:'0',height:'3rem',width:size.width>'600'?'70%':'100%'}} placeholder='Enter Invoice Number' onChange={(e)=>setInvoice(e.target.value)} className="ledger_input"/></div>
                <div className="field_width"><label>Date:</label>
                            <DatePicker placeholderText='Enter Date' selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
    
                        </div>
                </div>
            <div className='ledger_form_row'>
                
                <div className='field_width'>
                    <label>Quantity:</label>
                    <div style={{display:'flex'}} className="ledger_input">
                    <input type="number" style={{marginTop:'0', width:'30%', height:"3rem", marginRight:size.width>'600'?'1rem':'0.5rem'}}    
                    onChange={(e)=>setQuantity(e.target.value)} />
                    <Dropdown width="70%" placeholder='Select Unit' options={unitList} name="name" dropdownWidth={size.width>'600'?'11vw':'27vw'} searchWidth={size.width>'600'?'8vw':'19vw'} height="3rem"
                    parentCallback={(data)=>setUnit(data.symbol)} border={true}/></div>
                </div>
                <div className='field_width'><label>Price:</label><input placeholder="Enter Price" style={{marginTop:'0', height:"3rem"}} type="number" className='ledger_input'
                onChange={(e)=>setPrice(e.target.value)}/></div>

<div className="field_width">
                Vendor:<Dropdown width={size.width>'600'?'70%':'100%'} placeholder='Select Vendor' name="name" options={vendorList} height="3rem"
            parentCallback={(data)=>setVendor(data.id)} dropdownWidth={size.width>'600'?'16vw':'30vw'} searchWidth={size.width>'600'?'13vw':'20vw'} border={true}/></div>
            </div>
            <div style={{display:"flex",justifyContent:'flex-end'}}>

            <div className='ledger_button'><button className='cancel_button button2'
                       onClick={()=>{cancelPartHandler()}}>Cancel</button>
                       <button className='save_button button2'
                       onClick={submitPartHandler}>Save</button>
                       </div></div>
        </div>);
        }


    // load page only after fetching all apis
    let ledgerPage= <Spinner />;
    if(showPage){
        ledgerPage=(<div className='layout'>
            <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
            {size.width>'600'?<Sidebar /> : <Header show="true" />}
        <div className="ledger_page" >
            <ToastContainer />
        <div className="part_details">
    
                {ledgerPart?<div className="part_id1">#{localStorage.getItem('partId')}</div>:null}
                <div className="part_desc">
                    <div className='desc_title'>
                <div style={{display:'flex'}}><FaFileContract/>
                {shortDescription?<div>{shortDescription?shortDescription:null}</div>:null} </div>
                </div>
                <div className='ledger_longdesc'>{longDescription?longDescription:null}</div>
                </div>

                <div className='ledger_quantity' >{partQuantity? partQuantity:null}</div></div>

                <div className='body'>
                <div className="body_header">
                <div className='ledger_title'>Ledger</div>
                <input placeholder="Search for code or name" value={searchText} 
                        className="ledger_search" 
                        onChange={(e) => {setSearchText(e.target.value);searchCard(e)}}/>
                        <FaSistrix size={17} className="ledger_search_icon"/>
                <button onClick={() =>{setShowForm(true)}}><FaPlus size={size.width>'600'?'13':'10'}/> Add</button></div>

                <div className="ledger_table">
                    {form}
                    
                    {size.width>'600'?<div><Table key={ledger.length} rows={ledger} columns={columns} search={searchText} width="77vw"/></div>:null}</div>
                   

                </div>
                {size.width<'600'?<div className='ledger_cards_list'>
                    <div className='ledger_card_header'>
                        <div style={{width:'25%'}} className="card_items">Status</div>
                        <div style={{width:'25%'}} className="card_items">Date</div>
                        <div style={{width:'20%'}} className="card_items">Quantity</div>
                        <div style={{width:'30%'}} className="card_items">Vendor</div>
                    </div>
                    {searchText != undefined?cardFilter.map((card)=>(<LedgerCard key={card.id} status={card.transaction_type} date={card.date}
                    quantity={card.quantity} vendor={card.vendor_name}/>)):
                    ledger.map((card)=>(<LedgerCard key={card.id} status={card.transaction_type} date={card.date}
                        quantity={card.quantity} vendor={card.vendor_name}/>))}</div>
                  :null}
                  </div>
               
            </div>
            )
    }

    return(
        <div>
            {ledgerPage}
            </div>
    )
}

export default Ledger;