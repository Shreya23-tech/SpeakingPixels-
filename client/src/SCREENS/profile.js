import React,{useState,useEffect,useRef,useContext} from 'react';
import '../App.css';
import M from 'materialize-css';
import {userContext} from '../App';

const Profile =()=>{
const {state,dispatch}=useContext(userContext);
const upload=useRef(null);  
const [pic,setPic]=useState([]);
const [prof,setProf]=useState("");
const [url,setUrl]=useState("")

useEffect(
    ()=>{
        M.Modal.init(upload.current)
        fetch("/mypost",{
          headers: {
              "Authorization":"Bearer "+localStorage.getItem('jwt')
          }
        } ).then(res=>res.json())
        .then(shre=>{
            console.log(shre)
            setPic(shre)
            })
         .catch(err=>console.log(err))}
,[])
useEffect(
    ()=>{
         if(url){
        fetch("/prof",{
            method:"post",
          headers: {
              "Authorization":"Bearer "+localStorage.getItem('jwt'),
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              url
          })
        } ).then(res=>res.json())
        .then(shre=>{
         if(shre.error){
                 
             return ( M.toast({html:shre.error,classes:"#f44336 red"}))
         }
         else{
             window.location.reload()
             M.toast({html:shre.message,classes:"#4caf50 green"});
         }
        })
         .catch(err=>console.log(err))}
    }
    
,[url])

const postProfile=()=>{
    const data=new FormData();//Bsically used to bind all the data in one package to transfer , basically an alternative of json form
   data.append("file",prof)
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

const Cat=()=>{
    
    if(pic.length>0){
         return(<img src={pic[0].postedBy.profilepic} className="ProfPic"/>)
    }
    
}

const Follow=(id)=>{
    fetch("/follow",{
        method:"post",
        headers:{
             "Authorization":"Bearer "+localStorage.getItem('jwt'),
             "Content-Type":"application/json",
        },
        body:JSON.stringify({
            id
        })
    })
}
const Unfollow=(id)=>{
    fetch("/unfollow",{
        method:"post",
        headers:{
             "Authorization":"Bearer "+localStorage.getItem('jwt'),
             "Content-Type":"application/json",
        },
        body:JSON.stringify({
            id
        })
    })
}

const Fol=()=>{
    if(pic.length>0){
        return(<>
        <h6>{pic[0].postedBy.followers.length} followers</h6>
        <h6>{pic[0].postedBy.following.length} following</h6>
                    {(state._id!=pic[0].postedBy._id)?((pic[0].postedBy.followers).includes(state._id)? <button className="btn waves-effect waves-light"  onClick={()=>Unfollow(pic[0].postedBy._id)}>Following
                      </button> : <button className="btn waves-effect waves-light white" onClick={()=>Follow(pic[0].postedBy._id)}>Follow </button>):(<i className="material-icons siz p " >love</i>)}
        </>)
    }
}
    return(
        <div>
            <div className="picdis" style={{borderBottom:"2px solid pink"}}>
                <div>
                  {Cat()} 
            <br></br>
            <button data-target="modal1" class="btn modal-trigger waves-effect waves-light ">Update Profile Pic</button>
                </div>
                <div className="disc">
                   {state?<h4>{state.name}</h4>:<h4>nothing</h4>} 
                   {(pic.length>0)?<h6>{pic[0].postedBy.email}</h6>:<h6>nothing</h6>}
                    <div className="details">
                    <h6>{pic.length} posts</h6>
                    {Fol()} 
                     </div>
                </div>
            </div>
            <div className="gallery">
               {
     
                    pic.map(item=>{
        return (<img className="gall" src={item.photo}/>)
           
                })}
             </div>
           <div id="modal1" class="modal modal-fixed-footer" ref={upload}>
    <div className="modal-content">
      <h2 className="brand-logo color">Update Profile Picture</h2>
       <div class = "file-field input-field">
                  <div class = "btn">
                     <span>Browse</span>
                     <input type = "file" onChange={(e)=>setProf(e.target.files[0])}/>
                  </div>
                  <div class = "file-path-wrapper">
                     <input class = "file-path validate" type = "text"
                        placeholder = "Upload picture" />
                  </div>
               </div>
            <button className="btn waves-effect waves-light" onClick={()=>postProfile()}>post
                </button>
                
    </div>
    <div className="modal-footer">
      <a  class="modal-close waves-effect waves-green btn-flat">Close</a>
    </div>
  </div>  
  </div>

    )
}

export default Profile;