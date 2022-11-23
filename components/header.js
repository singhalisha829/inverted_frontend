import { FaBars } from 'react-icons/fa';
import Logo from "../public/logo.png";
import { useState,useRef ,useEffect} from 'react';

import {FaTh,FaSignOutAlt,FaShoppingCart,FaAngleLeft} from 'react-icons/fa';
import {IoConstruct} from 'react-icons/io5';

import Router from 'next/router';


import Image from 'next/image';



const Header = (props) =>{
    const [openNavbar, setOpenNavbar]= useState(false);

    const wrapperRef = useRef();
  useOutsideAlerter(wrapperRef);

    function useOutsideAlerter(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setOpenNavbar(false);
              setShowSubOptions(false)
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }

    return(
        <div>
    <div className="mobile_header" >
      <div style={{display:'flex'}}>
        {props.show?<div style={{marginRight:'1rem'}}><FaAngleLeft size={25} color="#29394A" onClick={()=>Router.back()}/></div>:null}
        <div className='hamburger'><FaBars size={25} color="#29394A" onClick={()=>setOpenNavbar(!openNavbar)}/></div></div>
        <div className='inverted_logo'><Image src={Logo} layout="responsive" alt="" /></div>
    </div>

    {openNavbar?<div className='nav_wrapper' >    
    <div className='mobile_navbar' ref={wrapperRef}>
            <div className='navbar_items' style={{width:'11rem'}}
            onClick={()=>{Router.push('/');setOpenNavbar(false)}}><FaTh /><div style={{marginLeft:'1rem'}}> Dashboard </div></div>
            {/* <div className='navbar_items' 
            onClick={()=>{Router.push('/purchaseOrder');setOpenNavbar(false)}}><FaShoppingCart /> <div style={{marginLeft:'1rem'}}>Purchase Orders</div>
             </div> */}

             <div className='navbar_items' 
            onClick={()=>{Router.push('/order');setOpenNavbar(false)}}><IoConstruct /> <div style={{marginLeft:'1rem'}}>Production Orders</div>
             </div>

            

            <div className='navbar_items' style={{width:'8.5rem',position:'fixed',bottom:'2rem'}}
            onClick={()=>{Router.push('/login');setOpenNavbar(false);localStorage.clear()}}><FaSignOutAlt /> Logout </div>
        </div>
        
      </div> :null} 
    </div>
    )
}

export default Header;