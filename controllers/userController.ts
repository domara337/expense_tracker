import { 
    findUserbyEmail,
    createUser,
    getAllUsers,
    getUserbyId,
    updateUserByid,
    deleteUserById
} from "../models/users";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";     
import bcrypt from "bcrypt";



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
export const CreateUser = async (req: Request, res: Response) => {
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


//find user by email
export const getUserbyEmail=async(req:Request,res:Response)=>{
    try{
        const email=req.body.email;

        if(!email){
            return res.status(400).json({message:"Email is required"});
        }

        const user=await findUserbyEmail(email);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({user});

    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Server error"});
    }

}



//get user by id
export const findUserbyId=async(req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);
      

            if(isNaN(id)){
                return res.status(400).json({message:"Invalid user id"});
            }

        const user=await getUserbyId(id);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({user});

    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Server error"});
        

    }
}


//update user
export const updateMe=async(req:Request,res:Response)=>{
    try{

        const userId=req.user?.userId;
        const allowedUpdates=["name","email","password"];
        const updates=Object.keys(req.body);



        //check if userId exists
        if(!userId){
            return res.status(401).json({message:"Unauthorized"});
        }

        //check if updates are valid
        const isValid=updates.every(field=>allowedUpdates.includes(field));

        if(!isValid){
            return res.status(400).json({message:"Invalid updates"});
        }


        //check for valid user
        const user=await getUserbyId(userId);


        if(!user){
            return res.status(404).json({message:"User not found"});
        }   

        //update user
        const updatedData:{[key:string]:any}={};

        for(let key of updates){
            updatedData[key]=req.body[key];
        }


        //if update includes password, hash it before saving
        if(req.body.password){
            updatedData.password=await bcrypt.hash(req.body.password,10);
        }

        const newUserData=await updateUserByid(userId,updatedData);

        delete newUserData.password;
        return res.status(200).json({message:"User updated successfully",user:newUserData});






    }

    catch(error){
     res.status(500).json({message:"Server error"});
    }

}



//delete user
export const deleteMe=async(req:Request,res:Response)=>{
    try{
        const userId=req.user?.userId;

        if(!userId){
            return res.status(401).json({message:"Unauthorized"});
        }

        const deletedUser=await deleteUserById(userId);


        if(!deletedUser){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({message:"User deleted successfully"});



    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Server error"});
    }

}


//delete user by id (admin only)
export const delUserbyId=async(req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({message:"Invalid user id"});
        }

        const deletedUser=await deleteUserById(id);

        if(!deletedUser){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({message:"User deleted successfully"});

    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Server error"});
    }
}
