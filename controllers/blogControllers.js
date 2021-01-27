const Blog = require('../models/Blogs');
const checkLogin = require('../middleware/middleware');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

//gets all blogs
module.exports.blogs_get = async (req , res) => {
    const blogs = await Blog.find({})
    try {
        res.json({
            blogs
        })
    } catch (err) {
        res.json({
            type : error
        })
    }
}

//gets one blog with given title
module.exports.blogs_getSingle = async (req, res ) => {
    
    const blog = await Blog.findById(req.params.id)
    if ( blog ) {
        res.json ({
            blog
        })
    } else {
        res.json({
            type : error
        })
    }
}    


//create new blog
module.exports.blogs_create = async (req, res) => {
    checkLogin(req.token);
    const {title , body} = req.body;
        if (title == null || body == null) {
            res.json ({
                msg : 'please fill in the blanks'
            })
        } else {
            //ifelse
            // const {image} = req.files;
            // image.mv(path.resolve(__dirname , 'public' , ))
            const blog = await Blog.create({title , body});

        res.json({
            blog , 
            msg: 'Successfully created this new blog'
        })
    }
}

//edits existing blog
module.exports.blogs_edit = async (req ,res ) => {
    
checkLogin(req.token);
    console.log(req.params.id);
    const requestedId = req.params.id;
    const {newTitle , newBody } = req.body;
    const found = await Blog.findById({_id : requestedId});
    if (found) {
        //edit blog here
        try {
        await Blog.updateOne({_id : requestedId} , { $set: {title : newTitle, body : newBody } })
        res.json({
            msg : 'Your blog has been edited' ,
            newTitle , newBody
        })} catch(err) {
            console.log(err);
        }
        } else {
            res.json({
            error : 'This blog with title was not found'
       })
    } 
} 


//deletes existing blog with title
module.exports.blogs_delete = async (req,res) => {
    checkLogin(req.token);
    const blog = await Blog.findOne({_id : req.params.id});
    if (blog) {
        try {
            await Blog.deleteOne(blog);
            res.json ({
                type : 'success' 
            })
        } catch (err) {
            console.log(err)
        }
    } else {
        res.json({
            type : 'error'
        })
    } 
} 

module.exports.blogAddComment = async (req,res) => {
    checkLogin(req.token);
    req.data = jwt.verify(req.token , process.env.JWTsecret );
    const blog = Blog.findById(req.params.id);
    if (blog) {
        try{
        console.log(req.data.user._id);
        const comment = await Comment.create({comment : req.body.comment , by : req.data.user._id});
       await Blog.updateOne({_id : req.params.id} , {$push : {comment}})
       res.json({
           msg : 'Your comment has been updated'
       })
     } catch(err) {
         console.log(err);
         res.json({
             error : 'could not comment'
         })
     }
    }
}

module.exports.blogLiked = async (req, res) => {
    checkLogin(req.token);
    req.data = jwt.verify(req.token , process.env.JWTsecret );
    const blog = Blog.findById(req.params.id);
    if (blog) {
        try {
            await Blog.updateOne({_id : req.params.id} , {$push : {likes : req.data.user._id}})
            res.json({
                msg : 'you have liked the blog'
            })
        } catch(err) {
            console.log(err);
            res.json ( {
                msg : 'something went wrong'
            })
        }
    } else {
        res.json({
            error : 'blog was not found'
        })
    }
} 

module.exports.blogUnliked = async (req, res) => {
    checkLogin(req.token);
    req.data = jwt.verify(req.token , process.env.JWTsecret );
    const blog = Blog.findById(req.params.id);
    if (blog) {
        try {
            await Blog.updateOne({_id : req.params.id} , {$pull : {likes : req.data.user._id}})
            res.json({
                msg : 'you have un-liked the blog'
            })
        } catch(err) {
            console.log(err);
            res.json ( {
                msg : 'something went wrong'
            })
        }
    } else {
        res.json({
            error : 'blog was not found'
        })
    }
} 


