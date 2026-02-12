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

//find category by id
export const findCategoryById=async(id:number):Promise<Category|null>=>{
    const result=await pool.query("SELECT * FROM categories WHERE id=$1", 
        [id]
    );

    return result.rows[0] || null;

}


//create a new category
export const createCategory=async({
    name,
}:CreateCategoryInput):Promise<Category>=>{
    const result=await pool.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING *",
        [name]
    );
    return result.rows[0];
};


//delete category by id
export const deleteCategoryById=async(id:number):Promise<void>=>{
    await pool.query("DELETE FROM categories WHERE id=$1",[id]);
}


//update category by id
export const updateCategoryById=async(
    id:number,
    fields:updateCategoryFields
):Promise<Category|null>=>{
    const setClause=Object.keys(fields)
    .map((key,index)=>`${key}=$${index+2}`)
    .join(",");
    const values=Object.values(fields);
    const result=await pool.query(
        `UPDATE categories SET ${setClause} WHERE id=$1 RETURNING *`,
        [id,...values]
    );
    return result.rows[0] || null;
};