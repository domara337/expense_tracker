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


//function to get budget by id
export const getBudgetbyId=async(id:number):Promise<Budget|null>=>{
    const result=await pool.query("SELECT * FROM budgets WHERE id=$1",[id]);
    return result.rows[0];
}


//function to create budget
export const createBudget=async(
    Budget:CreateBudgetInput
):Promise<Budget>=>{
    const result=await pool.query(
        "INSERT INTO budgets (month,year,amount) VALUES ($1,$2,$3) RETURNING *",
        [Budget.month,Budget.year,Budget.amount]
    );
    return result.rows[0];
}



//function to delete budget by id
export const deleteBudgetById=async(id:number):Promise<void>=>{
    await pool.query("DELETE FROM budgets WHERE id=$1",[id]);
}


//function to update budget by id
export const updateBudgetById=async(id:number,updates:UpdateBudgetInput):Promise<Budget|null>=>{
    const fields=Object.keys(updates);
    const values=Object.values(updates);

    //create the SET clause dynamically
    const setClause=fields.map((field,index)=>`${field}=$${index+2}`).join(", ");

    //execute the update query
    const result=await pool.query(
        `UPDATE budgets SET ${setClause} WHERE id=$1 RETURNING *`,
        [id,...values]
    );

    return result.rows[0];

}