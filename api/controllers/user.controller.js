import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res)=>{
    res.json({message: "API is working"})
}

export const updateUser = async (req, res, next)=>{
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update user'))
    }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400, 'Password must be atleast 6 characters'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length >20 ){
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username must not include space'))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(erroeHandler(400, 'Username must be lowercase'))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return (next(errorHandler(400, 'Username can only contain letters and numbers')))
        }
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set :{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
        },{new: true})
        const {password, ...rest} = updatedUser._doc
        res.status(200).json(rest)
    }
    catch(err){
        next(err)
    }
}

export const deleteUser = async (req, res, next)=>{
    if(!req.user.id){
        return next(errorHandler(403, "Unauthorized"))
    }
    try{
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json({message: "User deleted successfully"})
    }
    catch(err){
        next(err)
    }
}

export const signout = (req, res, next)=>{
    try{
        res.clearCookie('access_token').status(200).json('User has been signed out')
    }
    catch(err){
        next(err)
    }
}