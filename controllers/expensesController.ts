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


    //create expense
    export const createNewExpense=async(req:Request,res:Response)=>{

        try{
            const expenseData:CreateExpenseInput=req.body;

            //validate required fields
            if(!expenseData.description || !expenseData.amount || !expenseData.expense_date || !expenseData.user_id){
                return res.status(400).json({message:"Missing required fields"});
            }

            //create expense query
            const newExpense=await createExpense(expenseData);

            return res.status(201).json({expense:newExpense});

        }
        catch(error){
            console.error(error);
            return res.status(500).json({message:"Server error"});
        }
        }

        //delete expense by id
 export const deleteExpense=async(req:Request,res:Response)=>{
    try{


        const id=Number(req.params.id);

        //validate id
        if(isNaN(id)){
            return res.status(400).json({message:"Invalid expense id"});
        }

        //delete expense query
            const expense_deleted=await deleteExpenseById(id);

        
            return res.status(200).json({message:"Expense deleted successfully"});





    }
    catch(err){
        res.status(500).json({message:"Server error"});
    }

}


//update expense by id
export const updateExpense=async(req:Request,res:Response)=>{
    try{

        //get id from params
        const id=Number(req.params.id);

        //validate id
        if(isNaN(id)){
            return res.status(400).json({message:"Invalid expense id"});
        }
        //get update data from body
        const updateData:UpdateExpenseInput=req.body;

        //build dynamic SET clause
        const fields=Object.keys(updateData);
        const values=Object.values(updateData);

        if(fields.length===0){
            return res.status(400).json({message:"No fields to update"});
        }

        const setClause=fields.map((field,index)=>`${field}=$${index+2}`).join(", ");

        //update expense query
        const updatedExpense=await pool.query(
            `UPDATE expenses SET ${setClause}, updated_at=NOW() WHERE id=$1 RETURNING *`,
            [id,...values]
        );

        if(updatedExpense.rows.length===0){
            return res.status(404).json({message:"Expense not found"});
        }
        return res.status(200).json({expense:updatedExpense.rows[0]});













    }
    catch(err)
{
    res.status(500).json({message:"Server error"});
}
}