import Image from "next/image";
import Router from "next/router";
import { useEffect } from "react";
import Link from "next/link";

import Logo from "../public/logo.png";
import Logo_inverted from "../public/Logo_inverted.png";

import { FaTh, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import { IoConstruct } from "react-icons/io5";
import { useState } from "react";

const Sidebar = () => {
  const [selectedDiv, setSelectedDiv] = useState("dashboard");

  // calculate screen size
  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      if (typeof window !== "undefined") {
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
    <div>
      {/* if the width of screen is greater than 1000px */}
      {size.width > "1200" ? (
        <div className="navbar">
          <div
            style={{
              width: "16.66vw",
              display: "flex",
              justifyContent: "logo_center",
            }}
          >
            <div className="navbar_img">
              <Image src={Logo} layout="responsive" alt="" />
            </div>
          </div>
          <ul className="nav_list">
            {selectedDiv === "dashboard" ? (
              <li><Link href="/">
                <a
                  title="Dashboard"
                  className="selected_items"
                  onClick={() => {
                    setSelectedDiv('dashboard');
                  }}
                >
                  <div className="strip" />
                  <div className="center">
                    <FaTh />
                    <div style={{ marginLeft: "1.3rem" }}>Dashboard</div>
                  </div>
                </a>
              </Link></li>
            ) : (
              <li><Link href="/">
                <a
                  title="Dashboard"
                  className="nav_items"
                  onClick={() => {
                    setSelectedDiv('dashboard');
                  }}
                >
                  <div className="empty_strip" />
                  <div className="center">
                    <FaTh />
                    <div style={{ marginLeft: "1.3rem" }}>Dashboard</div>
                  </div>
                </a>
              </Link></li>
            )}

            {/* {selectedDiv==='purchase_orders'?
                            <Link href="/purchaseOrder"><a title='Purchase Orders' className='selected_items' onClick={()=>{                          setPurchaseOrders()}}><div className='strip'/><div className='center'><FaShoppingCart /><div style={{marginLeft:'1.3rem'}}>Purchase Orders
                          </div></div></a></Link>
                          :
                          <Link href="/purchaseOrder"><a title='Purchase Orders' className='nav_items' onClick={()=>{
                          setPurchaseOrders()}}><div className='empty_strip'/><div className='center'><FaShoppingCart /><div style={{marginLeft:'1.3rem'}}>Purchase Orders
                          </div></div></a></Link>} */}

            {selectedDiv === "production_orders" ? (
              <li><Link href="/order">
                <a
                  title="Production Orders"
                  className="selected_items"
                  onClick={() => {
                    setSelectedDiv('production_orders');
                  }}
                >
                  <div className="strip" />
                  <div className="center">
                    <IoConstruct />
                    <div style={{ marginLeft: "1.3rem" }}>
                      Production Orders
                    </div>
                  </div>
                </a>
              </Link></li>
            ) : (
              <li><Link href="/order">
                <a
                  title="Production Orders"
                  className="nav_items"
                  onClick={() => {
                    setSelectedDiv('production_orders');
                  }}
                >
                  <div className="empty_strip" />
                  <div className="center">
                    <IoConstruct />
                    <div style={{ marginLeft: "1.3rem" }}>
                      Production Orders
                    </div>
                  </div>
                </a>
              </Link></li>
            )}
          </ul>
          <div></div>

          <div
            title="Logout"
            className="logout_link"
            style={{ marginLeft: "2.2%" }}
            onClick={() => {
              localStorage.clear();
              Router.push("/login");
            }}
          >
            <FaSignOutAlt /> <div style={{ marginLeft: "1.3rem" }}>Logout</div>
          </div>
        </div>
      ) : (
        <div className="navbar">
          <div
            style={{
              width: "16.66vw",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="navbar_img1">
              <Image src={Logo_inverted} layout="fill" alt="" />
            </div>
          </div>
          <div className="nav_list">
            {selectedDiv === "dashboard" ? (
              <li><Link href="/">
                <a
                  title="Dashboard"
                  className="selected_items"
                  onClick={() => {
                    setSelectedDiv('dashboard');
                  }}
                >
                  <div className="strip" />
                  <div className="center1">
                    <FaTh />
                  </div>
                </a>
              </Link></li>
            ) : (
             <li> <Link href="/">
                <a
                  title="Dashboard"
                  className="nav_items"
                  onClick={() => {
                    setSelectedDiv('dashboard');
                  }}
                >
                  <div className="empty_strip" />
                  <div className="center1">
                    <FaTh />
                  </div>
                </a>
              </Link></li>
            )}

            {/* {selectedDiv==='purchase_orders'?
                          <Link href="/purchaseOrder"><a title='Purchase Orders' className='selected_items' onClick={()=>{
                          setPurchaseOrders()}}><div className='strip'/><div className='center1'><FaShoppingCart /></div></a></Link>
                        :
                        <Link href="/purchaseOrder"><a title='Purchase Orders' className='nav_items' onClick={()=>{
                          setPurchaseOrders()}}><div className='empty_strip'/><div className='center1'><FaShoppingCart />
                          </div></a></Link>} */}

            {selectedDiv === "production_orders" ? (
             <li> <Link href="/order">
                <a
                  title="Production Orders"
                  className="selected_items"
                  onClick={() => {
                    setSelectedDiv('production_orders');
                  }}
                >
                  <div className="strip" />
                  <div className="center1">
                    <IoConstruct />
                  </div>
                </a>
              </Link></li>
            ) : (
              <li><Link href="/order">
                <a
                  title="Production Orders"
                  className="nav_items"
                  onClick={() => {
                    setSelectedDiv('production_orders');
                  }}
                >
                  <div className="empty_strip" />
                  <div className="center1">
                    <IoConstruct />
                  </div>
                </a>
              </Link></li>
            )}
          </div>
          <div></div>

          <div
            title="Logout"
            className="logout_link"
            style={{ justifyContent: "center" }}
            onClick={() => {
              localStorage.clear();
              Router.push("/login");
            }}
          >
            <FaSignOutAlt />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
