import axios from "axios";

import { MAIN ,URL} from "../services/constants";


export const fetchPurchaseOrderList=(token) =>{
            return axios.get(URL+MAIN.PURCHASE_ORDER,{headers:{
                "Authorization":"Token "+ token
            }})
        }
