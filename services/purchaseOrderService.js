import axios from "axios";

import { MAIN ,URL} from "./constants";


export const fetchPurchaseOrderList=(token) =>{
            return axios.get(URL+MAIN.PURCHASE_ORDER,{headers:{
                "Authorization":"Token "+ token
            }})
        }

export const createPurchaseOrder=(poItems,token) =>{
    const date=new Date().toISOString().slice(0, 10);
        return axios.post(URL+MAIN.PURCHASE_ORDER,{
            date:date,
            purchase_order_items:poItems
        },{
            headers:{
                "Authorization":"Token "+ token
            }})
    }

export const fetchBOMList=(token) =>{
        return axios.get(URL+MAIN.BOM,{headers:{
            "Authorization":"Token "+ token
        }})
    }

export const fetchPartWiseList=(token) =>{
    return axios.get(URL+MAIN.PART_WISE_LIST+"15",{headers:{
        "Authorization":"Token "+ token
    }})
}
