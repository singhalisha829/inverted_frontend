import { useEffect, useState } from 'react';

import { fetchVendorList,fetchUnitList } from '../services/ledgerService';
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

    // const [splitBranch,setSplitBranch]= useState([]);
    const [lastBranch,setLastBranch]= useState(null);
    const [showForm,setShowForm]= useState(false);



    useEffect(()=>{
        const token= localStorage.getItem('token')
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

    
    const handleQuantity=(value)=>{
        setValue(value)
        const newList= quantity;
        console.log(lastId,quantity)
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
       props.handleQuantity(props.id,newList[lastId-1]);
    }

    const splitHandler=() =>{
        const newList1=null;
        if(quantity[lastId-1].quantity<=0){
            return;
        }else if(unit === null || unit===''){
            return;
        }
        else{
        if(quantity.length==1){
        newList1= [...quantity,{id:lastId+1,quantity:props.quantity-quantity[0].quantity,unit:unit}]
        }else{
        newList1=[...quantity,{id:lastId+1,quantity:lastBranch-quantity[lastId-1].quantity,unit:unit}]
        }
        setquantity(newList1)
        setLastBranch(newList1[lastId].quantity)
        setLastId(lastId+1);
        setShowForm(false);
        setValue('');
        setUnit(()=>'')

    }
    }
// console.log("quantity",quantity)
// console.log("splitBranch",splitBranch)

const closeSplit=()=>{
    setShowForm(false);
    if(value != undefined){
    const newList=quantity;
    newList[lastId-1].quantity += parseInt(value);
    setquantity(newList)
    }
    setValue('')

}

    
    return(
        <div className="po_list_form">
            <ToastContainer />
            <div className='po_list_form_rows'>
        <div style={{width:"10%"}} className="vendor_header">{props.partId}</div>

           <div  style={{width:"23%"}} className="vendor_header">{props.partName}</div>
           <div style={{width:'2%'}} className="split"><GoRepoForked size={20}  style = {{transform: 'rotate(90deg)'}} onClick={()=>setShowForm(true)}/></div>
           
           <div  style={{width:"20%",display:'flex',flexDirection:'column',alignItems:'center'}} className="vendor_header">
            {quantity.map((branch)=>(<div key={branch.id} style={{display:'flex'}} className="gap">
            {branch.quantity} <div style={{marginLeft:'2vw'}}>{branch.unit}</div></div>))}</div>
           
           <div style={{width:'15%',display:'flex',flexDirection:'column',alignItems:'center'}} className="vendor_header">
            {quantity.map((branch)=>(<div key={branch.id}  className="gap"><input type="number" style={{height:'3rem',width:'70%'}} onChange={(e)=>
                props.handleUnitPrice(props.id,e.target.value,branch.id,quantity[branch.id-1].quantity,quantity[branch.id-1].unit)}/></div>))}</div>

        <div style={{width:'30%',paddingLeft:'5vw',display:'flex',flexDirection:'column',alignItems:'center'}} >
        {quantity.map((branch)=>(<div key={branch.id}  className="gap">{vendorList?<Dropdown  placeholder='Select Vendor' name="name" options={vendorList} height="3rem" value={vendor} width="50%"
            parentCallback={(data)=>{
                setVendor(data.id);props.handleVendor(props.id,data.id,branch.id,quantity[branch.id-1].quantity,quantity[branch.id-1].unit)}} border={true} dropdownWidth="15vw" searchWidth="12vw"/>:null}
            </div>))}
            </div>
        
        </div>
        {showForm?
            <div style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
            <div className='split_row'>
                <div style={{width:'30%',display:'flex'}}>
                <div style={{width:'50%',display:'flex',justifyContent:'end'}}><input type="number" style={{height:'3rem',width:'70%'}} onChange={(e)=>e.target.validity.valid?handleQuantity(e.target.value):null} min="1"
                pattern="[0-9]*" value={value}/></div>
                <div style={{width:'50%',display:'flex',justifyContent:'end'}}><Dropdown width="70%" placeholder='Select Unit' options={unitList} name="name" dropdownWidth={size.width>'600'?'11vw':'27vw'} searchWidth={size.width>'600'?'8vw':'19vw'} height="3rem"
                    parentCallback={(data)=>setUnit(data.symbol)} border={true}/>
                </div></div>
                
            <div className='split_trash' onClick={closeSplit}><FaTrashAlt size={17}/></div>
            <div className='split_trash'><FaCheckCircle size={17} onClick={()=>splitHandler()}/></div>
            </div>
            </div>
           :null}
        </div>
    )
}

export default PartsList;