import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";
import Router from 'next/router';

import { fetchPartsList } from '../services/dashboardService';


import Dropdown from "../components/dropdown";
import { FaSistrix,FaCheckCircle, FaTimesCircle} from 'react-icons/fa';


const NewPurchaseOrder =() =>{

    const [orderType,setOrderType]= useState(null);
    const [name,setName]= useState([]);
    const [quantity,setQuantity]= useState('');
    const [token,setToken]= useState(null);



    const order_type=[{value:'bom',name:'BOM'},{value:'part',name:'PART'}]

    useEffect(()=>{
        // fetch data only if token is defined or redirect to login
        if(localStorage.getItem('token') != undefined){
          const token=localStorage.getItem('token');
          setToken(token)
        
        
        
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
        if(name !='' && quantity != '' && orderType !=''){
            const data={
                order_type:orderType,
                name:name,
                quantity:quantity
            }
            const newList = [data,...stockOutList];
            setStockOutList(newList);
            setName('');
            setOrderType(()=>'');
            setQuantity('')
        }
    }

    const cancelHandler=() =>{
        setOrderType(()=>"");
        setQuantity(()=>'');
        setName(()=>'')
    }

    const fetchOrderName=(data)=>{
        const token=localStorage.getItem('token')
        console.log(data)
        if(data==="part"){
            fetchPartsList(token).then(
                res=>{
                  console.log(res.data)
                  setName(res.data)}).catch(err=>toast.error(err.message))
        }else{

        }
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
                    <input  style={{width:"70%"}} placeholder="Search.."/>
                    <div className="new_order_search"><FaSistrix size={17} color="#3F5575"/></div>
                </div>

                <div className="new_order_form">
                    <div style={{width:'25%'}}><label>Order Type:</label>
                    <Dropdown options={order_type} name="name" width="70%" parentCallback={(data)=>{setOrderType(data.value);fetchOrderName(data.value)}}
                    dropdownWidth={size.width>'600'?'13vw':'20vw'} searchWidth={size.width>'600'?'10vw':'12vw'} border={true}/></div>
                    <div style={{width:'25%'}}><label>Part Name:</label>
                    <Dropdown options={name} name="short_description" width="70%" parentCallback={(data)=>setName(data.value)}
                    dropdownWidth={size.width>'600'?'13vw':'20vw'} searchWidth={size.width>'600'?'10vw':'12vw'} border={true}/></div>
                    <div style={{width:'25%'}}><label>Required Quantity</label>
                    <input type="number" value={quantity} style={{height:'3rem',width:'70%'}} onChange={(e)=>setQuantity(e.target.value)}/></div>
                    <div style={{width:'25%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div className="form_icons">
                   
            <FaCheckCircle onClick={submitHandler} size={30} className="check_icon"/>
            <FaTimesCircle size={30}  onClick={cancelHandler} className="cross_icon" />
            </div>
                    </div>

                    
                </div>
    </div>
        </div>
    )
}

export default NewPurchaseOrder;