import axios from "axios";

import { MAIN ,URL} from "./constants";

export const createProductionOrder=(poItems,token) =>{
    const date=new Date().toISOString().slice(0, 10);
        return axios.post(URL+MAIN.PRODUCTION_ORDER,{
            date:date,
            remark:'remark',
            production_order_items:poItems
        },{
            headers:{
                "Authorization":"Token "+ token
            }})
    }

export const fetchProductionOrderList=(token) =>{
    return axios.get(URL+MAIN.PRODUCTION_ORDER,{headers:{
            "Authorization":"Token "+ token
        }})
    }