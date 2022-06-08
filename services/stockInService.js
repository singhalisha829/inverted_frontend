import axios from "axios";
import { useEffect } from "react";

import {URL, MAIN } from "./constants";


export const fetchPartById=(partId,token) =>{
    return axios.get(URL+MAIN.PART_BY_ID+partId,{headers:{
        "Authorization":"Token "+ token
    }})
        }