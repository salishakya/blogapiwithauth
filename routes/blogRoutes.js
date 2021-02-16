const { Router } = require('express');
const blogController = require('../controllers/blogControllers');
const isLoggedin = require('../middleware/middleware');
const Blog = require('../models/Blogs'); 
const upload = require('../multer');
const {paginatedResults} = require('../middleware/middleware');

const blogRouter = Router();

blogRouter.get('/blogs' , paginatedResults(Blog) , blogController.blogs_get);

blogRouter.post('/Blogs/search' , blogController.blogs_search);

blogRouter.post('/createBlog' , isLoggedin ,upload.single('blogImage'),  blogController.blogs_create);

blogRouter.route('/blog/:id').put(upload.single('newBlogImage') , isLoggedin , blogController.blogs_edit)
          .delete( isLoggedin , blogController.blogs_delete)
          .get(blogController.blogs_getSingle)

blogRouter.post('blog/:id/comment', isLoggedin , blogController.blogAddComment);

blogRouter.route('/blog/:blog_id/comment/:comment_id').delete(isLoggedin , blogController.blogDeleteComment)
.put( isLoggedin , blogController.blogEditComment);

blogRouter.put('/likeBlog/:id' ,  isLoggedin , blogController.blogLiked);

blogRouter.put('/unlikeBlog/:id' ,  isLoggedin , blogController.blogUnliked);

module.exports = blogRouter;
