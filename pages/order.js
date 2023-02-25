import Spinner from "../components/spinner";
import Sidebar from "../components/sidebar";
import Dropdown from "../components/dropdown";
import Router from "next/router";
import Head from "next/head";
import Header from "../components/header";
import List from "../components/list";

import Table from "../components/table";
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

import { fetchProductionOrderList } from "../services/productionOrderService";

const Order = () => {
  const [searchText, setSearchText] = useState(null);
  const [filterOnStatus, setFilterOnStatus] = useState(null);
  const [token, setToken] = useState(null);
  const [orderType, setOrderType] = useState("All");
  const [productionOrderList, setProductionOrderList] = useState(null);

  const status = [
    { name: "Completed", id: "Completed" },
    { name: "Partially Processed", id: "Partial Processed" },
    { name: "Created", id: "Created" },
  ];

  const columns = [
    {
      accessor1: "production_order_no",
      label: "Order Number",
      width: "25%",
      textalign: "center",
    },
    { accessor1: "date", label: "Date", width: "25%", textalign: "center" },
    {
      accessor1: "created_by",
      label: "Created By",
      width: "25%",
      textalign: "center",
    },
    {
      accessor1: "status",
      prefix: '<div className="status_style" >',
      suffix: "</div>",
      label: "Status",
      width: "25%",
      textalign: "center",
    },
  ];

  useEffect(() => {
    if (localStorage.getItem("token") != undefined) {
      localStorage.setItem("selected_item", "production_orders");
      const token = localStorage.getItem("token");
      setToken(token);
      fetchProductionOrderList(token).then((res) => {
        const sorted = res.data.data.output
          .slice()
          .sort(
            (a, b) =>
              -(a.production_order_no || "").localeCompare(
                b.production_order_no || "",
                undefined,
                { numeric: true }
              )
          );
        setProductionOrderList(sorted);
      });
    } else {
      Router.push("/login");
    }
  }, []);

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

  let content = null;
  if (size.width > "600") {
    content = (
      <div className="order_table">
        {productionOrderList ? (
          <Table
            columns={columns}
            rows={productionOrderList}
            search={searchText}
            filter={filterOnStatus}
            path="/orderDetails"
            cursor="pointer"
            width="77vw"
            filterIn="status"
          />
        ) : (
          <Spinner />
        )}
      </div>
    );
  } else {
    content = productionOrderList ? (
      <List
        rows={productionOrderList}
        path="/orderDetails"
        search={searchText}
        filter={filterOnStatus}
        columns={columns}
      />
    ) : (
      <Spinner />
    );
  }

  return (
    <div>
      <Head>
        <title>Inverted</title>
        <link rel="icon" href="/logo icon 2-01.png" />
      </Head>
      {/* {size.width>'600'?<Sidebar /> : <Header />} */}
      <div className="order_page">
        <div className="order_title">
          <div className="title">Production Orders</div>
          <div className="sub_title">Database for all Orders</div>
        </div>
        <div className="order_section">
          <Dropdown
            options={status}
            allItems="true"
            searchPlaceholder="Search Status"
            name="name"
            width="15vw"
            height="3.5rem"
            border={true}
            parentCallback={(data) => {
              setFilterOnStatus(data.id);
              setOrderType(data.name);
            }}
            dropdownWidth={size.width > "600" ? "15vw" : "30vw"}
            backGround="#F6F7FB"
            value={orderType}
          />
          <input
            placeholder="Search.."
            style={{
              height: "3.5rem",
              marginLeft: "2rem",
              width: "70%",
              background: "#F6F7FB",
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div>
            <FaTimes
              className="clear_icon"
              title="Clear"
              onClick={() => setSearchText("")}
            />
          </div>
        </div>

        <div
          style={{ marginTop: "2rem", justifyContent: "space-between" }}
          className="order_section"
        >
          <div className="order_subtitle">Your Orders</div>
          <div></div>
          <button
            className="order_button"
            onClick={() => Router.push("/newOrder")}
          >
            Create Order
          </button>
        </div>

        {size.width < "600" ? (
          <div className="order_list_header">
            <div className="order_list_content" style={{ paddingLeft: "1rem" }}>
              Order Number
            </div>
            <div className="order_list_content">Date</div>
            <div className="order_list_content">Created By</div>
            <div className="order_list_content">Status</div>
          </div>
        ) : null}

        {content}
      </div>
    </div>
  );
};

export default Order;
