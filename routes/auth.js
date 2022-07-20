const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model('User');
const Post=mongoose.model('Post');
const crypto=require('crypto');//it is a library already present in node
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys');
const {API_KEY}=require('../config/keys');
const {EMAIL}=require('../config/keys');
const requirelog=require('../middlewares/requirelogin');
const bodyParser=require('body-parser');
const nodemailer=require('nodemailer');
const sendgrid=require('nodemailer-sendgrid-transport')

const trans=nodemailer.createTransport(sendgrid({
    auth:{
        api_key:API_KEY
    }
}))

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.post('/signup',(req,res)=>{
    
    const{name,email,password}=req.body;
    if(!name || !email || !password){// ! this means if it is empty
       
        return res.status(422).json({error:'Please add all the fields'});
    }
    if(name.indexOf(' ')>=0){
       return res.json({error:"Please use hyphens instead of spaces"})
    }
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;//regex for validating email
    if(!re.test(email)){
        return res.json({error:'invalid email id'})
    }
       User.findOne({email:email})
      .then(savedUser=>{
          if(savedUser){
               return res.status(422).json({error:'User with this email already exisits'});// We should always add the return keyword to the error so that the code further is not executed
          }
          User.findOne({name:name})
          .then(nam=>{
              if(nam){
                  return res.json({error:'This Username has already been taken!'})
              }
          })
           bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user=new User({
                  name:name,
                  email:email,
                  password:hashedpassword
              })
              user.save()
              .then(user=>{
                  if(user){
                      trans.sendMail({
                          to:user.email,
                          from:"pixelsspeaking@gmail.com",
                          subject:"Signup Success",
                          html:`<h1>Welcome to SpeakingPixels! </h1>
                                <p>Thankyou ${user.name} for believing in us. We hope you have a great journey with us ahead.</p>
                                <h6>SpeakingPixels teams.</h6> `
                      })
                      res.json({message:"Successfully Signed Up!"})
                      const post=new Post({
                          tittle:`Welcome! ${name}`,
                          body:"We believe that 'Every picture says a story. Now it all depends on the viewer what it could be.' Now as we start this journey where 'Every Pixel Speaks', we wish you all the very best and we hope that in future you may have a great collection of pictures to remind you of beautiful stories of your golden past. Thankyou for believing in us.",
                          postedBy:user,
                          photo:"data:image/jpeg;base64,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"
                      })
                      post.save()
                      .catch(err=>console.log(err))
                  }
                  else{
                      return res.json({error:"Try Again Later!"})
                  }
              }).catch((err)=>{
                  console.log(err);
              })})
              
          
      }).catch((err)=>{
          console.log(err);
      })
    
})

router.post('/signin',(req,res)=>{
    const{email,password}=req.body;
    console.log(email);
    if(!email || !password){
        return res.status(422).json({error:'Please fill all the fields'});
         
    }
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;//regex for validating email
    if(!re.test(email)){
        return res.json({error:'invalid email id'})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.json({error:"Please sign up first"});
             
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET);
                const{_id,name,email}=savedUser
                res.json({token,user:{_id,name,email},message:"Successfully Signed In!"})
            }
            else{
                 res.json({error:"Invalid email or password"});
                 return
            }
        })
    })
})

router.post('/reset',(req,res)=>{
     crypto.randomBytes(32,(err,buffer)=>{
         if(err){
             return console.log(err)
         }
         const token=buffer.toString("hex")//buffer is in the form of hexadecimal so we need to convert it in the string form
         User.findOne({email:req.body.email})
         .then(user=>{
             if(!user){
                 return res.json({error:"User does not exist"})
             }
             user.resetToken=token
             user.expireToken=Date.now()+3600000//time is in milisecond so as I want the link to be valid only for one hour so use hour in milliseconds
             user.save()
             .then(result=>{
                 if(result){
                     trans.sendMail({
                         to:user.email,
                         from:"pixelsspeaking@gmail.com",
                         subject:"Password Reset",
                         html:`<h3>Click on the following link to reset the password.</h3>
                                <h4>Remember the link will work for only 1 hour</h4>
                                <a href="${EMAIL}/reset-password/${token}">Reset Password</a>`
                     })
                 }res.json({message:"Check Your Email for the Reset Link"})
             }) 
         })
     })
 }) 

 router.post('/resets',(req,res)=>{
     const {token,password}=req.body;
     bcrypt.hash(password,12)
     .then(hashedpassword=>{
              User.findOne({resetToken:token,expireToken:{$gt:Date.now()}})//$gt means greater than
              .then(result=>{
                  if(!result){
                      return res.json({error:"Session Expired! Try Again Later"})
                  }
                  result.password=hashedpassword
                  result.resetToken=undefined
                  result.expireToken=undefined
                  result.save()
                  .then(da=>
                     res.json({message:"Successfully Password Resetted!"})
                    )
                 
              }).catch(err=>console.log(err))
     })
    
 })
module.exports=router;//so that all the routers whether get or post can be used for all in app.js

//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