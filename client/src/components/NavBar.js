import React,{useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';
import '../App.css';
import {userContext} from '../App';
import M from 'materialize-css';

const Render=()=>{
const{state,dispatch}=useContext(userContext);
const history=useHistory();

if(state){
  return ([ <li><Link to="/search"><span className="material-icons c" >search</span></Link> </li>,
  <li><Link to="/profile"><span className="material-icons c ">person</span></Link></li>,
        <li><Link to="/createPost"><span className="material-icons c">add_box</span></Link></li>,
      <li><span className="c material-icons "  onClick={()=>{
  localStorage.clear();
  dispatch({type:"CLEAR"});
  history.push('/signin')
}} >power_settings_new</span></li> ])
  
}
else{
  return ([    <li ><Link to="/signup">Signup</Link></li>,/*We replaced anchor tag with Link because in Anc everytime the page is refreshed whereas the link does everything dynamically */
        <li ><Link to="/signin">Signin</Link></li>])
}
}


const NavBar=()=>{
  const{state,dispatch}=useContext(userContext);
  const history=useHistory();
    return(
      <div className="navbar-fixed">
         <nav>
<div className="nav-wrapper ">
  {state?<Link to='/home' className="brand-logo left" >SP</Link>: <Link to='/signin' className="brand-logo left" >SpeakingPixels</Link>}
     
      <ul id="nav-mobile " className="right navbar-nav " >
       {Render()}
        </ul>
    </div>
        </nav>
     
  </div>

      
        
    
    )
}

export default NavBar;