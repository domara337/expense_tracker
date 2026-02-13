import pool from "../config/db";


//types
export type Budget={
    id:number;
    user_id:number;
    month:number;
    year:number;
    amount:number;
    created_at:Date;
}

//type for creating budget
export type CreateBudgetInput={
    month:number;
    year:number;
    amount:number;
    user_id:number;
}

//type for updating budget
export type UpdateBudgetInput={
    month?:number;
    year?:number;
    amount?:number;
    user_id?:number;
}



//function to get all budgets
export const getAllBudgets=async():Promise<Budget[]>=>{

const result=await pool.query("SELECT * FROM budgets");

return result.rows;
}
