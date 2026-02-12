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

export const getExpenseById=async(id:number):Promise<Expense|null>=>{
    const result=await pool.query("SELECT * FROM expenses WHERE id=$1",[id]);
    return result.rows[0];
}

//function to create expense
export const createExpense=async(
    expense:CreateExpenseInput
):Promise<Expense>=>{
    const result=await pool.query(
        "INSERT INTO expenses (description,amount,expense_date,user_id,category_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [expense.description,expense.amount,expense.expense_date,expense.user_id,expense.category_id]
    );
    return result.rows[0];
}   

//delete expense by id
export const deleteExpenseById=async(id:number):Promise<void>=>{
    await pool.query("DELETE FROM expenses WHERE id=$1",[id]);
}

//update expense by id
// Update expense by id
export const updateExpenseById = async (
  id: number,
  fields: UpdateExpenseInput
): Promise<Expense | null> => {
  const setClause = Object.keys(fields)
    .map((key, index) => `${key}=$${index + 2}`)
    .join(", ");
  const values = Object.values(fields);
  const result = await pool.query(
    `UPDATE expenses SET ${setClause}, updated_at=NOW() WHERE id=$1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0] || null;
};