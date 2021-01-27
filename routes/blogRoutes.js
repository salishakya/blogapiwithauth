const { Router } = require('express');
const blogController = require('../controllers/blogControllers');
const { verifyToken } = require('../validation/validation');
const multer = require('multer');
  
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

const blogRouter = Router();

blogRouter.get('/getAllBlogs' , blogController.blogs_get);

blogRouter.get('/getSingleBlog/:id' , blogController.blogs_getSingle);

blogRouter.post('/createBlog' , upload.single('blogImage'),  verifyToken ,blogController.blogs_create);

blogRouter.post('/editBlog/:id' ,   upload.single('newBlogImage') , verifyToken , blogController.blogs_edit);

blogRouter.delete('/deleteBlog/:id' , verifyToken , blogController.blogs_delete);

blogRouter.post('/addComment/:id' ,  verifyToken , blogController.blogAddComment);

blogRouter.put('/likeBlog/:id' ,  verifyToken , blogController.blogLiked);

blogRouter.put('/unlikeBlog/:id' ,  verifyToken , blogController.blogUnliked);

module.exports = blogRouter;
