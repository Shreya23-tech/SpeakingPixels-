import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import '../App.css';
import M from 'materialize-css';

const Reset =()=>{
    
     const [email,setEmail]=useState("");
    const history=useHistory();
      const PostData=()=>{
         fetch("/reset",{
             method:"post",
             headers:{
                 "Content-Type":"application/json"
             },
             body:JSON.stringify({
                 email
             })
         }).then(res=>res.json()) //this form helps to parse into the data's json part
         .then(shre=>{
              ( M.toast({html:shre.message,classes:"#4caf50 green"}))
               history.push("/signin")
     }).catch(err=>{console.log(err)})
    }

     return(
    
        <div className="mycard">
            <div className="card card-sign">
                <h2 className="brand-logo color">Enter Your Email Id</h2>
                <input  type="email" placeholder="Email Id" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <button className="btn waves-effect waves-light" onClick={()=>PostData()}>Enter
                </button>
        
            </div>
        </div>
    )
}

export default Reset;

  