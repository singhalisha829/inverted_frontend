import { FaBars } from 'react-icons/fa';
import Logo from "../public/logo.png";
import { useState } from 'react';

import Image from 'next/image';

const Header = () =>{
    const [openNavbar, setOpenNavbar]= useState(false)
    return(
    <div className="mobile_header">
        <div className='hamburger'><FaBars size={25} color="#29394A" onClick={()=>setOpenNavbar(!openNavbar)}/></div>
        <div className='inverted_logo'><Image src={Logo} layout="responsive" /></div>
        {openNavbar?<div className='mobile_navbar'>heyy</div>:null}
    </div>
    )
}

export default Header;