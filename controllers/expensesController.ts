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


