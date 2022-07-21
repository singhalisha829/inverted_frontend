import { useEffect, useState } from 'react';

import { fetchVendorList,fetchUnitList } from '../services/ledgerService';
import { unitConversion } from '../services/purchaseOrderService';
import Dropdown from './dropdown';
import { GoRepoForked} from 'react-icons/go';
import { FaTrashAlt, FaCheckCircle } from 'react-icons/fa';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const PartsList = (props) =>{
    const [vendorList, setvendorList] = useState(null);
    const [vendor,setVendor]= useState(null);
    const [quantity,setquantity]= useState([{quantity:props.quantity,id:1,unit:props.unit}]);
    const [lastId,setLastId]= useState(1);
    const [currentVal,setCurrentVal]= useState(props.quantity)
    const [value,setValue]= useState(null);
    const [unitList,setUnitList]= useState([]);
    const [unit,setUnit]= useState(null);
    const [previousState,setPreviousState]= useState({quantity:props.quantity,id:1,unit:props.unit});
    const [token,setToken]= useState(null);
    const [factor,setFactor]= useState(null);

    // const [splitBranch,setSplitBranch]= useState([]);
    const [lastBranch,setLastBranch]= useState(null);
    const [showForm,setShowForm]= useState(false);
    const [quantityBorder,setQuantityBorder]= useState(' #e5e5e5 solid 0.1em');

    // const quantityBorder=' #e5e5e5 solid 0.1em';



    useEffect(()=>{
        const token= localStorage.getItem('token')
        setToken(token)
        fetchVendorList(token).then(res=>setvendorList(res.data))
        fetchUnitList(token).then(res=>setUnitList(res.data))
    },[])

    // useEffect(()=>{
    //     if(quantity.length===0){
    //         props.emptyVendorList();
    //     }
    // },[quantity])

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
        const newVal=null;
        const length= quantity.length;
        if(props.unit != symbol){
            newVal=previousState.quantity;
            unitConversion(token,props.unit,symbol).then(res=>{
                if(res.data.status.code==404){
                    toast.warning(res.data.status.description);
                    setUnit(()=>'');
                    setValue(()=>'')
                    
                }else{
                    console.log(res.data)
                    const factor=res.data.output[0].entered_base_conversion_factor;
                    setFactor(factor);
                    newVal=parseFloat(((previousState.quantity*factor - value)/factor).toFixed(2));
                    console.log(newVal,typeof newVal);
                    updateQuantity(newVal,length)
                }
            })
        }else{
        newVal= previousState.quantity-value;
        }

        if(newVal<0){
            setValue('');
            setUnit(()=>'');
            setCurrentVal(newVal);
        }else{
            console.log(newVal)
            newVal= parseInt(newVal) != newVal?parseFloat(parseFloat(newVal).toFixed(2)):newVal;
            quantity[length-1].quantity= newVal;
        props.handleQuantity(props.id,quantity[length-1])
    setCurrentVal(newVal)

         
    } 
    }

    const updateQuantity=(value,length)=>{
        if(value<0){
            setValue('');
            setUnit(()=>'');
            setCurrentVal(value);
        }else{
            quantity[length-1].quantity= value;
        props.handleQuantity(props.id,quantity[length-1])
    setCurrentVal(value)

         
    } 
    }



    const splitHandler=() =>{
        const newList1=null;
        const length= quantity.length
        if(quantity[length-1].quantity<=0){
            return;
        }else if(unit === null || unit===''){
            return;
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
        setPreviousState(newList1[length1-1])
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
// console.log(quantity)

const deleteBranch=(id)=>{
    const newList=quantity;
    const index= newList.findIndex(el=>el.id === id)
    
    if(index===0){
    if(newList[index].unit===newList[index+1].unit){
    newList[index+1].quantity+= quantity[index].quantity;
    }else{
        const newVal=newList[index+1].quantity/factor+quantity[index].quantity;
        newVal=parseInt(newVal) != newVal?parseFloat(newVal.toFixed(2)):newVal;
        newList[index+1].quantity= newVal;
    }
    props.handleQuantity(props.id,newList[index+1])
    setPreviousState(newList[index+1])
    }else{
        if(newList[index].unit===newList[index-1].unit){
    newList[index-1].quantity+= quantity[index].quantity;
        }
        else{
            const newVal=quantity[index].quantity/factor;
            newVal=parseInt(newVal) != newVal?parseFloat(newVal.toFixed(2)):newVal;
            newList[index-1].quantity+= newVal;
            
        }
        props.handleQuantity(props.id,newList[index-1])
    setPreviousState(newList[index-1])
    }
    newList= quantity.filter((el)=>el.id !=id);
    setquantity(newList)
    props.deleteBranch(id,props.id);
    

}

    

    
    return(
        <div className="po_list_form">
            <ToastContainer />
            <div className='po_list_form_rows'>
        <div style={{width:"10%"}} className="vendor_header">{props.partId}</div>

           <div  style={{width:"30%"}} className="vendor_header">{props.partName}</div>
           <div style={{width:'5%'}} className="split"><GoRepoForked size={20}  style = {{transform: 'rotate(90deg)'}} onClick={()=>setShowForm(true)}/></div>
           
           <div  style={{width:"15%",display:'flex',flexDirection:'column',alignItems:'center'}} className="vendor_header">
            {quantity.map((branch)=>(<div key={branch.id} style={{display:'flex'}} className="gap">
            {branch.quantity} <div style={{marginLeft:'2vw'}}>{branch.unit}</div></div>))}</div>
           
           <div style={{width:'15%',display:'flex',flexDirection:'column',alignItems:'center'}} className="vendor_header">
            {quantity.map((branch)=>(<div key={branch.id}  className="gap"><input type="number" style={{height:'3rem',width:'70%'}} onChange={(e)=>
                props.handleUnitPrice(props.id,e.target.value,branch.id,quantity,props.partName)}/></div>))}</div>

        <div style={{width:'20%',display:'flex',flexDirection:'column',alignItems:'center'}} >
        {quantity.map((branch)=>(<div key={branch.id}  className="gap">{vendorList?<Dropdown  placeholder='Select Vendor' name="name" options={vendorList} height="3rem" value={vendor} width="70%"
            parentCallback={(data)=>{
                setVendor(data.id);props.handleVendor(props.id,data.id,branch.id,quantity,props.partName)}} 
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
                {/* <div style={{width:'30%',display:'flex'}}> */}
                <div style={{width:'30%',display:'flex',justifyContent:'end'}}><input type="number" style={{height:'3rem',width:'90%',border:quantityBorder}} onChange={(e)=>setValue(e.target.value)}
             value={value}/></div>
                <div style={{width:'30%',display:'flex',justifyContent:'end'}}>
                    <Dropdown width="90%" placeholder='Select Unit' options={unitList} name="name" dropdownWidth={size.width>'600'?'11vw':'27vw'} searchWidth={size.width>'600'?'8vw':'19vw'} height="3rem"
                    parentCallback={(data)=>{setUnit(data.symbol);handleUnit(data.symbol)}} border={true} value={unit}/>
                </div>
                {/* </div> */}
            <div className='split_trash'><FaCheckCircle size={17} onClick={()=>splitHandler()}/></div>
                
            <div className='split_trash' onClick={closeSplit}><FaTrashAlt size={17}/></div>
            </div>
            </div>
           :null}
        </div>
    )
}

export default PartsList;