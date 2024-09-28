const { default: mongoose } = require("mongoose");
const BlogModel = require("../model/BlogModel");
const UserModel = require("../model/UserModel");

const blogs = async(req,res,next)=>{
    try {
        let blog = await BlogModel.find();
        if(!blog){
            return res.status(404).json({messgae:'blogs not found!'});
        }
        return res.status(200).json({messgae:'Blogs fetched successfully',blog});
    } catch (error) {
        return res.status(500).json({err:error});
    }
}

const createBlog = async(req,res,next)=>{
    try {
        const {title,description,image,user} = req.body;
        const existingUser = await UserModel.findById(user);
        if(!existingUser){
            return res.status(500).json({messgae:`Unable to find User by ${user} id`})
        }
        let blog = await BlogModel.create({
            title,
            description,
            image,
            user
        });
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
        return res.status(201).json({message:'Blog created succeessfully',blog});

    } catch (error) {
        return res.status(500).json(error);
    }
}
const deleteBlog = async (req,res,next)=>{
    try {
        const id = req.params.id;
      
        let blog = await BlogModel.findByIdAndDelete(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        if(!blog){
            return res.status(404).json({message:'blog not found!'});
        }
        return res.status(200).json({message:'blog deleted successfully',blog});
    } catch (error) {
        return res.status(500).json({err:error.message});
    }
}

const updateBlog = async(req,res,next)=>{
    try {
        const blogId = req.params.id;
        const {title,description} = req.body;
        const blog = await BlogModel.findByIdAndUpdate(blogId,{
            title,
            description
        },{new:true});
        if(!blog){
            return res.status(500).json({message:'Unable to update!'});
        }
        return res.status(200).json({message:'Blog updated',blog});
    } catch (error) {
        return res.status(500).json(error)
    }
}

const getByUserId = async(req,res,next)=>{
    try {
        const id = req.params.id;
        const userBlogs = await UserModel.findById(id);
        const blogs = userBlogs.blogs;
        if(!userBlogs){
            return res.status(404).json({messgae:'Cannot find blog with this user id'});
        }
        return res.status(200).json({message:'blog fetched successfully',blogs});
    } catch (error) {
        return res.status(500).json({err:error.message})
    }
}
module.exports = {
    blogs,
    createBlog,
    deleteBlog,
    updateBlog,
    getByUserId
};