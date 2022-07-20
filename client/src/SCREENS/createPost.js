import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import '../App.css';
import M from 'materialize-css'

const CreatePost =()=>{
const history=useHistory();
const[tittle,setTittle]=useState("");
const[body,setBody]=useState("");
const[pic,setPic]=useState("");
const[url,setUrl]=useState("");

useEffect(()=>{
   if(url){// because useEffect will also come into action when url will be created that is when url=""
   fetch("/createPost",{
      method:"post",
      headers:{
         "Content-Type":"application/json",
         "Authorization":"Bearer "+localStorage.getItem('jwt')
      },
      body:JSON.stringify(
         {
            tittle,
            body,
            pic:url,
            token:localStorage.getItem('jwt')
         }
      )
}).then(res=>res.json())
.then(shre=>{
   if(shre.error){
       return( M.toast({html:shre.error,classes:"#f44336 red"}))
   }
   else{
       M.toast({html:shre.message,classes:"#4caf50 green"})
                 history.push('/home')
   }
})}
},[url])
const postDetails=()=>{
   const data=new FormData();//Bsically used to bind all the data in one package to transfer , basically an alternative of json form
   data.append("file",pic)
   data.append("upload_preset","speakingpixels")
    data.append("cloud_name","speakingpixels")

    fetch("https://api.cloudinary.com/v1_1/speakingpixels/image/upload",{
       method:"post",
       body:data
    })
    .then(res=>res.json())
    .then(shre=>{setUrl(shre.url)})
    .catch(err=>console.log(err))
}
return(
<div className="card card-sign">
     <h2 className="brand-logo color">Create Post</h2>
     <input type="text" placeholder="tittle" value={tittle} onChange={(e)=>setTittle(e.target.value)}/>
     <input type="text" placeholder="body" value={body} onChange={(e)=>setBody(e.target.value)}/>
     
               <div class = "file-field input-field">
                  <div class = "btn">
                     <span>Browse</span>
                     <input type = "file" onChange={(e)=>setPic(e.target.files[0])}/>
                  </div>
                  <div class = "file-path-wrapper">
                     <input class = "file-path validate" type = "text"
                        placeholder = "Upload picture" />
                  </div>
               </div>
            <button className="btn waves-effect waves-light" onClick={()=>postDetails()}>post
                </button>
                

</div>)}


export default CreatePost;