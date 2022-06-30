import { FaBars } from 'react-icons/fa';
import Logo from "../public/logo.png";
import { useState,useRef ,useEffect} from 'react';

import {FaDropbox ,FaTh,FaSignOutAlt, FaAngleDown, FaAngleUp,FaShoppingCart} from 'react-icons/fa';
import {IoConstruct} from 'react-icons/io5';

import Router from 'next/router';


import Image from 'next/image';


const Header = () =>{
    const [openNavbar, setOpenNavbar]= useState(false);
    const [showSubOptions,setShowSubOptions] = useState(false);

    const wrapperRef = useRef();
  useOutsideAlerter(wrapperRef);

    function useOutsideAlerter(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setOpenNavbar(false);
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
        <div className='hamburger'><FaBars size={25} color="#29394A" onClick={()=>setOpenNavbar(!openNavbar)}/></div>
        <div className='inverted_logo'><Image src={Logo} layout="responsive" /></div>
    </div>

    {openNavbar?<div className='nav_wrapper' >    
    <div className='mobile_navbar' ref={wrapperRef}>
            <div className='navbar_items' style={{width:'11rem'}}
            onClick={()=>{Router.push('/');setOpenNavbar(false)}}><FaTh /><div style={{marginLeft:'1rem'}}> Dashboard </div></div>
            <div className='navbar_items' 
            onClick={()=>{setShowSubOptions(!showSubOptions)}}><FaDropbox /> <div style={{marginLeft:'1rem'}}>Orders</div>
            <div className='suboption_icon'>{showSubOptions?<FaAngleUp/>:<FaAngleDown/>}</div> </div>

            {showSubOptions?<div className='header_suboptions'>
              <div className='header_suboptions_items' onClick={()=>{Router.push('/order');setOpenNavbar(false)}}><div style={{marginRight:'1rem'}}><IoConstruct/></div>Production</div>
              <div className='header_suboptions_items' onClick={()=>{Router.push('/purchaseOrder');setOpenNavbar(false)}}><div style={{marginRight:'1rem'}}><FaShoppingCart/></div>Purchase</div>
            </div>:null}

            <div className='navbar_items' style={{width:'8.5rem',position:'fixed',bottom:'2rem'}}
            onClick={()=>{Router.push('/login');setOpenNavbar(false);localStorage.clear()}}><FaSignOutAlt /> Logout </div>
        </div>
        
      </div> :null} 
    </div>
    )
}

export default Header;