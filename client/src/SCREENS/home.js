import React,{useState,useEffect,useContext} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
import M from 'materialize-css';
import {userContext} from '../App'

const Home =()=>{
    const {state,dispatch}=useContext(userContext)
    const[data,setData]=useState([]);
    const[comment,setComment]=useState("");
    let newData=[]
    useEffect(
         ()=>{
        fetch("/home",{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem('jwt')
        },
        
    }).then(res=>res.json())
    .then(datas=>{
        setData(datas)}
   )
    .catch(err=>console.log(err))}
    ,[])

    const Delete=(id)=>{
        fetch(`/delete/${id}`,{
            method:"post",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem('jwt')
        },
        
    }).then(res=>res.json())
   .then(shre=>{
            if(shre.error){
                return( M.toast({html:shre.error,classes:"#f44336 red"}))
                 }
             else{
                 M.toast({html:shre.message,classes:"#4caf50 green"});
                window.location.reload()
             }}).catch(err=>console.log(err))
            }

            const Likes=(id)=>{
                fetch(`/like/${id}`,{
                    method:"post",
                 headers:{
                     "Authorization":"Bearer "+localStorage.getItem('jwt'),
                 },
                
                }).then(res=>res.json())
                .then(no=>
                    { 
                        newData=data.map(ite=>{//You could have simply sent the whole of no into setData but while liking you are only making changes in one post so there's no need of changing literally everything which further will hang the screen and will act as windows.location.reload stuff
                            if(ite._id===no._id){
                                return no
                            }
                            else{
                                return ite
                            }
                        });setData(newData)
                        
                    })
                    .catch(err=>console.log(err))
            }

            const Unlikes=(id)=>{
                fetch(`/unlike/${id}`,{
                    method:"post",
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem('jwt'),
                    },
                }).then(res=>res.json())
                .then(no=>
                    { 
                        newData=data.map(ite=>{//You could have simply sent the whole of no into setData but while liking you are only making changes in one post so there's no need of changing literally everything which further will hang the screen and will act as windows.location.reload stuff
                            if(ite._id===no._id){
                                return no
                            }
                            else{
                                return ite
                            }
                        });setData(newData)
                    })
                    .catch(err=>console.log(err))
            }

            const Comments=(name,id,comment,ids)=>{
                fetch("/comment",{
                    method:"post",
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem('jwt'),
                         "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        name,
                        comment:comment,
                        id,
                        ids
                    })
                }).then(res=>res.json())
                .then(no=>
                    {  
                        if(no.error){
                            return( M.toast({html:no.error,classes:"#f44336 red"}))
                        }
                        newData=data.map(ite=>{//You could have simply sent the whole of no into setData but while liking you are only making changes in one post so there's no need of changing literally everything which further will hang the screen and will act as windows.location.reload stuff
                            
                        if(ite._id===no._id){
                                return no
                            }
                            else{
                                return ite
                            }
                        });setData(newData)
                        setComment("")
                    })
                    .catch(err=>console.log(err))
            }

           const Del=(comm,id)=>{
               fetch("/del",{
                   method:"post",
                   headers:{
                        "Authorization":"Bearer "+localStorage.getItem('jwt'),
                         "Content-Type":"application/json"
                   },
                   body:JSON.stringify({
                       comm:comm,
                       id:id
                   })
               }).then(res=>res.json())
                .then(no=>
                    { 
                        newData=data.map(ite=>{//You could have simply sent the whole of no into setData but while liking you are only making changes in one post so there's no need of changing literally everything which further will hang the screen and will act as windows.location.reload stuff
                            if(ite._id===no._id){
                                return no
                            }
                            else{
                                return ite
                            }
                        });setData(newData)
                    })
                    .catch(err=>console.log(err))
           }
           
    return(
        <div className="home">
            {
                data.map(item=>{
                    let pro="/profile/"+item.postedBy._id
                    return(
                        <div className="card home-card">
                <div className="wrappy">
                    <div>
                       <Link to={pro}><img className="UserPic" src={item.postedBy.profilepic}/></Link> 
                    </div>
                    <div>
                        <h5 className="UserName">{item.postedBy.name}{
                           (item.postedBy._id===state._id)&& (data.indexOf(item)!=(data.length-1)) && (item.postedBy._id!==item.postedBy.lon) && (<i className="material-icons p" style={{position:"absolute",right:"5px"}} onClick={()=>Delete(item._id)}>delete</i>) }
                        </h5>
                        <h6>{item.postedBy.email}</h6>
                    </div>
                    </div>
                <div className="card-image">
                 <img src={item.photo}/>
                </div>
                <div className="card-content">
                    {((item.likes).includes(state._id)?<i className="material-icons siz p" onClick={()=>Unlikes(item._id)} >favorite</i>: <i className="material-icons siz " onClick={()=>Likes(item._id)} >favorite_border</i> )}
                    <h6>{item.likes.length} Likes</h6>
                   <h6>{item.tittle}</h6>
                 <p>{item.body}</p>
                 {
                    //remember map is a function only for arrays and not for objects
                     item.appreciate.map(shre=>{
                         return(
                                <div>
                               {(state.name===shre.name)&&(<i className="material-icons siz p " onClick={()=>Del(shre.comments,item._id)} style={{float:"right"}}>close</i>)} 
                               <h6><span className="user-name">{shre.name}</span> {shre.comments}</h6>
                                </div>
                         )
                     })
                 }
                <input type="text" placeholder="Add comment" value={comment} onChange={(e)=>setComment(e.target.value)}/> <i className="material-icons siz p" onClick={()=>Comments(state.name,item._id,comment,state._id)} >add_circle</i>
                <br></br>
                </div>
                </div>
            
    )}) }
    </div>) 
                }
export default Home;