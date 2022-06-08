import {useState } from "react"; 
import Image from "next/image";

import logo from '../public/logo.png';
import {FaStarOfLife, FaAt} from 'react-icons/fa';

import { onLogin } from '../services/loginService';


const Login =()=>{
    const [username,setUsername]=useState(null);
    const [password, setPassword]= useState(null);
    const [viewPassword, setViewPassword] = useState(false);


    const onSubmit=()=>{
       
        onLogin(username,password) 
        console.log(username,password)
        
    }
    
        return(

            <div className="container" >
            <div className="box">
                <div className="img"><Image src={logo} width={200} height={50} layout="fixed" /></div>
                <div style={{width:"100%",display:"flex",justifyContent:"center"}} className="content">Enter your details with login and password</div>
                <div className="input_area">
                <div style={{display:'flex',width:'80%',position:'relative'}}>
                    <input style={{marginBottom:"10px", height:"30px",width:'100%'}} type="text" value={username} placeholder="Username"
                    onChange={(e)=>setUsername(e.target.value)}/><div className="login_icon"><FaAt size={11}/></div></div>
                    <div style={{display:'flex',width:'80%',position:'relative'}}>
                        <input style={{height:"30px",width:"100%"}} type={viewPassword?'text':'password'} value={password} placeholder="Password"
                    onChange={(e)=>setPassword(e.target.value)}/><div className="login_icon"><FaStarOfLife size={11} onClick={()=>setViewPassword(!viewPassword)}/></div></div>
                </div>
                <div className="footer">
                {/* <div><input type="checkbox"/>Remember me</div> */}
                <div style={{position:"relative",right:"-80%"}}>
                    {/* <Link to=''>Forgot Password?</Link> */}
                    </div>
                </div>
                <div style={{width:"100%",display:'flex',justifyContent:"center",marginTop:'1rem'}}><button className="login_button" 
                 style={{margin:"0"}} onClick={()=>{onSubmit()}} >Login</button></div>
            </div>
            </div>
        )
    
}

export default Login;