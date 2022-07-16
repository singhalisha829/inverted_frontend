import { useEffect, useState } from 'react';

import { fetchVendorList } from '../services/ledgerService';
import Dropdown from './dropdown';
import { GoRepoForked} from 'react-icons/go';
import { FaTrashAlt, FaCheckCircle } from 'react-icons/fa';

const PartsList = (props) =>{
    const [vendorList, setvendorList] = useState(null);
    const [vendor,setVendor]= useState(null);
    const [split,setSplit]= useState([]);
    const [quantity,setquantity]= useState([{quantity:props.quantity,id:1}]);
    const [lastId,setLastId]= useState(1);
    const [currentVal,setCurrentVal]= useState(props.quantity)

    // const [splitBranch,setSplitBranch]= useState([]);
    const [lastBranch,setLastBranch]= useState(null);
    const [showForm,setShowForm]= useState(false);



    useEffect(()=>{
        const token= localStorage.getItem('token')
        fetchVendorList(token).then(res=>setvendorList(res.data))
    },[])

    const expand =() =>{
        const index=Math.floor(Math.random()*100)
        const newList=[...split,{id:index}]
        setSplit(newList)
    }

    const condense =(id)=>{
        const newList= split.filter(l=>l.id!=id);
        setSplit(newList)
        
    }
    
    const handleQuantity=(value)=>{
        const newList= quantity;
        const newVal=null;
        if(newList.length==1){
            newVal=props.quantity-value;
            newList[0].quantity=newVal;
        }else{
            newVal=lastBranch-value;
            newList[lastId-1].quantity=newVal;
        }
        
       setquantity(newList)
       setCurrentVal(newVal) //just to update ui,update state
            
    }

    const splitHandler=() =>{
        const newList1=null;
        if(quantity.length==1){
        newList1= [...quantity,{id:lastId+1,quantity:props.quantity-quantity[0].quantity}]
        }else{
        newList1=[...quantity,{id:lastId+1,quantity:lastBranch-quantity[lastId-1].quantity}]
        }
        setquantity(newList1)
        setLastBranch(newList1[lastId].quantity)
        setLastId(lastId+1);
        setShowForm(false);
    }
// console.log("quantity",quantity)
// console.log("splitBranch",splitBranch)

    
    return(
        <div className="po_list_form">
            <div className='po_list_form_rows'>
        <div style={{width:"10%"}} className="vendor_header">{props.partId}</div>

           <div  style={{width:"23%"}} className="vendor_header">{props.partName}</div>
           <div style={{width:'2%'}} className="split"><GoRepoForked size={20}  style = {{transform: 'rotate(90deg)'}} onClick={()=>setShowForm(true)}/></div>
           
           <div  style={{width:"20%",display:'flex',flexDirection:'column',alignItems:'center'}} className="vendor_header">
            {quantity.map((branch)=>(<div key={branch.id} style={{display:'flex'}}>
            {branch.quantity} <div style={{marginLeft:'2vw'}}>{props.unit}</div></div>))}</div>
           
           <div style={{width:'15%'}} className="vendor_header"><input type="number" style={{height:'3rem',width:'70%'}} onChange={(e)=>props.handleUnitPrice(props.id,e.target.value,props.quantity,props.unit)}/></div>
        <div style={{width:'30%',paddingLeft:'5vw'}} >
        {vendorList?<Dropdown  placeholder='Select Vendor' name="name" options={vendorList} height="3rem" value={vendor} width="50%"
            parentCallback={(data)=>{setVendor(data.id);props.handleVendor(props.id,data.id,props.quantity,props.unit)}} border={true} dropdownWidth="15vw" searchWidth="12vw"/>:null}
            </div>
        
        </div>
        {showForm?
            <div style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
            <div className='split_row'>
                <div style={{width:'30%',display:'flex'}}>
                <div style={{width:'50%',display:'flex',justifyContent:'end'}}><input type="number" style={{height:'3rem',width:'70%'}} onChange={(e)=>handleQuantity(e.target.value)}/></div>
                <div style={{width:'50%',display:'flex',justifyContent:'end'}}><input type="number" style={{height:'3rem',width:'90%'}}/></div></div>
                <div style={{width:'25%',display:'flex',justifyContent:"center"}}><input type="number" style={{height:'3rem',width:'65%'}}/></div>
                <div style={{width:'27%',display:'flex',justifyContent:'end'}}>{vendorList?<Dropdown  placeholder='Select Vendor' name="name" options={vendorList} height="3rem" value={vendor} width="66%"
            parentCallback={(data)=>{setVendor(data.id);props.handleVendor(props.id,data.id,props.quantity,props.unit)}} border={true} dropdownWidth="15vw" searchWidth="12vw"/>:null}</div>
            <div className='split_trash' onClick={()=>setShowForm(false)}><FaTrashAlt size={17}/></div>
            <div className='split_trash'><FaCheckCircle size={17} onClick={()=>splitHandler()}/></div>
            </div>
            </div>
           :null}
        </div>
    )
}

export default PartsList;