import {useState } from "react"; 
import Image from "next/image";
import Head from "next/head";

import logo from '../public/logo.png';
import {FaStarOfLife, FaAt} from 'react-icons/fa';

import { onLogin } from '../services/loginService';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login =()=>{
    const [username,setUsername]=useState(null);
    const [password, setPassword]= useState(null);
    const [viewPassword, setViewPassword] = useState(false);


    // on submiting login credentials
    const onSubmit=()=>{     
        if(username == null || username == ''){
            toast.warning("Please Enter Username!")
        }else if(password == null || password == ''){
            toast.warning("Please Enter Password!")
        }else{
        onLogin(username,password).catch(err=>{console.log(err);toast.error(err.response.data.non_field_errors[0])})
        }  
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
          onSubmit();
        }
      }


    
        return(

            <div className="container" >
                 <Head>
      <title>Inverted</title>
      <link rel="icon" href="/logo icon 2-01.png" />
    </Head>
                <ToastContainer />
            <div className="box">
                <div className="img"><Image src={logo} width={200} height={50} layout="fixed" alt=""/></div>
                <div className="content">Enter your details with login and password</div>
                <form onSubmit={onSubmit} className="input_area" onKeyPress={handleKeyPress} >
                <div style={{display:'flex',width:'80%',position:'relative'}}>
                    <input style={{marginBottom:"10px"}} className="login_fields" type="text" value={username} placeholder="Username"
                    onChange={(e)=>setUsername(e.target.value)}/><div className="login_icon"><FaAt size={11}/></div></div>
                    <div style={{display:'flex',width:'80%',position:'relative'}}>
                        <input className="login_fields" type={viewPassword?'text':'password'} value={password} placeholder="Password"
                    onChange={(e)=>setPassword(e.target.value)}/><div className="login_icon"><FaStarOfLife cursor="pointer" size={11} onClick={()=>setViewPassword(!viewPassword)}/></div></div>
                </form>
                <div className="footer">
                {/* <div><input type="checkbox"/>Remember me</div> */}
                <div style={{position:"relative",right:"-80%"}}>
                    {/* <Link to=''>Forgot Password?</Link> */}
                    </div>
                </div>
                <div style={{width:"100%",display:'flex',justifyContent:"center",marginTop:'1rem'}}><button className="login_button common" 
                 style={{margin:"0"}} onClick={()=>{onSubmit()}} type="submit" >Login</button></div>
            </div>
            </div>
        )
    
}

export default Login;