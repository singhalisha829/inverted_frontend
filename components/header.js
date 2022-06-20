import { FaBars } from 'react-icons/fa';
import Logo from "../public/logo.png";
import { useState } from 'react';
import Backdrop from './backdrop';
import {FaDropbox ,FaTh,FaSignOutAlt} from 'react-icons/fa';
import Router from 'next/router';

import Image from 'next/image';

const Header = () =>{
    const [openNavbar, setOpenNavbar]= useState(false)
    return(
    <div className="mobile_header">
        <div className='hamburger'><FaBars size={25} color="#29394A" onClick={()=>setOpenNavbar(!openNavbar)}/></div>
        <div className='inverted_logo'><Image src={Logo} layout="responsive" /></div>
        {openNavbar?<div className='mobile_navbar'>
            <div className='navbar_items' style={{width:'11rem'}}
            onClick={()=>{Router.push('/');setOpenNavbar(false)}}><FaTh /> Dashboard </div>
            <div className='navbar_items' style={{width:'8rem'}}
            onClick={()=>{Router.push('/order');setOpenNavbar(false)}}><FaDropbox /> Orders </div>
            <div className='navbar_items' style={{width:'8.5rem',position:'fixed',bottom:'2rem'}}
            onClick={()=>{Router.push('/login');setOpenNavbar(false);localStorage.clear()}}><FaSignOutAlt /> Logout </div>
        </div>:null}
    </div>
    )
}

export default Header;