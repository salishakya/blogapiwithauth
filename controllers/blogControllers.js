const Blog = require('../models/Blogs');
const checkLogin = require('../middleware/middleware');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

//gets blogs paginated
exports.blogs_get = async (req , res) => {
    res.json(res.paginatedResults)
}

//filtering searching 
exports.blogs_search = async ( req, res ) => {
    const cursor = await Blog.find({$text : {$search : req.body.search}},'title blogImage')
    res.json(cursor); 
}

//gets one blog with given title
exports.blogs_getSingle = async (req, res ) => {
    
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
exports.blogs_create = async (req, res) => {
    console.log(req.file);
    const {title , body} = req.body;
    const blogImage = req.file.path; 
    console.log(blogImage);
        if (title == null || body == null) {
            res.json ({
                msg : 'please fill in the blanks'
            })
        } else {
            const blog = await Blog.create({title , body , blogImage});
            console.log(blog);
        res.json({
            blog , 
            msg: 'Successfully created this new blog'
        })
    }
}

//edits existing blog
exports.blogs_edit = async (req ,res ) => {
    
    console.log(req.params.id);
    const requestedId = req.params.id;
    const {newTitle , newBody } = req.body;
    const newBlogImage = req.file.path;
    const found = await Blog.findById({_id : requestedId});
    if (found) {
        //edit blog here
        try {
        await Blog.updateOne({_id : requestedId} , { $set: {title : newTitle, body : newBody , blogImage : newBlogImage} })
        res.json({  
            msg : 'Your blog has been edited' ,
            newTitle , newBody , newBlogImage
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
exports.blogs_delete = async (req,res) => {
    req.data = jwt.verify(req.token , process.env.JWTsecret );
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

exports.blogAddComment = async (req,res) => {
    req.data = jwt.verify(req.token , process.env.JWTsecret );
    const blog = Blog.findById(req.params.id);
    if (blog) {
        try{
        console.log(req.data.user._id);
        const comment = await Comment.create({comment : req.body.comment , by : req.data.user._id});
       await Blog.updateOne({_id : req.params.id} , {$push : {comment}})
       await Blog.updateOne({_id : req.params.id} , {$inc : {noOfComment: 1}})
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

//doesn't take token
exports.blogDeleteComment = async (res, req) => {
    req.data = jwt.verify(req.token , process.env.JWTsecret );
    console.log(req.data);
    const blog = await Blog.findById({_id : req.params.id});
    const commentid = await Comment.findById({_id : req.params.commentid});
    if (blog) {
    try {
        await Comment.findByIdAndDelete({_id : commentid});
        await Blog.updateOne({_id : req.params.id} , {$pull : {comment : commentid}});
        await Blog.updateOne({_id : req.params.id} , {$inc : {noOfComment: -1}})
    } catch(err) {
        console.log(err);
        res.json({
            error : 'could not delete your comment'
        })
        }    
    }
}

exports.blogEditComment = async (req, res) => {

    const blog = await Blog.findOne({_id : req.params.id});
    console.log(`${blog.comment[0].comment}`);
    const comment = await Comment.findOne({_id : req.params.commentid});
    if (blog && comment) {
        try {
       const newComment = await Comment.findOneAndUpdate({_id : req.query.commentid} , {$set : {comment : req.body.comment}} , {new : true})
       await Comment.findByIdAndDelete({_id : req.query.commentid})
       await Blog.updateOne({_id : req.params.id} , {$pull : {comment}})
       await Blog.updateOne({_id : req.params.id} , {$push : {comment : newComment}})
        res.json({
            msg : 'updated'
        }) } catch(err) {
            res.json({err : 'not updated'})
        }
    } else {
        res.json({err : 'blog or comment not found'})
    }
}

//error : UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'sendStatus' of undefined
exports.blogLiked = async (req, res) => {
    req.data = jwt.verify(req.token , process.env.JWTsecret );
    const blog = await Blog.findById(req.params.id);

for (const index in blog.likes) {
    const found = await Blog.findOne({likes : `${blog.likes[index]}`});
    if (blog && !found) {
        try {
                await Blog.updateOne({_id : req.params.id} , {$push : {likes : req.data.user._id}})
                await Blog.updateOne({_id : req.params.id} , {$inc : {noOfLikes : 1}})
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
                error : 'blog was not found or you have already liked'
            })
        }  
    }
} 

exports.blogUnliked = async (req, res) => {
    req.data = jwt.verify(req.token , process.env.JWTsecret );
    const blog = Blog.findById(req.params.id);
    for (const index in blog.likes) {
        const found = await Blog.findOne({likes : `${blog.likes[index]}`});    
        if (blog && found) {
            try {
                await Blog.updateOne({_id : req.params.id} , {$pull : {likes : req.data.user._id}})
                await Blog.updateOne({_id : req.params.id} , {$inc : {noOfLikes : -1}})
                res.json({
                    msg : 'you have un-liked the blog'
                })
            } catch(err) {
                console.log(err);
                res.json ( {
                    msg : 'something went wrong / could not update'
                })
            }
        } else {
            res.json({
                error : 'blog was not found or you havenot liked yet'
            })
        }
    } 
}


