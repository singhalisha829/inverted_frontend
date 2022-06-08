import axios from "axios";
import { useEffect } from "react";

import { MAIN ,URL} from "../services/constants";


export const fetchPartsList=(token) =>{
            return axios.get(URL+MAIN.PARTS,{headers:{
                "Authorization":"Token "+ token
            }})
        }

 export const addNewPart=(partType,partName,partDesc,token) =>{
    return axios.post(URL+MAIN.PARTS,{
        part_type:partType,
            short_description:partName,
            long_description:partDesc
        },{
            headers:{                "Authorization":"Token "+ token
            }
        })
    }

export const fetchPartTypeList=(token) =>{
    return axios.get(URL+MAIN.PART_TYPE,{headers:{
        "Authorization":"Token "+ token
    }})
}