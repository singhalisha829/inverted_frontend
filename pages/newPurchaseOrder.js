import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchPartsList } from '../services/dashboardService';
import { fetchUnitList } from '../services/ledgerService';
import { createPurchaseOrder , fetchBOMList } from "../services/purchaseOrderService";

import PurchaseOrderList from "../components/purchaseOrderList";
import Dropdown from "../components/dropdown";
import { FaSistrix,FaCheckCircle, FaTimesCircle} from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const NewPurchaseOrder =() =>{

    const [orderType,setOrderType]= useState(null);
    // const [name,setName]= useState([]);
    const [quantity,setQuantity]= useState('');
    const [token,setToken]= useState(null);
    const [unit,setUnit] = useState(null);
    const [unitList, setUnitList]= useState(null);
    const [showUnit,setShowUnit]= useState(false);
    const [newPoList,setNewPoList]= useState([]);
    const [orderList,setOrderList]= useState([]);
    const [orderName,setOrderName]= useState(null);
    const [orderValue,setOrderValue]= useState(null);



    const order_type=[{value:'BOM',name:'BOM'},{value:'Part',name:'PART'}]

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
        if(orderType=== null || orderType===''){
            toast.warning('Select Order Type!')
        }else if(orderName=== null || orderName===''){
            toast.warning('Select Order Name!')
        }else if(quantity === ''){
            toast.warning('Enter Qunatity!')
        }else if(orderType==='Part' && unit === ''){
            toast.warning('Select Unit!')
        }else if(orderType==='BOM'){

            const data={
                ItemType:orderType,
                item_id:orderName,
                quantity:quantity+" Nos",
            }
            console.log(data)
            const newList = [data,...newPoList];
            setNewPoList(newList);
            cancelHandler(); 
        }
        else{ 

            const data={
                ItemType:orderType,
                item_id:orderName,
                quantity:quantity+" "+unit,
            }
            console.log(data)
            const newList = [data,...newPoList];
            setNewPoList(newList);
            cancelHandler(); 
        }
        
    }

    const cancelHandler=() =>{
        setOrderType("");
        setQuantity(()=>'');
        setOrderName('');
        setUnit('');
    }


    const fetchOrderName=(data)=>{
        setToken(localStorage.getItem('token'))
        if(data==="Part"){
            setOrderValue('short_description')
            fetchPartsList(token).then(
                res=>{setOrderList(res.data)}).catch(err=>toast.error(err.message))
                
            setShowUnit(true);
 
        }else{
            setOrderValue('product_description')
            fetchBOMList(token).then(
                res=>{setOrderList(res.data.data.output)}).catch(err=>toast.error(err.message))
            setShowUnit(false);
            

        }
    }

    

    const submitPurchaseOrder=()=>{
        console.log(newPoList.length)
        if(newPoList.length===0){
            toast.warning('Enter Form Details!')
        }else{
        createPurchaseOrder(newPoList,token).then((res)=>{
            localStorage.setItem('poId',res.data.status.purchase_order_id);
            console.log(res.data.status.purchase_order_id);
            cancelHandler();
            Router.push('/selectVendor');
        }
        )
        console.log(newPoList)
    }
    }

    console.log(orderType)

    // remove the part from list on clicking the trash icon
    const handleDeleteOrder=(id)=>{
        const newList=newPoList.filter((list) => list.item_id !== id);
        setNewPoList(newList)
    }


    const form=( <div className="new_po_order_form">
        <div style={{width:"25%"}}>{size.width>'600'?<label style={{marginBottom:"0.5rem"}}>Order Type:</label>:null}
        <Dropdown options={order_type} name="name" width={size.width>'600'?'70%':'90%'} parentCallback={(data)=>{setOrderType(data.value);fetchOrderName(data.value)}}
        dropdownWidth={size.width>'600'?'13vw':'20vw'} searchWidth={size.width>'600'?'10vw':'12vw'} border={true} value={orderType}
        placeholder="Select Order Type"/></div>
        
        <div style={{width:"25%"}}>{size.width>'600'?<label style={{marginBottom:"0.5rem"}}>Order Description:</label>:null}
        <Dropdown options={orderList} name={orderValue} width="70%" parentCallback={(data)=>setOrderName(data.id)} value={orderName}
dropdownWidth={size.width>'600'?'13vw':'20vw'} searchWidth={size.width>'600'?'10vw':'12vw'} border={true} placeholder="Select Order"/>
</div>
        <div style={{width:"25%"}}>{size.width>'600'?<label style={{marginBottom:"0.5rem"}}>Required Quantity</label>:null}
        {showUnit? <div style={{display:'flex',width:size.width>'600'?'70%':'90%', border:"#e5e5e5 solid 0.1em",borderRadius:'5px'}}>
<input value={quantity} placeholder="0.00" style={{width:"35%",height:"3rem",border:'none'}} className="quantity" type="number" onChange={(e)=>setQuantity(e.target.value)}/>
<div style={{borderLeft:"#e5e5e5 solid 0.1em"}}/>
{unitList?<Dropdown options={unitList} placeholder="Unit" width="60%" name="name" minWidth="9rem" no_outline={true}
parentCallback={(data)=>setUnit(data.symbol)} value={unit} dropdownWidth={size.width>'600'?"11vw":'40vw'} searchWidth={size.width>'600'?"8vw":'30vw'} height="3rem"/>:null}</div>
:
<input type="number" placeholder="0.00" value={quantity} style={{height:'3rem',width:'70%'}} onChange={(e)=>setQuantity(e.target.value)}/>}
        </div>
        <div style={{width:'25%',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div className="form_icons">
       
<FaCheckCircle onClick={submitHandler} size={30} className="check_icon"/>
<FaTimesCircle size={30}  onClick={cancelHandler} className="cross_icon" />
</div>
        </div></div>);
    

    return(
        <div className="layout">
            <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
    {size.width>'600'?<Sidebar /> : <Header />}
    <div className="new_purchase_order_page">
        <ToastContainer />
    <div className="order_title">
                <div className="title">Purchase Orders</div>
                     <div className="sub_title">Place New Orders</div>
    </div> 
                    <div className="new_order_subsection">
                    <input  style={{width:"70%",height:'3.5rem'}} placeholder="Search.."/>
                    <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>
                </div>

                {form}
        
                {newPoList.map((l)=><PurchaseOrderList key={l.item_id} order_type={l.ItemType}  quantity={l.quantity} order_name={l.item_id}
            deleteOrder={(data)=>handleDeleteOrder(data)}/>)}

            
<div className="stock_out_footer">
                    <div className="stock_out_button">
                        <button className="cancel_button button2" onClick={()=>{Router.back();}}>Cancel</button>
                        <button className="save_button button2" onClick={submitPurchaseOrder}>Save</button>
                        </div></div>
    </div>
        </div>
    )
}

export default NewPurchaseOrder;