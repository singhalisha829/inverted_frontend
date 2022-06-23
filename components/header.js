import { FaBars } from 'react-icons/fa';
import Logo from "../public/logo.png";
import { useState } from 'react';
import Backdrop from './backdrop';
import {FaDropbox ,FaTh,FaSignOutAlt} from 'react-icons/fa';
import Router from 'next/router';
import Modal from './modal';

import Image from 'next/image';


const Header = () =>{
    const [openNavbar, setOpenNavbar]= useState(false)
    return(
        <div>
    {openNavbar===false?<div className="mobile_header" >
        <div className='hamburger'><FaBars size={25} color="#29394A" onClick={()=>setOpenNavbar(!openNavbar)}/></div>
        <div className='inverted_logo'><Image src={Logo} layout="responsive" /></div>
    </div>:null}
        <Backdrop show={openNavbar} clicked={()=>setOpenNavbar(false)}/>
        
    <div className='mobile_navbar'
    style={{
        opacity: openNavbar ? '1' : '0'
    }}>
        <div style={{width:'15rem',marginBottom:'3rem'}}><Image src={Logo} layout="responsive"/></div>
            <div className='navbar_items' style={{width:'11rem'}}
            onClick={()=>{Router.push('/');setOpenNavbar(false)}}><FaTh /> Dashboard </div>
            <div className='navbar_items' style={{width:'8rem'}}
            onClick={()=>{Router.push('/order');setOpenNavbar(false)}}><FaDropbox /> Orders </div>
            <div className='navbar_items' style={{width:'8.5rem',position:'fixed',bottom:'2rem'}}
            onClick={()=>{Router.push('/login');setOpenNavbar(false);localStorage.clear()}}><FaSignOutAlt /> Logout </div>
        </div>
        
        
    </div>
    )
}

export default Header;