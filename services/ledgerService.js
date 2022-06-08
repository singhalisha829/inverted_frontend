import axios from "axios";

import { MAIN , URL} from "./constants";

export const fetchVendorList=(token) =>{
            return axios.get(URL+MAIN.VENDOR,{headers:{
                "Authorization":"Token "+ token
            }})
        }

export const fetchUnitList=(token) =>{
        return axios.get(URL+MAIN.UNIT,{headers:{
                "Authorization":"Token "+ token
            }})
        }

export const fetchLedgerByPartId=(partId,token) =>{
    console.log(partId)
    return axios.get(URL+MAIN.LEDGER_BY_PARTID+partId,{headers:{
        "Authorization":"Token "+ token
    }})
}

export const fetchPartByPartId=(partId,token) =>{
    return axios.get(URL+MAIN.PART_BY_PARTID+partId,{headers:{
        "Authorization":"Token "+ token
    }})
}


export const addNewLedger=(formData,token) =>{
    console.log(formData)
    const d= formData.date.getDate();
    const month= formData.date.getMonth()+1;
    const year= formData.date.getFullYear();
    const date=[d,month,year].join('-')
    return axios.post(URL+MAIN.LEDGER,{
        date:date,
        quantity:formData.quantity+' '+formData.unit,
        part:formData.part,
        transaction_type:formData.transaction_type,
        vendor:formData.vendor,
        price:formData.price,
        document_id:formData.invoice
        },{
            headers:{                "Authorization":"Token "+ token
        }
    }).then(res=>console.log(res))
}