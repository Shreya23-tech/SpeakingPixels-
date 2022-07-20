const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const {MONGOURI}=require('./config/keys');

require('./models/user');// way of registering Schema Modles
require('./models/post');
const auth=require('./routes/auth');
const post=require('./routes/post');
app.use(auth);
app.use(post);

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get("*",(req,res)=>{//* means wildcard means all
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
mongoose.connect(MONGOURI,{useNewUrlParser:true, useUnifiedTopology:true})
{
    mongoose.connection.on('connected',()=>{
        console.log("Connected Successfully to mongo Yeah!");
    })
     mongoose.connection.on('error',(err)=>{
        console.log("Error Connecting",err);
    })
    mongoose.set('useFindAndModify', false);
}
app.listen(process.env.PORT||3001,function(){
    console.log("Server connected to port 3001");
})