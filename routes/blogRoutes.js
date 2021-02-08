const { Router } = require('express');
const blogController = require('../controllers/blogControllers');
const { verifyToken } = require('../validation/validation');
const multer = require('multer');
const Blog = require('../models/Blogs') 
  
const storage = multer.diskStorage({
    destination : function(req, file , cb) {
        cb(null , '../blogapiwithauth/public');
    },
    filename : function(req,file,cb) {
        cb(null , file.originalname);
    }
  });
  
  const fileFilter = (req , file , cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null , true);
    } else {
    cb(new Error('must be jpeg or png') , false);
    }
  }
  
  const upload = multer({
    storage : storage ,
    limits : {
        fileSize : 1024 * 1024 * 20
    },
    fileFilter : fileFilter
  }); 

  function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  }

const blogRouter = Router();

blogRouter.get('/Blogs' ,  paginatedResults(Blog) , blogController.blogs_get);

blogRouter.get('/getSingleBlog/:id' , blogController.blogs_getSingle);

blogRouter.post('/Blogs/search' , blogController.blogs_search);

blogRouter.post('/createBlog' , upload.single('blogImage'),  verifyToken , blogController.blogs_create);

blogRouter.put('/editBlog/:id' ,   upload.single('newBlogImage') , verifyToken , blogController.blogs_edit);

blogRouter.delete('/deleteBlog/:id' , verifyToken , blogController.blogs_delete);

blogRouter.post('/addComment/:id' ,  verifyToken , blogController.blogAddComment);

blogRouter.delete('/deleteComment/:id' , verifyToken , blogController.blogDeleteComment); 

blogRouter.put('/editComment/:id' ,  verifyToken , blogController.blogEditComment);

blogRouter.put('/likeBlog/:id' ,  verifyToken , blogController.blogLiked);

blogRouter.put('/unlikeBlog/:id' ,  verifyToken , blogController.blogUnliked);

module.exports = blogRouter;
