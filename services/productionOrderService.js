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

export const fetchProductionOrderDetails=(token,id) =>{
        return axios.get(URL+MAIN.PRODUCTION_ORDER+"?id="+id,{headers:{
                "Authorization":"Token "+ token
            }})
    }

export const fetchPartWiseList=(token,poId) =>{
        return axios.get(URL+MAIN.PRODUCTION_ORDER_PART_WISE_LIST+poId,{headers:{
            "Authorization":"Token "+ token
        }})
    }

export const createProductionOrderTransaction=(token,data) =>{
            return axios.post(URL+MAIN.PRODUCTION_ORDER_TRANSACTION,data,{
                headers:{
                    "Authorization":"Token "+ token
                }})
        }