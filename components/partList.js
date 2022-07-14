import { useEffect, useState } from 'react';

import { fetchVendorList } from '../services/ledgerService';
import Dropdown from './dropdown';

const PartsList = (props) =>{
    const [vendorList, setvendorList] = useState(null);
    const [vendor,setVendor]= useState(null);

    useEffect(()=>{
        const token= localStorage.getItem('token')
        fetchVendorList(token).then(res=>setvendorList(res.data))
    },[])
    
    
    return(
        <div className="stock_out_list">
        <div style={{width:"20%"}}>{props.partId}</div>

           <div  style={{width:"20%"}}>{props.partName}</div>
           <div  style={{width:"20%"}}>{props.quantity} {props.unit}</div>
           <div style={{width:'20%'}}><input type="number" style={{height:'3rem',width:'70%'}} onChange={(e)=>props.handleUnitPrice(props.id,e.target.value,props.quantity,props.unit)}/></div>
        <div style={{width:'20%'}}>
        {vendorList?<Dropdown  placeholder='Select Vendor' name="name" options={vendorList} height="3rem" value={vendor} width="70%"
            parentCallback={(data)=>{setVendor(data.id);props.handleVendor(props.id,data.id,props.quantity,props.unit)}} border={true} dropdownWidth="15vw" searchWidth="12vw"/>:null}
            </div>
        
        </div>
    )
}

export default PartsList;