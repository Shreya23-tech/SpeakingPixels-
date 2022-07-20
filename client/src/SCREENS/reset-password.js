import React,{useState} from 'react';
import {useParams,useHistory} from 'react-router-dom';
import '../App.css';
import M from 'materialize-css';


const Resets =()=>{
    
     const [password,setPassword]=useState("");
     const [passwords,setPasswords]=useState("");
     const{token}=useParams()
     const history=useHistory()

      const PostData=()=>{
          if(password===passwords){
             fetch("/resets",{
             method:"post",
             headers:{
                 "Content-Type":"application/json"
             },
             body:JSON.stringify({
                 password,
                 token
             })
         }).then(res=>res.json()) //this form helps to parse into the data's json part
         .then(shre=>{
             if(shre.error){
                 return( M.toast({html:shre.error,classes:"#f44336 red"}))
             }
              ( M.toast({html:shre.message,classes:"#4caf50 green"}))
              history.push("/signin")
            
     }).catch(err=>{console.log(err)})
          }
         else{
             return( M.toast({html:"Password does not match",classes:"#f44336 red"}))
         }
    }

     return(
    
        <div className="mycard">
            <div className="card card-sign">
                <h2 className="brand-logo color">Reset Password</h2>
                <input type="password" placeholder="Enter New Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <input type="password" placeholder="Confirm New Password" value={passwords} onChange={(e)=>setPasswords(e.target.value)}/>
                <button className="btn waves-effect waves-light" onClick={()=>PostData()}>Reset
                </button>
        
            </div>
        </div>
    )
}

export default Resets;

  