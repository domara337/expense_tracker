import { 
    findUserbyEmail,
    createUser,
    getAllUsers,
    getUserbyId
} from "../models/users";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";



// ================= GET CURRENT USER =================
export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        // 🔹 Check if userId exists (important)
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await getUserbyId(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


// ================= GET ALL USERS =================
export const getUsers = async (req: Request, res: Response) => {
    try {

        const users = await getAllUsers();

        return res.status(200).json({ users });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


// ================= REGISTER USER =================
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await findUserbyEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //create a new user
        const newUser=await createUser(name,email,password);

       if(!newUser){
        return res.status(400).json({message:"Failed to create user"});

       }

         return res.status(201).json({message:"User created successfully",user:newUser});

  

   

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
