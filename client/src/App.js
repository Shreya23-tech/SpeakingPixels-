import React,{useEffect,createContext,useReducer,useContext} from 'react';
import NavBar from './components/NavBar';
import {BrowserRouter , Route, useHistory} from 'react-router-dom';
import Home from './SCREENS/home';
import Signin from './SCREENS/signin';
import Profile from './SCREENS/profile';
import Signup from './SCREENS/signup';
import CreatePost from './SCREENS/createPost';
import User from './SCREENS/user';
import Search from './SCREENS/search';
import Reset from './SCREENS/reset';
import Resets from './SCREENS/reset-password';
import {reducer,initialState} from './reducers/userReducers';


 export const userContext=createContext();

function Routing(){
  const history=useHistory();
  //const dispatch=useDispatch();
  const {state,dispatch}=useContext(userContext)
  
  useEffect(()=>{
   const user=JSON.parse(localStorage.getItem("user"))
   if(user){
    dispatch({type:"USER",payload:user})
   }
   else{
     if(!history.location.pathname.startsWith('/reset')){
       history.push('/signin')
     }
     
   }
  },[])
  return(
  <>{/** This tag helps to only activate one route at a time */}
    <Route path="/home">{/* We need to write exact because if we do not do that then the backslash as is included everywhere so home will come along with all profile,etc */}
       <Home/>
    </Route>
    <Route path="/signin">
      <Signin/>
    </Route>
    <Route exact path="/profile">
      <Profile/>
    </Route>
    <Route path="/profile/:userid">
      <User/>
    </Route>
    <Route path="/search">
      <Search/>
    </Route>
    <Route path="/reset">
      <Reset/>
    </Route>
    <Route path="/reset-password/:token">
      <Resets/>
    </Route>
    <Route path="/signup">
      <Signup/>
    </Route>
    <Route path="/createPost">
      <CreatePost/>
    </Route>
  </>  )
}
function App() {
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <userContext.Provider value={{state:state,dispatch:dispatch}}>
    <BrowserRouter>
    <NavBar/>
    <Routing/>
    </BrowserRouter>
    </userContext.Provider>
    );
}

export default App;
