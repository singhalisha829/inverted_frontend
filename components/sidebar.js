import Image from "next/image";
import Router ,{ useRouter} from "next/router";
import { useEffect } from "react";
import Link from "next/link";

import Logo from "../public/logo.png";
import Logo_inverted from "../public/Logo_inverted.png";

import { FaTh, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import { BsJournalText } from "react-icons/bs";

import { IoConstruct } from "react-icons/io5";
import { useState } from "react";

const pages = [
  {
      name: "Dashboard",
      link: "/",
      icon:<FaTh />

  },
  {
      name: "Production Order",
      link: "/order",
      icon:<IoConstruct/>
  },
  {
    name: "Ledger",
    link: "/ledger",
    icon:<BsJournalText/>
},

];

const Tabs = ({ data,width }) => {
  const router = useRouter();

  return (
      <li>
          <Link href={data.link}>
          <a
          className={router.pathname == data.link ? 'selected_items' : 'nav_items'}
                  title="Dashboard"
                >
                   {/* <div className="strip" /> */}
                   <div className={router.pathname == data.link ? 'strip' : 'empty_strip'} />
                   <div className={width>'1200'?"center":"center1"}>
                     {data.icon}
                     <div style={{ marginLeft: "1.3rem" }}>{width>'1200'?data.name:null}</div>
                   </div>
              </a>
          </Link>  
      </li>
  );
};

const Sidebar = () => { 

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
    <div className="navbar">
      
          <div >
                {size.width>'1200'?<div className="navbar_img">
               <Image src={Logo} layout="responsive" alt="" width={50} height={15}/>
             </div>:<div className="navbar_img1">
              <Image src={Logo_inverted} layout="responsive" alt=""/>
            </div>}
             <nav className="nav_list">
             <ul>
                        {pages.map((entry, key) => (
                            <Tabs key={key} data={entry} width={size.width} />
                        ))}
                    </ul>
             </nav>
              </div>
              <div
            title="Logout"
            className={size.width>'1200'?"logout_link":"logout_icon"}
            onClick={() => {
              localStorage.clear();
              Router.push("/login");
            }}
          >
            <FaSignOutAlt /> {size.width>'1200'?<div style={{marginLeft:'1rem'}}>Logout</div>:null}
          </div>
        </div>
      
  );
};

export default Sidebar;
