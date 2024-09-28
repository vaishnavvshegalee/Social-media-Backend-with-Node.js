const { blogs, createBlog, deleteBlog, updateBlog, getByUserId } = require('../controllers/blog-controller');

const blogRouter = require('express').Router();

// blog routes
blogRouter.get('/getAllBlogs',blogs);
blogRouter.post('/create-blog',createBlog);
blogRouter.delete('/delete-blog/:id',deleteBlog);
blogRouter.put('/update-blog/:id',updateBlog);
blogRouter.get('/user/:id',getByUserId)

module.exports = blogRouter;