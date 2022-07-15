import { useEffect, useState } from 'react';

import { fetchVendorList } from '../services/ledgerService';
import Dropdown from './dropdown';
import { GoRepoForked} from 'react-icons/go';
import { FaTrashAlt } from 'react-icons/fa';

const PartsList = (props) =>{
    const [vendorList, setvendorList] = useState(null);
    const [vendor,setVendor]= useState(null);
    const [split,setSplit]= useState([]);
    const [quantity,setquantity]= useState([{quantity:props.quantity,id:1}]);
    const [lastId,setLastId]= useState(1);

    useEffect(()=>{
        const token= localStorage.getItem('token')
        fetchVendorList(token).then(res=>setvendorList(res.data))
    },[])

    const expand =() =>{
        const index= Math.floor(Math.random()*100);
        const newList=[...split,{id:index,quantity:0}]
        setSplit(newList)
    }

    console.log(quantity)
    console.log(props.quantity)

    const condense =(id)=>{
        console.log(id)
        const newList= split.filter(l=>l.id!=id);
        setSplit(newList)
        
    }
    
    const handleQuantity=(value,id)=>{
        const newVal=quantity[-1].quantity-value;
        setquantity(current=>
            current.map(obj=>{
                if(obj.id==id){
                return {...obj,quantity:newVal}
                }}))
        console.log(quantity)
            
    }

    
    return(
        <div className="po_list_form">
            <div style={{display:'flex',width:'100%',alignItems:'center'}}>
        <div style={{width:"20%"}} className="vendor_header">{props.partId}</div>

           <div  style={{width:"23%"}} className="vendor_header">{props.partName}</div>
           <div style={{width:'2%'}} className="split"><GoRepoForked size={20}  style = {{transform: 'rotate(90deg)'}} onClick={expand}/></div>
           
           <div  style={{width:"25%"}} className="vendor_header"> <div style={{marginLeft:'2vw'}}>{props.unit}</div></div>
           
           <div style={{width:'15%'}} className="vendor_header"><input type="number" style={{height:'3rem',width:'70%'}} onChange={(e)=>props.handleUnitPrice(props.id,e.target.value,props.quantity,props.unit)}/></div>
        <div style={{width:'15%'}} className="vendor_header">
        {vendorList?<Dropdown  placeholder='Select Vendor' name="name" options={vendorList} height="3rem" value={vendor} width="70%"
            parentCallback={(data)=>{setVendor(data.id);props.handleVendor(props.id,data.id,props.quantity,props.unit)}} border={true} dropdownWidth="15vw" searchWidth="12vw"/>:null}
            </div>
        
        </div>
        {split.map((branch)=>(
            <div key={branch.id} style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>{branch.id}
            <div className='split_row'>
                <div style={{width:'47.5%',display:'flex'}}>
                <div style={{width:'40%'}}><input type="number" style={{height:'3rem',width:'90%'}} onChange={(e)=>handleQuantity(e.target.value,branch.id)}/></div>
                <div style={{width:'60%'}}><input type="number" style={{height:'3rem',width:'70%'}}/></div></div>
                <div style={{width:'28%'}}><input type="number" style={{height:'3rem',width:'70%'}}/></div>
                <div style={{width:'22%'}}>{vendorList?<Dropdown  placeholder='Select Vendor' name="name" options={vendorList} height="3rem" value={vendor} width="90%"
            parentCallback={(data)=>{setVendor(data.id);props.handleVendor(props.id,data.id,props.quantity,props.unit)}} border={true} dropdownWidth="15vw" searchWidth="12vw"/>:null}</div>
            <div className='split_trash' onClick={()=>condense(branch.id)}><FaTrashAlt size={14}/></div>
            </div>
            </div>
           ))}
        </div>
    )
}

export default PartsList;