const { Router } = require('express');
const blogController = require('../controllers/blogControllers');
const { verifyToken } = require('../validation/validation');

const blogRouter = Router();

blogRouter.get('/getAllBlogs' , blogController.blogs_get);

blogRouter.get('/getSingleBlog/:id' , blogController.blogs_getSingle);

blogRouter.post('/createBlog' ,  verifyToken ,blogController.blogs_create);

blogRouter.post('/editBlog/:id' ,  verifyToken , blogController.blogs_edit);

blogRouter.delete('/deleteBlog/:id' , verifyToken , blogController.blogs_delete);

blogRouter.post('/addComment/:id' ,  verifyToken , blogController.blogAddComment);

blogRouter.put('/likeBlog/:id' ,  verifyToken , blogController.blogLiked);

blogRouter.put('/unlikeBlog/:id' ,  verifyToken , blogController.blogUnliked);

module.exports = blogRouter;
