const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    tittle:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    likes:{
        type:Array,
        required:true
    },
    appreciate:[{
    name:{
       type:String,
        required:true
    },
    comments:{
       type:String,
        required:true
    },
    ids:{
        type:String,
        required:true
    }
    }],
    
    photo:{
        type:String ,// becoz we will be providing the URL
        required:true
    },
    postedBy:{
        type:ObjectId, // this is a way of building relationships between Schema
        ref:'User'
    },
   
}, {
        timestamps:true//adds the created time
    })//second argument of schema is used for adding creation time

mongoose.model('Post',postSchema);