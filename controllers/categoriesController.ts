import pool from "../config/db";
 
import { Request, Response } from "express";

import { CreateCategoryInput, 
    updateCategoryFields,
     getAllCategories,
      findCategoryById, 
      createCategory, 
      deleteCategoryById,
       updateCategoryById } 
       from "../models/categories";


//get all categories
export const getCategories=async(req:Request,res:Response)=>{
    try{
        const categories=await getAllCategories();

        //if no categories found
        if(categories.length===0){
            return res.status(201).json({message:"No categories found"});
    
    
    
    
    
    
        }

        return res.status(200).json({categories});
    }
        catch(error){

            return res.status(500).json({message:"Server error"});

        }

    }


//get category by id
export const getCategory=async(req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);

        //validate id
        if(isNaN(id)){
            return res.status(401).json({message:"No id found"});
        }

        const category=await findCategoryById(id);

        if (!category){
            return res.status(404).json({message:"No category found"})
        }

        //return response
        return res.status(200).json({message:"found category" , category})

    }

    catch(error){
        return res.status(500).json({message:"Server error"})
    }

}