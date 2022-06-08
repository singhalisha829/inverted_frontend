import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import { useEffect } from 'react';

import Logo from '../public/logo.png';
import Logo_inverted from '../public/Logo_inverted.png';

import {FaDropbox ,FaTh,FaSignOutAlt} from 'react-icons/fa';
import { useState } from 'react';

const Sidebar = () =>{
    const SidebarData= [
        {
            title: 'Dashboard',
            path:'/',
            cName:"nav_text",
            icon: <FaTh />
        },
        {
            title: 'Orders',
            path:'/login',
            cName:"nav_text",
            icon:<FaDropbox />
        },
        
    ];

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
    
    
    
    return(
        <div>{size.width>'1000'?
        <div className="navbar" >
                <div style={{width:'16.66vw',display:'flex',justifyContent:'center'}}>
                  <div className='navbar_img'><Image src={Logo} layout="responsive" />
                  </div>
                  </div>
                        <div className='nav_list'>
                            <div title='Dashboard' style={{marginLeft:"20%"}} className='nav_items' onClick={()=>Router.push('/')}><FaTh /><div style={{marginLeft:"2rem"}}>Dashboard</div></div>
                            <div title='Orders' style={{marginLeft:"20%"}} className='nav_items' onClick={()=>{Router.push('/order')}}><FaDropbox /><div style={{marginLeft:'2rem'}}>Orders</div></div>
                        </div>
                        <div>
    </div>
    
                        <div title='Logout' className='logout_link' style={{marginLeft:'4%'}} onClick={()=>{localStorage.clear();Router.push('/login')}}>
                           <FaSignOutAlt/> <div style={{marginLeft:'2rem'}}>Logout</div></div>
                        
                </div>:
                <div className="navbar" >
                <div style={{width:'16.66vw',display:'flex',justifyContent:'center'}}><div className='navbar_img1'><Image src={Logo_inverted} layout="fill" /></div></div>
                        <div className='nav_list'>
                            <div title='Dashboard' className='nav_items' onClick={()=>Router.push('/')}><div className='sidebar_icon'><FaTh /></div></div>
                            <div title='Orders'className='nav_items' onClick={()=>{Router.push('/order')}}><div className='sidebar_icon'><FaDropbox /></div></div>
                        </div>
                        <div>
    </div>
    
                        <div title="Logout" className='logout_link' style={{justifyContent:"center"}} onClick={()=>{localStorage.clear();Router.push('/login')}}>
                            <FaSignOutAlt /></div>
                        
                </div>}
                </div>
    )

}

export default Sidebar;