import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchPartsList } from '../services/dashboardService';
import { fetchUnitList } from '../services/ledgerService';
import { createPurchaseOrder } from "../services/purchaseOrderService";

import PurchaseOrderList from "../components/purchaseOrderList";
import Dropdown from "../components/dropdown";
import { FaSistrix,FaCheckCircle, FaTimesCircle} from 'react-icons/fa';
import { toast } from "react-toastify";


const NewPurchaseOrder =() =>{

    const [orderType,setOrderType]= useState(null);
    const [name,setName]= useState([]);
    const [quantity,setQuantity]= useState('');
    const [token,setToken]= useState(null);
    const [unit,setUnit] = useState(null);
    const [unitList, setUnitList]= useState(null);
    const [showUnit,setShowUnit]= useState(false);
    const [newPoList,setNewPoList]= useState([]);



    const order_type=[{value:'BOM',name:'BOM'},{value:'PART',name:'PART'}]

    useEffect(()=>{
        // fetch data only if token is defined or redirect to login
        if(localStorage.getItem('token') != undefined){
          const token=localStorage.getItem('token');
          setToken(token)
          fetchUnitList(token).then((res)=>setUnitList(res.data))
        
        
        
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

    const submitHandler = () =>{
        console.log(name,quantity,orderType,unit)
        if(name !='' && quantity != '' && orderType !=''){
            const data={
                ItemType:orderType,
                item_id:name,
                quantity:quantity+" "+unit,
            }
            const newList = [data,...newPoList];
            setNewPoList(newList);
            cancelHandler();

        }
    }

    const cancelHandler=() =>{
        setOrderType("");
        setQuantity(()=>'');
        setName('');
        setUnit('');
    }

    const fetchOrderName=(data)=>{
        setToken(localStorage.getItem('token'))
        if(data==="PART"){
            fetchPartsList(token).then(
                res=>setName(res.data)).catch(err=>toast.error(err.message))
            setShowUnit(true);
        }else{

        }
    }

    const submitPurchaseOrder=()=>{
        createPurchaseOrder(newPoList,token).then(()=>{
            toast.success('Submited Successfully')
        })
    }

    // remove the part from list on clicking the trash icon
    const handleDeleteNote=(id)=>{
        const newList=newPoList.filter((list) => list.order_name !== id);
        setNewPoList(newList)
    }

    return(
        <div className="layout">
            <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
    {size.width>'600'?<Sidebar /> : <Header />}
    <div className="new_purchase_order_page">
    <div className="order_title">
                <div className="title">Purchase Orders</div>
                     <div className="sub_title">Place New Orders</div>
                    </div> 
                    <div className="new_order_subsection">
                    <input  style={{width:"70%",height:'3.5rem'}} placeholder="Search.."/>
                    <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>
                </div>

                <div className="new_order_form">
                    <div style={{width:'25%'}}><label>Order Type:</label>
                    <Dropdown options={order_type} name="name" width="70%" parentCallback={(data)=>{setOrderType(data.value);fetchOrderName(data.value)}}
                    dropdownWidth={size.width>'600'?'13vw':'20vw'} searchWidth={size.width>'600'?'10vw':'12vw'} border={true} value={orderType}/></div>
                    <div style={{width:'25%'}}><label>Order Name:</label>
                    <Dropdown options={name} name="short_description" width="70%" parentCallback={(data)=>setName(data.id)} value={name}
                    dropdownWidth={size.width>'600'?'13vw':'20vw'} searchWidth={size.width>'600'?'10vw':'12vw'} border={true}/></div>
                    <div style={{width:'25%'}}><label>Required Quantity</label>
                    {showUnit? <div style={{display:'flex',width:size.width>'600'?'70%':'90%', border:"#e5e5e5 solid 0.1em",borderRadius:'5px'}}>
            <input value={quantity} style={{width:"35%",height:"3rem",border:'none'}} className="quantity" type="number" onChange={(e)=>setQuantity(e.target.value)} placeholder={size.width<'600'?'Enter Quantity':null}/>
            <div style={{borderLeft:"#e5e5e5 solid 0.1em"}}/>
            {unitList?<Dropdown options={unitList} placeholder="Select Unit" width="60%" name="name" minWidth="9rem" no_outline={true}
            parentCallback={(data)=>setUnit(data.symbol)} value={unit} dropdownWidth={size.width>'600'?"11vw":'40vw'} searchWidth={size.width>'600'?"8vw":'30vw'} height="3rem"/>:null}</div>
            :
            <input type="number" value={quantity} style={{height:'3rem',width:'70%'}} onChange={(e)=>setQuantity(e.target.value)}/>}
                    </div>
                    <div style={{width:'25%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div className="form_icons">
                   
            <FaCheckCircle onClick={submitHandler} size={30} className="check_icon"/>
            <FaTimesCircle size={30}  onClick={cancelHandler} className="cross_icon" />
            </div>
                    </div>

                    
                </div>
                {newPoList.map((l)=><PurchaseOrderList key={l.item_id} order_type={l.ItemType}  quantity={l.quantity} order_name={l.item_id}
            deleteNote={(data)=>handleDeleteNote(data)}/>)}

            
<div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button className="cancel_button button2" onClick={()=>{Router.back();}}>Cancel</button>
                        <button className="save_button button2" onClick={submitPurchaseOrder}>Create Order</button>
                        </div></div>
    </div>
        </div>
    )
}

export default NewPurchaseOrder;