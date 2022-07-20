import React,{useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import '../App.css';
import M from 'materialize-css';

const Search =()=>{
     const history=useHistory()
 const[search,setSearch]=useState("")
 const [list,setList]=useState([])
     const Searches=(srch)=>{
         setSearch(srch)
         fetch(`/search/${srch}`,{
             method:"get",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer "+localStorage.getItem('jwt')
             },
         }).then(res=>res.json()) //this form helps to parse into the data's json part
         .then(shre=>{
            if(shre.error){
                return( M.toast({html:shre.error,classes:"#f44336 red"}))
                 
             }
             else{
                setList(shre)
             }
              
            
     }).catch(err=>{console.log(err)})
    }
    return(
        <div className="mycard">
            <div className="card card-sign">
        <h3 className="brand-logo color">Search</h3>
      <input type="text" placeholder="Search Users" value={search} onChange={(e)=>{Searches(e.target.value)}}></input>
      <ul className="collection">
          {list.map(item=>{
              let lin=`/profile/${item._id}`
         return (<li className="collection-item" > <Link to={lin}><img className="UserPic" src={item.profilepic}/></Link> {item.name}</li>)
          })}
       </ul>
        
    </div>
    </div>
    
    )
}

export default Search;