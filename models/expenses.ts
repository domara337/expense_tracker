import pool from "../config/db.js";

//types
export type Expense={
    id:number;
    description:string;
    amount:number;
    expense_date:Date;
    user_id:number;
    category_id:number|null;
    created_at:Date;
    updated_at:Date;
}

//type for inserting expense
export type CreateExpenseInput={
description:string;
amount:number;
expense_date:Date;
user_id:number;
category_id?:number|null;
}

//type for updating expense
export type UpdateExpenseInput={
    description?:string;
    amount?:number;
    expense_date?:Date;
    user_id?:number;
    category_id?:number|null;
}


//function to get all expenses
export const getAllExpenses=async():Promise<Expense[]>=>{

    const result=await pool.query("SELECT * FROM expenses");

    return result.rows;

}