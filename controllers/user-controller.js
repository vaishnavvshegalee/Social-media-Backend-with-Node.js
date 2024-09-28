const UserModel = require("../model/UserModel")
const bcrypt = require('bcrypt');
const getAllUsers = async(req,res,next)=>{
    try {
        let users = await UserModel.find();
        console.log(users);
        if(!users){
           return res.status(404).json({message:'Not found!'});
        }
       return res.status(200).json({users,message:'Users fetched successfully'});
    } catch (error) {
        res.status(500).json({err:error});
    }
}

const createUser = async(req,res,next)=>{
    try {
        const {name,email,password,blogs} = req.body;
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists! Login instead'});
        }else{
        const hashedPass = bcrypt.hashSync(password,10);
        const newUser = new UserModel({
            name,
            email,
            password:hashedPass,
            blogs:[]
        })
      
        await newUser.save();
        return res.status(201).json({message:"User created successfully",newUser});
        }
    } catch (error) {
        res.status(500).json({err:error});
    }
}
const removeUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
       return res.status(500).json({ err: error });
    }
};

const updateUser = async(req,res,next)=>{
    try {
        const userId = req.params.id;
        const {email,name,password,blogs} = req.body;
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            name,
            email,
            password,
            blogs
        },{new:true});
        if(!updateUser){
            return res.status(500).json({message:'Unable to update!'});
        }
        return res.status(200).json({message:'User updated',updateUser})
    } catch (error) {
        return res.status(500).json(error);
    }
}

const login = async(req,res,next)=>{
    try {
        const {email,password} = req.body;
        let existingUser = await UserModel.findOne({email});
        if(!existingUser){
            return res.status(404).json({message:'Cannot find user'});
        }
        const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:'Incorrect password!'});
        }
        return res.status(200).json({message:'Login successfully'})
    } catch (error) {
        return res.status(500).json({err:error});
    }
}
 
module.exports = {
    getAllUsers,
    createUser,
    removeUser,
    updateUser,
    login
};