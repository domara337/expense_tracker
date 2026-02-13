import { findUserbyEmail,createUser,getAllUsers,deleteUserById,getUserbyId,updateUserByid } from "../models/users";
import { Request,Response } from "express";

import jwt from 'jsonwebtoken';



//controller to get a user by id
export const getMe=async(req:Request,res:Response)=>
{
    try{
        //get user id from req.user
        const userId=req.user?.userId;
            
        //db query to get user by id
        const user =await getUserbyId(userId as number);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({user});


    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }
}