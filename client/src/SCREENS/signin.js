import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {userContext} from '../App'
import '../App.css';
import M from 'materialize-css';

const Signin =()=>{
    const {state,dispatch}=useContext(userContext)
    const [email,setEmail]=useState("");
     const [password,setPassword]=useState("");
     const history=useHistory();

      const PostData=()=>{
         fetch("/signin",{
             method:"post",
             headers:{
                 "Content-Type":"application/json"
             },
             body:JSON.stringify({
                 email:email,
                 password:password
             })
         }).then(res=>res.json()) //this form helps to parse into the data's json part
         .then(shre=>{
            if(shre.error){
                return( M.toast({html:shre.error,classes:"#f44336 red"}))
                 }
             else{
                 localStorage.setItem("jwt",shre.token)
                 localStorage.setItem("user",JSON.stringify(shre.user))//if u can't understand this then just cnsole log shre once and as user is an object so we need to stringify it
                 dispatch({type:"USER",payload:shre.user}) 
                 return( M.toast({html:shre.message,classes:"#4caf50 green"})),
                 history.push('/home')
             }
              
            
     }).catch(err=>{console.log(err)})
    }

     return(
    
        <div className="mycard">
            <div className="card card-sign">
                <h2 className="brand-logo color">SpeakingPixels</h2>
                <input  type="email" placeholder="Email Id" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input  type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light" onClick={()=>PostData()}>Signin
                </button>
                <br/>
                <Link to="/signup" className="p"><h6>Do not have an account?</h6></Link>
                <Link to="/reset" className="p"><h6>Forgot your password?</h6></Link>
        
            </div>
        </div>
    )
}

export default Signin;

  