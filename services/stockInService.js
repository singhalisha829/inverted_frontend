import axios from "axios";

import {URL, MAIN } from "./constants";


export const fetchPartById=(partId,token) =>{
    return axios.get(URL+MAIN.PART,{headers:{
        "Authorization":"Token "+ token
    },
    params:{id:partId}
})
        }

export const fetchVendorList=(token,id) =>{
    if(id != null){
        return axios.get(URL+MAIN.VENDOR+id,{headers:{
            "Authorization":"Token "+ token
        }})  
    }else{
        return axios.get(URL+MAIN.VENDOR,{headers:{
            "Authorization":"Token "+ token
        }})
    }}
        
export const fetchUnitList=(token) =>{
    return axios.get(URL+MAIN.UNIT,{headers:{
            "Authorization":"Token "+ token
        }})
    }
        
export const fetchLedgerByPartId=(partId,token) =>{
    return axios.get(URL+MAIN.LEDGER_BY_PARTID+partId,{headers:{
        "Authorization":"Token "+ token
    }})
}
        
export const fetchPartByPartId=(partId,token) =>{
    return axios.get(URL+MAIN.PART_BY_PARTID+partId,{headers:{
        "Authorization":"Token "+ token
    }})
}
        
        
 export const addNewLedger=async (stockInList,token) =>{
    const res = await axios.post(URL + MAIN.LEDGER, stockInList, {
         headers: {
             "Authorization": "Token " + token
         }
     });
     return res;
}

export const fetchLedger=async (token,data) =>{
    const res = await axios.get(URL + MAIN.LEDGER ,{
         headers: {
             "Authorization": "Token " + token,
         },
         params:{...data}

     });
     return res;
}