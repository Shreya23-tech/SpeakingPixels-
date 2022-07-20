import React,{useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import '../App.css';
import M from 'materialize-css';

const Signup =()=>{
     const [name,setName]=useState("");
     const [email,setEmail]=useState("");
     const [password,setPassword]=useState("");
     const history=useHistory();

     const PostData=()=>{
         fetch("/signup",{
             method:"post",
             headers:{
                 "Content-Type":"application/json"
             },
             body:JSON.stringify({
                 name:name,
                 email:email,
                 password:password
             })
         }).then(res=>res.json()) //this form helps to parse into the data's json part
         .then(shre=>{
            if(shre.error){
                return( M.toast({html:shre.error,classes:"#f44336 red"}))
                 
             }
             else{
                 M.toast({html:shre.message,classes:"#4caf50 green"});
                 history.push('/signin')
             }
              
            
     }).catch(err=>{console.log(err)})
    }
    return(
        <div className="mycard">
            <div className="card card-sign">
                <h2 className="brand-logo color">SpeakingPixels</h2>
                <input type="text" placeholder="Username" value={name} onChange={(e)=>setName(e.target.value)}/>
                <input  type="email" placeholder="Email Id" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input  type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light"  onClick={()=>PostData()}>Signup
                </button>
                 <br/>
                <Link to="/signin" className="p"><h6>Already Have an Account?</h6></Link>
        
            </div>
        </div>
    )
}

export default Signup ;