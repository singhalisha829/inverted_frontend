import axios from "axios";

import { MAIN ,URL} from "../services/constants";


export const fetchPartsList=(token) =>{
            return axios.get(URL+MAIN.PARTS,{headers:{
                "Authorization":"Token "+ token
            }})
        }

 export const addNewPart=(partType,partName,partDesc,unit,token) =>{
    return axios.post(URL+MAIN.PARTS,{
        part_type:partType,
            short_description:partName,
            long_description:partDesc,
            quantity:"0 "+ unit
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