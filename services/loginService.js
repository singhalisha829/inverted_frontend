import axios from "axios";
import Router from "next/router";

import {URL, MAIN } from "./constants";


export const onLogin=(username,password) =>{
            return axios.post(URL+MAIN.LOGIN,{
                username:username,
                password:password
            }).then(res=>{
                console.log(res.data.token)
                localStorage.setItem('token',res.data.token)
                Router.push('/');
            });
        }