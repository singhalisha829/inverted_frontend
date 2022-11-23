import Image from 'next/image';
import Router from 'next/router';
import { useEffect } from 'react';

import Logo from '../public/logo.png';
import Logo_inverted from '../public/Logo_inverted.png';

import {FaTh,FaSignOutAlt, FaShoppingCart} from 'react-icons/fa';
import {IoConstruct} from 'react-icons/io5';
import { useState } from 'react';

const Sidebar = () =>{

    const [selectedDiv, setSelectedDiv]= useState('dashboard');


    // calculate screen size
    function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
      
        useEffect(() => {
          setSelectedDiv(localStorage.getItem('selected_item'))
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

    // set the selected sidebar value to dashboard locally
    const setDashboard=()=>{
      localStorage.setItem('selected_item','dashboard');
    }

    // set the selected sidebar value to purchase orders locally
    const setPurchaseOrders=()=>{
      localStorage.setItem('selected_item','purchase_orders')
    }

    // set the selected sidebar value to production orders locally
    const setProductionOrders=()=>{
      localStorage.setItem('selected_item','production_orders')
    }
    
    
    return(
        <div>
          {/* if the width of screen is greater than 1000px */}
          {size.width>'1200'?
        <div className="navbar" >
                <div style={{width:'16.66vw',display:'flex',justifyContent:'logo_center'}}>
                  <div className='navbar_img'><Image src={Logo} layout="responsive" alt="" />
                  </div>
                  </div>
                        <div className='nav_list'>
                            {selectedDiv==='dashboard'?<div title='Dashboard' className='selected_items' onClick={()=>{Router.push('/');
                          setDashboard()}}><div className='strip'/><div className='center'><FaTh /><div style={{marginLeft:"1.3rem"}}>Dashboard</div></div></div>
                          :
                          <div title='Dashboard' className='nav_items' onClick={()=>{Router.push('/');
                          setDashboard()}}><div className='empty_strip'/><div className='center'><FaTh /><div style={{marginLeft:"1.3rem"}}>Dashboard</div></div></div>}

                          {/* {selectedDiv==='purchase_orders'?
                            <div title='Purchase Orders' className='selected_items' onClick={()=>{Router.push('/purchaseOrder')
                          setPurchaseOrders()}}><div className='strip'/><div className='center'><FaShoppingCart /><div style={{marginLeft:'1.3rem'}}>Purchase Orders
                          </div></div></div>
                          :
                          <div title='Purchase Orders' className='nav_items' onClick={()=>{Router.push('/purchaseOrder');
                          setPurchaseOrders()}}><div className='empty_strip'/><div className='center'><FaShoppingCart /><div style={{marginLeft:'1.3rem'}}>Purchase Orders
                          </div></div></div>} */}

                          {selectedDiv==='production_orders'?
                            <div title='Production Orders' className='selected_items' onClick={()=>{Router.push('/order')
                          setPurchaseOrders()}}><div className='strip'/><div className='center'><IoConstruct /><div style={{marginLeft:'1.3rem'}}>Production Orders
                          </div></div></div>
                          :
                          <div title='Production Orders' className='nav_items' onClick={()=>{Router.push('/order');
                          setPurchaseOrders()}}><div className='empty_strip'/><div className='center'><IoConstruct /><div style={{marginLeft:'1.3rem'}}>Production Orders
                          </div></div></div>}
                          
                        </div>
                        <div>
    </div>
    
                        <div title='Logout' className='logout_link' style={{marginLeft:'2.2%'}} onClick={()=>{localStorage.clear();Router.push('/login')}}>
                           <FaSignOutAlt/> <div style={{marginLeft:'1.3rem'}}>Logout</div></div>
                        
                </div>:
                <div className="navbar" >
                <div style={{width:'16.66vw',display:'flex',justifyContent:'center'}}><div className='navbar_img1'><Image src={Logo_inverted} layout="fill" alt="" /></div></div>
                        <div className='nav_list'>
                          {selectedDiv === 'dashboard'?
                            <div title='Dashboard' className='selected_items' onClick={()=>{Router.push('/');
                          setDashboard()}}><div className='strip'/><div className='center1'><FaTh /></div></div>
                        :
                        <div title='Dashboard' className='nav_items' onClick={()=>{Router.push('/');
                        setDashboard()}}><div className='empty_strip'/><div className='center1'><FaTh /></div></div>}

                          {/* {selectedDiv==='purchase_orders'?
                          <div title='Purchase Orders' className='selected_items' onClick={()=>{Router.push('/purchaseOrder');
                          setPurchaseOrders()}}><div className='strip'/><div className='center1'><FaShoppingCart /></div></div>
                        :
                        <div title='Purchase Orders' className='nav_items' onClick={()=>{Router.push('/purchaseOrder');
                          setPurchaseOrders()}}><div className='empty_strip'/><div className='center1'><FaShoppingCart />
                          </div></div>} */}

                          {selectedDiv==='production_orders'?
                          <div title="Production Orders" className='selected_items' onClick={()=>{Router.push('/order');
                          setProductionOrders()}}><div className='strip'/><div className='center1'><IoConstruct /></div></div>
                        :
                        <div title="Production Orders" className='nav_items' onClick={()=>{Router.push('/order')
                          setProductionOrders()}}><div className='empty_strip'/><div className='center1'><IoConstruct />
                          </div></div>}
                          
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