import pool from "../config/db";


import { Request, Response } from "express";
import { CreateExpenseInput, UpdateExpenseInput, getAllExpenses, getExpenseById, createExpense, deleteExpenseById } from "../models/expenses";



//get all expenses
export const getExpenses=async(req:Request,res:Response)=>{
    try{

        const expenses=await getAllExpenses();

        return res.status(200).json({expenses});

    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Server error"});
        
    }

}


//get expense by id
export const getExpense=async(req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);

        //validate id
        if(isNaN(id)){
            return res.status(400).json({message:"Invalid expense id"});
        }

        //get expense query
        const expense=await getExpenseById(id);

        //check if expense exists
        if(!expense){
            return res.status(404).json({message:"Expense not found"});
        }

        return res.status(200).json({expense});

    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Server error"});
    }
    
    }