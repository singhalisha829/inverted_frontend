import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Head from "next/head";
import Header from "../components/header";

const PurchaseOrder =() =>{
    const [token,setToken]= useState(null);

    useEffect(()=>{
        if(localStorage.getItem('token') != undefined){
            localStorage.setItem('selected_item','orders')
            const token=localStorage.getItem('token')
            setToken(token)
          
        }else{
            Router.push('/login');
          }
    },[])

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
      console.log(size)

    return(
        <div className="layout">
            <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
    {size.width>'600'?<Sidebar /> : <Header />}

    <div className="purchase_order_page">Purchase Order</div>
    </div>
    )
}

export default PurchaseOrder;