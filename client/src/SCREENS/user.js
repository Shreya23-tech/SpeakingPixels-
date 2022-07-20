import React,{useState,useEffect,useContext} from 'react';
import '../App.css';
import {useParams} from 'react-router-dom';
import {userContext} from '../App';
import M from 'materialize-css';

const User =()=>{
const {state,dispatch}=useContext(userContext);  
const [pic,setPic]=useState([]);
 const {userid}=useParams()

useEffect(
   
    ()=>{
        fetch(`/mypost/${userid}`,{
          headers: {
              "Authorization":"Bearer "+localStorage.getItem('jwt')
          }
        }).then(res=>res.json())
        .then(shre=>{
         setPic(shre)
        })
         .catch(err=>console.log(err))}
,[])

const Cat=()=>{
   
    if(pic.length>0){
return(<img src={pic[0].postedBy.profilepic} className="ProfPic"/>)
}
    }
    

const Follow=(id)=>{
    
    fetch(`/follow/${id}`,{
        method:"post",
        headers:{
             "Authorization":"Bearer "+localStorage.getItem('jwt'),
             "Content-Type":"application/json",
        }
        
    }).then(res=>res.json())
    .then(data=>{
        if(data){
            window.location.reload();
        }
        else{
            return( M.toast({html:"Try Again Later!",classes:"#f44336 red"}))
        }
    }).catch(err=>console.log(err))
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
    }).then(res=>res.json())
    .then(data=>{
        if(data){
            window.location.reload();
        }
        else{
            return( M.toast({html:"Try Again Later!",classes:"#f44336 red"}))
        }
    }).catch(err=>console.log(err))
}

const Fol=()=>{
    if(pic.length>0){
        return(<>
        <h6>{pic.length} posts</h6>
       <h6>{pic[0].postedBy.followers.length} followers</h6>
        <h6>{pic[0].postedBy.following.length} following</h6>
        <br/>
        
            </>
  )
    }
}
const But=()=>{
    if(pic.length>0){
        return(<div>
           {(state._id!=pic[0].postedBy._id)?((pic[0].postedBy.followers).includes(state._id)? <button className="btn waves-effect waves-light"  onClick={()=>Unfollow(pic[0].postedBy._id)}>Following<i className="material-icons siz " >check</i>
 </button> : <button className="btn waves-effect waves-light white" onClick={()=>Follow(pic[0].postedBy._id)}>Follow </button>):(<i className="material-icons siz p " >love</i>)}
       </div> )
    }
}

    return(
        <div>
            <div className="picdis" style={{borderBottom:"2px solid pink"}}>
                <div>
                  {Cat()} 
                  {But()}
            <br></br>
                   
                </div>
                <div className="disc">
                   {(pic.length>0)?<h4>{pic[0].postedBy.name}</h4>:<h4>Loading</h4>} 
                   {(pic.length>0)?<h6>{pic[0].postedBy.email}</h6>:<h6>nothing</h6>}
                    <div className="details">
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
             
  </div>
    )
}

export default User;