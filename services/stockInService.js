import axios from "axios";
import { useEffect } from "react";

import {URL, MAIN } from "./constants";


export const fetchPartById=(partId,token) =>{
    return axios.get(URL+MAIN.PART_BY_ID+partId,{headers:{
        "Authorization":"Token "+ token
    }})
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
        
        
 export const addNewLedger=(stockInList,token) =>{
    return axios.post(URL+MAIN.LEDGER,stockInList,{
            headers:{                
                "Authorization":"Token "+ token
        }
        }).then(res=>console.log(res))
}