import { FaBars } from 'react-icons/fa';
import Logo from "../public/logo.png";
import { useState,useRef ,useEffect} from 'react';

import {FaDropbox ,FaTh,FaSignOutAlt} from 'react-icons/fa';
import Router from 'next/router';


import Image from 'next/image';


const Header = () =>{
    const [openNavbar, setOpenNavbar]= useState(false);
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
            onClick={()=>{Router.push('/');setOpenNavbar(false)}}><FaTh /> Dashboard </div>
            <div className='navbar_items' style={{width:'8rem'}}
            onClick={()=>{Router.push('/order');setOpenNavbar(false)}}><FaDropbox /> Orders </div>
            <div className='navbar_items' style={{width:'8.5rem',position:'fixed',bottom:'2rem'}}
            onClick={()=>{Router.push('/login');setOpenNavbar(false);localStorage.clear()}}><FaSignOutAlt /> Logout </div>
        </div>
        
      </div> :null} 
    </div>
    )
}

export default Header;