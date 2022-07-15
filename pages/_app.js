import '../styles/globals.css';
import '../styles/login.css';
import '../styles/dashboard.css';
import '../styles/sidebar.css';
import '../styles/table.css';
import '../styles/card.css';
import '../styles/ledger.css';
import '../styles/dropdown.css';
import '../styles/modal.css';
import '../styles/backdrop.css';
import '../styles/stockIn.css';
import '../styles/stockInList.css';
import '../styles/spinner.css';
import '../styles/order.css';
import '../styles/newOrder.css';
import '../styles/orderDetails.css';
import '../styles/stockOut.css';
import '../styles/stockOutList.css';
import '../styles/header.css';
import '../styles/ledgerCard.css';
import '../styles/orderList.css';
import '../styles/purchaseOrder.css';
import '../styles/newPurchaseOrder.css';
import '../styles/selectVendor.css';
import '../styles/vendorList.css';
import '../styles/partList.css';


import Sidebar from '../components/sidebar';



function MyApp({ Component, pageProps }) {

  return(
    // <div className='layout'>
    // <Sidebar/>
    <Component {...pageProps} />
    // </div>
  )
}

export default MyApp
