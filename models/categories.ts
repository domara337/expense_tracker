import pool from "../config/db.js";

//types
export type Category={
    id:number;
    name:string;
    created_at:Date;
}

export type CreateCategoryInput={
    name:string;
}

export type updateCategoryFields={
    name?:string;
}

//get all categories
export const getAllCategories=async():Promise<Category[]>=>{
     
    const result=await pool.query("SELECT * FROM categories");

return result.rows;


}