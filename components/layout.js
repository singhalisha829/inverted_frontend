import React from 'react';
import Sidebar from '../components/sidebar';
import { useState, useEffect } from 'react';
import Header from '../components/header';
import { useRouter } from 'next/router';




const Layout = ({ children }) => {
    const router = useRouter();
  const currentUrl = router.asPath;

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

  return (
    <div>{currentUrl != '/login'?<div className="layout">
           {size.width>'600'?<Sidebar />:<Header />}
        {children}
    </div>:<div>{children}</div>}</div>
  );
};

export default Layout;
