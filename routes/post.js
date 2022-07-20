const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Post=mongoose.model('Post');
const User=mongoose.model('User');
const requireLogin=require('../middlewares/requirelogin');

router.get('/home',requireLogin,(req,res)=>{
    Post.find() 
    .populate("postedBy","name email profilepic lon")//2nd arg selects the field we want to get
    .sort('-createdAt')
    .then(posts=>{
        res.json(posts);
    })
    .catch(err=>{
        console.log(err);
    })// now in posts the postedby object is only showing the objectID so to get all the stuff we need to populate it.
})

router.post('/delete/:postId',requireLogin,(req,res)=>{

      /* Post.findById(req.params.postId)
       .exec((err,post)=>{
           if(err || !post){
               res.json({error:err})
           }
           else{
               post.remove()
           }
       }).then(da=>{
           if(da){
               res.json({message:"Successfully deleted!"})
           }
           else{
               res.json({error:"Try later"})
           }
       }).catch(err=>console.log(err))*/

       Post.findByIdAndDelete(req.params.postId, function (err, docs) { 
    if (err){ 
        res.json({error:err}) 
    } 
    else{ 
        res.json({message:"Successfully deleted!"})
    } 
}); 
    })
    
router.post('/createPost',requireLogin,(req,res)=>{
    const{tittle,body,pic}=req.body;
    if(!tittle || !body || !pic){
         res.status(422).json({error:"Please add all the fields"});
         return    
        }
    const post=new Post({
        tittle:tittle,
        body:body,
        postedBy:req.user,
        photo:pic,
    })
    post.save()
    .then(result=>{
        if(result){
            res.json({message:"Successfully posted!"})
        }
        else{
            res.json({error:"There was some error while posting!"})
        }
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name profilepic email followers following")
    .then(mypost=>{
        res.json(mypost);
    }).catch(err=>{console.log(err);})
})

router.post('/like/:likeId',requireLogin,(req,res)=>{//push and pull are mongodb stuff
    
        Post.findByIdAndUpdate(req.params.likeId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","name email profilepic")
    .then(da=>res.json(da))
    .catch(err=>console.log(err))
}
)
    
 
router.post('/unlike/:unlikeId',requireLogin,(req,res)=>{//push and pull are mongodb stuff
    Post.findByIdAndUpdate(req.params.unlikeId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","name email profilepic")
    .then(da=>res.json(da))
    .catch(err=>console.log(err))
})

router.post('/prof',requireLogin,(req,res)=>{
    const{url}=req.body
    if(url===""){
        return res.json({error:"Please select a picture"})
    }
    User.findByIdAndUpdate(req.user._id,{
        $pull:{profilepic:req.user.profilepic}
    },{
        new:true
    })
    User.findByIdAndUpdate(req.user._id,{
        $set:{profilepic:url}
    },{
        new:true
    })
    .then(data=>{
        if(data){
               res.json({message:"Successfully Updated!"})
        }
        else{
            return(res.json({error:"Try Later!"}))
        }
    }).catch(err=>console.log(err))
    }
)
router.post('/comment',requireLogin,(req,res)=>{
    const {comment,name,id,ids}=req.body
    if(!comment){
        return res.json({error:"Please fill the input"})
    }
    Post.findByIdAndUpdate(id,{
        $push:{appreciate:{comments:comment,name:name,ids:ids}}
    },{
        new:true
    }).populate("postedBy","name email profilepic")
    .then(da=>res.json(da))
    .catch(err=>console.log(err))
})
router.post('/follow/:id',requireLogin,(req,res)=>{
    
   User.findByIdAndUpdate(req.user._id,{
      $push:{following:req.params.id}
    },{
        new:true
    }).then(
         User.findByIdAndUpdate(req.params.id,{
        $push:{followers:req.user._id}
    },{
        new:true
    }).then(da=>res.json(da)).catch(err=>console.log(err))
    )
    .catch(err=>console.log(err))

}
   
    
)

router.post('/del',requireLogin,(req,res)=>{
    const{comm,id}=req.body
   Post.findByIdAndUpdate(id,{
       $pull:{appreciate:{comments:comm}}
   },{
       new:true
   }).populate("postedBy","name email profilepic")
   .then(da=>res.json(da))
   .catch(err=>console.log(err))
})
router.get('/mypost/:userid',requireLogin,(req,res)=>{
    Post.find({postedBy:req.params.userid})
    .populate("postedBy","_id name email profilepic followers following")
    .then(mypost=>{
        res.json(mypost);
    }).catch(err=>{console.log(err);})
})
router.get('/search/:query',requireLogin,(req,res)=>{
   let userPattern=new RegExp("^"+req.params.query)//"^" this means all records 
   User.find({name:{$regex:userPattern}})//$regex is the regular expression thing which will return all the records starting with the name written
   .select("name profilepic")
   .then(da=>{
       if(da){
         res.json(da)
    }
    else{
       res.json({error:"No User Found!"})
    }
   }).catch(err=>console.log(err))
})
router.post('/unfollow',requireLogin,(req,res)=>{
         const{id}=req.body
    User.findByIdAndUpdate(req.user._id,{
        $pull:{following:id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            res.json(err)
        }
         User.findByIdAndUpdate(id,{
        $pull:{followers:req.user._id}
    },{
        new:true
    }).then(da=>res.json(da)).catch(err=>console.log(err))}).catch(err=>console.log(err))
    
   
})

module.exports=router;