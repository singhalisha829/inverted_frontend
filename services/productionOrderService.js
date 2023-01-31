import axios from "axios";

import { MAIN ,URL} from "./constants";

export const createProductionOrder= async (poItems,token) =>{
    const date=new Date().toISOString().slice(0, 10);
        const res = await axios.post(URL+MAIN.PRODUCTION_ORDER,{
            date:date,
            remark:'remark',
            production_order_items:poItems
        },{
            headers:{
                "Authorization":"Token "+ token
            }})
        return res;
    }

export const fetchProductionOrderList=(token) =>{
    return axios.get(URL+MAIN.PRODUCTION_ORDER,{headers:{
            "Authorization":"Token "+ token
        }})
    }

export const fetchDropdownPartList=(token) =>{
        return axios.get(URL+MAIN.DROPDOWN_PARTS,{headers:{
                "Authorization":"Token "+ token
            }})
    }

export const fetchDropdownUnitList=(token,unitType) =>{
    if(unitType==null){
        return axios.get(URL+MAIN.DROPDOWN_UNIT,{headers:{
            "Authorization":"Token "+ token
        }}) 
    }else{
        return axios.get(URL+MAIN.DROPDOWN_UNIT+unitType,{headers:{
                "Authorization":"Token "+ token
            }})
    }
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

export const createProductionOrderTransaction= async (token,data) =>{
            const res= await axios.post(URL+MAIN.PRODUCTION_ORDER_TRANSACTION,data,{
                headers:{
                    "Authorization":"Token "+ token
                }})

            return res;
        }

export const fetchPastTransaction=(token,poId) =>{
            return axios.get(URL+MAIN.PRODUCTION_ORDER_TRANSACTION+"?production_order_id="+poId,{headers:{
                "Authorization":"Token "+ token
            }})
        }