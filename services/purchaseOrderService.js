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

export const postPoVendor=(token,vendorList) =>{
    return axios.post(URL+MAIN.PO_VENDOR,
        vendorList
        ,{headers:{
        "Authorization":"Token "+ token
    }})
}

export const fetchPartWiseList=(token,poId) =>{
    return axios.get(URL+MAIN.PURCHASE_ORDER_PART_WISE_LIST+poId,{headers:{
        "Authorization":"Token "+ token
    }})
}

export const fetchVendorWiseList=(token,poId) =>{
    return axios.get(URL+MAIN.VENDOR_WISE_LIST+"?purchase_order_id="+poId,{headers:{
        "Authorization":"Token "+ token
    }})
}

export const fetchPurchaseOrderDetails=(token,poId) =>{
    return axios.get(URL+MAIN.PURCHASE_ORDER+"?id="+poId,{headers:{
        "Authorization":"Token "+ token
    }})
}


export const unitConversion=(token,required_symbol,entered_symbol) =>{
    return axios.get(URL+MAIN.UNIT_CONVERSION+required_symbol+
        "&entered_symbol="+entered_symbol
        ,{headers:{
        "Authorization":"Token "+ token
    }})
}

export const postPoVendor1=(token,vendorList) =>{
    return axios.post(URL+MAIN.PO_VENDOR1,
        vendorList
        ,{headers:{
        "Authorization":"Token "+ token
    }})
}

export const fetchUnassignedParts=(token,poId) =>{
    return axios.get(URL+MAIN.PO_VENDOR1+"?purchase_order_id="+poId
        ,{headers:{
        "Authorization":"Token "+ token
    }})
}

export const deleteAssignedParts=(token,list) =>{
    console.log(list)
    return axios.post(URL+MAIN.DELETE_PART,list,
{headers:{
        "Authorization":"Token "+ token
    }})
}

export const deleteParts=(token,partId) =>{
    return axios.delete(URL+MAIN.PO_VENDOR+"?id="+partId
        ,{headers:{
        "Authorization":"Token "+ token
    }})
}

export const confirmVendor=(token,id) =>{
    return axios.put(URL+MAIN.VENDOR_WISE_LIST+"?id="+id,{
        status:'Confirmed'
    },{headers:{
        "Authorization":"token "+ token,
    }})
}

