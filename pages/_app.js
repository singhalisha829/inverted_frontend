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

import Head from 'next/head';


function MyApp({ Component, pageProps }) {
  return <Component >
     <Head>
       <title>Inverted</title>
     </Head>
     <main>
     {pageProps}</main>
    </Component>
}

export default MyApp
