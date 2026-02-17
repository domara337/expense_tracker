import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserbyEmail,createUser } from "../models/users";
import { Request, Response } from "express";
const saltedRounds:number=10;


// ================= REGISTER USER =================
export const registerUser=async(req:Request,res:Response)=>{
        const {name,email,password}=req.body;
    try{

        const exists=await findUserbyEmail(email);

        if(exists){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,saltedRounds);
    
        const user=await createUser(name,email,hashedPassword);

        res.status(201).json({message:"User created successfully",id:user.id, name:user.name,email:user.email});


    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Server error"});
    }

}

// ================= LOGIN USER =================
export const LoginUser=async(req:Request,res:Response)=>{


    const {email,password}=req.body;


    try{
        const user=await findUserbyEmail(email);

        //check if user exists
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }

        //compare passwords
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch) return res.status(400).json({message:"Invalid email or password"});

        //create jwt token
        const token=jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{expiresIn:"1h"});
        return res.status(200).json({message:"Login successful",token});

    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Server error"});
    }

}
    