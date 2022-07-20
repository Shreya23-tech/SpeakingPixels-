const jwt=require("jsonwebtoken");
const mongoose=require('mongoose');
const {JWT_SECRET}=require('../config/keys');
const User=mongoose.model('User');

module.exports=(req,res,next)=>{
   const {authorization}=req.headers;
   if(!authorization){
       res.status(401).json({error:'You must be logged in'});
       return
   }
   //const tok= JSON.stringify(req.body.token);
   const token=authorization.replace("Bearer ","");
   //console.log(typeof(tok),typeof(token),)
  // console.log(tok)
   //console.log(token)
   //console.log(req)
  /*jwt.verify(token,tok,(err,payload)=>{
       if(err){
           console.log("not match") did not match because in headers the format is not string whereas in body it is in json format that is stringify
       }
       else{
           console.log("match")
       }
   })*/
   jwt.verify(token,JWT_SECRET,(err,payload)=>{
       if(err){
            res.status(404).json({error:"You must be logged in"});
            return
       }
       const {_id}=payload;
       User.findById(_id).then(userdata=>{
           req.user=userdata;
           next();
       })

   })

}