import {useState, useEffect, useRef} from "react";

import {BsPlusCircle } from 'react-icons/bs';
import { FaSistrix  } from 'react-icons/fa';
import Modal from "./modal";

import { addNewPart } from "../services/dashboardService";


const Dropdown= (props) =>{

    
    const wrapperRef = useRef();
  useOutsideAlerter(wrapperRef);
    const [isDropdownOpen, setIsDropdownOpen]= useState(false)
    const [showModal, setShowModal]= useState(false);
    const [partType, setPartType] = useState(null);
    const [partName, setPartName] = useState(null);
    const [partDesc, setPartDesc]= useState(null);
    const [value, setValue] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [listTopMargin,setListTopMargin] = useState('0');

    const [data,setData] = useState(props.options);
    const [dataFilter, setDataFilter] = useState([]);

    
    useEffect(()=>{
      if(props.isAddNewPart){
        setListTopMargin('4rem')
      }
    },[props.isAddNewPart])

    // search in dropdown list
    useEffect(()=>{
        if(searchText != undefined){
          // console.log(searchText)
          // console.log(data)
            const filterData = data.filter(o => Object.keys(o).some(
              k => String(o[k]).toLowerCase().includes(searchText.toLowerCase()))
            );
            setDataFilter([...filterData])
          }else{
            setData([...data])
            setDataFilter([...data])
          }
          // console.log(dataFilter)
    },[searchText])

    useEffect(()=>{
      // console.log(props.value)
        if(props.value==='' ){
            setValue(()=>"")
        }
    },[props.value])


    let content=null;
    let add_part=null;
    

    function useOutsideAlerter(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setIsDropdownOpen(false)
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }
    

    const submitPartHandler = () =>{  
        console.log(partType,partName,partDesc)
        setShowModal(false)
        addNewPart(partType,partName,partDesc).then(res=>window.location.reload())
        setPartName(()=>"");
        setPartType(()=>"");
        setPartDesc(()=>"");
    }

    const cancelPartHandler = () =>{
        setShowModal(false);
        setPartName(()=>"");
        setPartType(()=>"");
        setPartDesc(()=>"");
    }
    if(props.isAddNewPart){
      // setListTopMargin('8rem')
        add_part=(<div className="add_part"
        onClick={()=> {setShowModal(true);
        setIsDropdownOpen(false)}}><BsPlusCircle fontWeight={900} size={17}/> <div style={{marginLeft:'0.5rem'}}> Add Part</div></div>)
    }


    if(isDropdownOpen){
      // console.log(props.name)
        content=(
            <div className="dropdown_options1" style={{width:props.dropdownWidth}}>
            {add_part}
            <div className="some">
            <div className="dropdown_input"><input style={{height:"3rem",marginRight:'5px',width:props.searchWidth}} onChange={(e)=>setSearchText(e.target.value)} placeholder="Search.."/>  
            <div style={{marginTop:'0.5vw'}}><FaSistrix size={17} color="#3F5575"/></div></div></div>
        <div style={{marginTop:listTopMargin}}>
        {searchText !== null? dataFilter.map((option)=>(
                 <div className="option" key={option.id}    
                 onClick={()=>{ props.parentCallback(option); 
                setIsDropdownOpen(false); setValue(option[props.name])}}>{option[props.name]}</div>
             )):
             props.options.map((option)=>(
                <div className="option" key={option.id}
                onClick={()=>{ props.parentCallback(option);
               setIsDropdownOpen(false); setValue(option[props.name])}}>{option[props.name]}</div>
            ))}</div>
        </div>
        
        );
    }
    return(
        <div ref={wrapperRef} className="custom_dropdown" style={{width:props.width, height:props.height,minWidth:props.minWidth, border:props.border?"#e5e5e5 solid 0.1em":null}} >
           <div className="control" onClick={()=>setIsDropdownOpen(!isDropdownOpen)} >
           <input className={props.no_outline?"selected_value_without_outline":"selected_value"} placeholder={props.placeholder} value={value} style={{margin:"0",height:'2.7rem'}}/>
           
           {/* <div style={{position:'relative',right:'10px'}}><FaSistrix /></div> */}
           </div>
           <div style={{position:'relative'}}>
               {content}
               </div>
           <Modal show={showModal} modalClosed={()=> setShowModal(false)}>
            <div style={{color:"#6B6B6B", padding:'2rem',paddingBottom:'4rem',fontFamily: 'Inter',fontStyle: "normal",fontWeight: "600",
            fontSize: "16px",lineHeight: "19px"}}>Add Part</div>
            <div className="add_part_form">
              {props.partTypeList?<Dropdown options={props.partTypeList} placeholder='Select Part Type' name="name" width="70%" border={true}
            parentCallback={(data)=>setPartType(data.id)}/> : null}
            
            
                <input name="part_name" onChange={(e)=>setPartName(e.target.value)} value={partName} placeholder="Part Name" className="modal_input"/>
            <textarea name="part_desc" className="modal_textarea" value={partDesc} placeholder="Description" onChange={(e)=>setPartDesc(e.target.value)}/>
            <hr className="modal_hr"/>
            <div className="add_parts_button">
                <button style={{backgroundColor:"white", color:"#ACB3BF",border:"#ACB3BF solid 0.15em",
                marginRight:'1rem'}} className="button2"
                onClick={cancelPartHandler}>Cancel</button>
                <button style={{backgroundColor:"#33B850"}} className="button2"
                onClick={submitPartHandler}>Save</button>
            </div></div>
        </Modal>
        </div>
    )
}
export default Dropdown;