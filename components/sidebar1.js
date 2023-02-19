import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
//components
import { FaTh, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import { IoConstruct } from "react-icons/io5";

import Logo from "../public/logo.png";
import Logo_inverted from "../public/Logo_inverted.png";
//Assets
//context
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
 
];
const notiDot = 10;
const Tabs = ({ pathName, data }) => {
    const link = data.link.split("/");
    // const clax = pathName[1] === link[1] ? style.active : null;

    return (
        <li className="clax" >
            <Link href={data.link}>
                <div>{data.icon} {data.name}</div>
            </Link>
        </li>
    );
};
function Sidebar1() {
    const pathName = useRouter().pathname.split("/");
    return (
        <div className="navbar">
            <div  style={{
              width: "16.66vw",
              display: "flex",
              justifyContent: "logo_center",
            }}>
                {" "}
                <div className="navbar_img">
                <Image src={Logo} layout="responsive" alt="" />
                </div>
                <nav
                    // className={[style.nagivator, style[showSidebar]].join(" ")}
                >
                    <ul>
                        {pages.map((entry, key) => (
                            <Tabs key={key} pathName={pathName} data={entry} />
                        ))}
                    </ul>
                </nav>
                <div 
                // className={style.control_icons}
                >
                    {/*  <BsBell style={{ width: "1.5rem", height: "1.5rem" }} />*/}
                    {/* <UserDropdown /> */}
                    <div
                        // className={`${style.menu} ${showSidebar}`}
                        onClick={() =>
                            setShowSidebar((prev) => {
                                if (prev == "") {
                                    return "open";
                                } else {
                                    return "";
                                }
                            })
                        }
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar1;
