import { useEffect, useState } from 'react';

import { fetchVendorList,fetchUnitList } from '../services/ledgerService';
import { unitConversion } from '../services/purchaseOrderService';
import Dropdown from './dropdown';
import { GoRepoForked} from 'react-icons/go';
import { FaTrashAlt, FaCheckCircle } from 'react-icons/fa';

import {toast} from 'react-toastify';




const PartsList = (props) =>{
    const [vendorList, setvendorList] = useState(null);
    const [vendor,setVendor]= useState(null);
    const [quantity,setquantity]= useState([{quantity:props.quantity,id:1,unit:props.unit}]);
    const [lastId,setLastId]= useState(1);
    const [currentVal,setCurrentVal]= useState(props.quantity)
    const [value,setValue]= useState(null);
    const [unitList,setUnitList]= useState([]);
    const [unit,setUnit]= useState(null);

    const [token,setToken]= useState(null);
    const [factor,setFactor]= useState(null);

    const [lastBranch,setLastBranch]= useState(null);
    const [showForm,setShowForm]= useState(false);

   
   



    useEffect(()=>{
        const token= localStorage.getItem('token')
        setToken(token)
        fetchVendorList(token).then(res=>setvendorList(res.data))
        fetchUnitList(token).then(res=>setUnitList(res.data))
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


    const handleUnit=(symbol)=>{
        if(value=== null || value ===''){
            toast.warning('Enter Quantity!');
            // setUnit(()=>'')
        }else{
        const newVal=null;
        const length= quantity.length;
        if(props.unit != symbol){
            newVal=quantity[0].quantity;
            unitConversion(token,props.unit,symbol).then(res=>{
                if(res.data.status.code==404){
                    toast.warning(res.data.status.description);
                    setUnit(()=>'');
                    setValue(()=>'')
                    
                }else{
                    console.log(res.data)
                    const factor=res.data.output[0].conversion_factor;
                    newVal=parseFloat((quantity[0].quantity-value*factor).toFixed(2)); 
                    updateQuantity(newVal,length)
                    setFactor(factor);

                }
            })
        }else{
        newVal= quantity[0].quantity-value;
        }

        if(newVal<0){
            setValue('');
            setUnit(()=>'');
            setCurrentVal(newVal);
        }else{
            console.log(newVal)
            newVal= parseInt(newVal) != newVal?parseFloat(parseFloat(newVal).toFixed(2)):newVal;
            quantity[0].quantity= newVal;
        props.handleQuantity(props.id,quantity[length-1])
    setCurrentVal(newVal)

         
    }
    }}

    const updateQuantity=(value)=>{
        if(value<0){
            setValue('');
            setUnit(()=>'');
            setCurrentVal(value);
        }else{
            quantity[0].quantity= value;
        props.handleQuantity(props.id,quantity[0])
    setCurrentVal(value)

         
    } 
    }



    const splitHandler=() =>{
        const newList1=null;
        const length= quantity.length
        if(value== null){
            toast.warning('Enter Quantity!');
        }else if(unit === null || unit===''){
            toast.warning('Enter Unit!');    
        }
        else{
        const new_quantity=value;
        if(parseInt(new_quantity) != new_quantity){
            new_quantity= parseFloat(parseFloat(new_quantity).toFixed(2))
        }else{
            new_quantity= parseInt(new_quantity)
        }
        
        
        newList1=[...quantity,{id:lastId+1,quantity:new_quantity,unit:unit}]
        const length1=newList1.length;
    
        setquantity(newList1)
        setLastBranch(newList1[length1-1].quantity)
        setLastId(lastId+1);
        setShowForm(false);
        setValue('');
        setUnit(()=>'')

    }
    }


const closeSplit=()=>{
    setShowForm(false);
    if(value=== null || value === ''){
        return;
    }
    else{
    const newList=quantity;
    const length=newList.length;
    newList[length-1].quantity += parseInt(value);
    setquantity(newList);
    }
    setValue('')

}


const deleteBranch=(id)=>{
    const newList=quantity;
    const index= newList.findIndex(el=>el.id === id)
    
    if(index===0){
    if(newList[0].unit===newList[1].unit){
    newList[1].quantity+= quantity[0].quantity;
    props.handleQuantity(props.id,newList[1])
    
    newList= quantity.filter((el)=>el.id !=id);
    setquantity(newList)
    props.deleteBranch(id,props.id);
    }else{
        
            unitConversion(token,newList[0].unit,newList[1].unit).then(res=>{
                const factor=res.data.output[0].conversion_factor;
                const newVal=parseFloat((newList[1].quantity*factor + quantity[0].quantity).toFixed(2));
                setFactor(factor);
                    newList[1].quantity= newVal; 
                    newList[1].unit=newList[0].unit;  
                    props.handleQuantity(props.id,newList[1])
                    newList= quantity.filter((el)=>el.id !=id);
    setquantity(newList)
    props.deleteBranch(id,props.id);
            })
    }
    
    }else{
        if(newList[index].unit===newList[0].unit){
    newList[0].quantity+= quantity[index].quantity;
    props.handleQuantity(props.id,newList[0])
    
    newList= quantity.filter((el)=>el.id !=id);
    setquantity(newList)
    props.deleteBranch(id,props.id);
        }
        else{
            
            unitConversion(token,newList[0].unit,newList[index].unit).then(res=>{
            const factor=res.data.output[0].conversion_factor;
                const newVal=parseFloat((newList[0].quantity + quantity[index].quantity*factor).toFixed(2)); 
                setFactor(factor);
                newList[0].quantity= newVal;
            props.handleQuantity(props.id,newList[0])
    
    newList= quantity.filter((el)=>el.id !=id);
    setquantity(newList)
    props.deleteBranch(id,props.id);
            })
        }
        
    }
}
    
    return(
        <div>            
        {/* <ToastContainer/> */}

        <div className="po_list_form">
            <div className='po_list_form_rows'>
        <div style={{width:"10%"}} className="vendor_header">{props.partId}</div>

           <div  style={{width:"30%"}} className="vendor_header">{props.partName}</div>
           <div style={{width:'5%'}} className="split"><GoRepoForked size={20}  style = {{transform: 'rotate(90deg)'}} onClick={()=>setShowForm(true)}/></div>
           
           <div  style={{width:"15%",display:'flex',flexDirection:'column',alignItems:'center'}} className="vendor_header">
            {quantity.map((branch)=>(<div key={branch.id} style={{display:'flex'}} className="gap">
            {branch.quantity} <div style={{marginLeft:'2vw'}}>{branch.unit}</div></div>))}</div>
           
           <div style={{width:'15%',display:'flex',flexDirection:'column',alignItems:'center'}} className="vendor_header">
            {quantity.map((branch)=>(<div key={branch.id}  className="gap"><input type="number" style={{height:'3rem',width:'70%'}} onChange={(e)=>
                props.handleUnitPrice(props.id,e.target.value,branch.id,quantity,props.partName,props.partId)}/></div>))}</div>

        <div style={{width:'20%',display:'flex',flexDirection:'column',alignItems:'center'}} >
        {quantity.map((branch)=>(<div key={branch.id}  className="gap">{vendorList?<Dropdown  placeholder='Select Vendor' name="name" options={vendorList} height="3rem" value={vendor} width="70%"
            parentCallback={(data)=>{
                setVendor(data.id);props.handleVendor(props.id,data.id,branch.id,quantity,props.partName,props.partId)}} 
                border={true} dropdownWidth="15vw" searchWidth="12vw"/>:null}
            </div>))}
            </div>

            <div style={{width:'5%',display:'flex',flexDirection:'column',alignItems:'center'}} > 
        {quantity.map((branch)=>{
            if(quantity.length>1){
                return(
                    <div key={branch.id} className="gap trash"><FaTrashAlt onClick={()=>deleteBranch(branch.id)}/></div>
                )
            }
        })}
        </div>
        
        </div>
        {showForm?
            <div style={{width:'100%',display:'flex',justifyContent:'flex-end',paddingRight:'2rem'}}>
            <div className='split_row'>
               
                <div style={{width:'30%',display:'flex',justifyContent:'end'}}><input type="number" style={{height:'3rem',width:'90%'}} onChange={(e)=>setValue(e.target.value)}
             value={value}/></div>
                <div style={{width:'30%',display:'flex',justifyContent:'end'}}>
                    <Dropdown width="90%" placeholder='Unit' options={unitList} name="name" dropdownWidth={size.width>'600'?'11vw':'27vw'} searchWidth={size.width>'600'?'8vw':'19vw'} height="3rem"
                    parentCallback={(data)=>{setUnit(data.symbol);handleUnit(data.symbol)}} border={true} value={unit}/>
                </div>
            
            <div className='split_icon check'><FaCheckCircle size={17} onClick={()=>splitHandler()}/></div>
                
            <div className='split_icon trash'><FaTrashAlt size={17} onClick={closeSplit}/></div>
            </div>
            </div>
           :null}
        </div></div>
    )
}

export default PartsList;