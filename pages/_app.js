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

import { UserContext } from "../components/user";
import {useEffect} from 'react';
import { useRouter} from 'next/router';



function MyApp({ Component, pageProps }) {

  // const router= useRouter();

  // console.log(pageProps)
  // useEffect(() => {
  //   const token= localStorage.getItem('token');
  //   if(pageProps.protected && !token){
  //     router.push('/login')
  //   }

  // }, [])


  // if (
  //   pageProps.protected &&
  //   user &&
  //   pageProps.userTypes &&
  //   pageProps.userTypes.indexOf(user.type) === -1
  // ) {
  //   return <div>Sorry, you dont have access</div>;
  // }
  return(
    // <UserContext.Provider>
    <Component {...pageProps} />
  // </UserContext.Provider>
  )
}

export default MyApp
