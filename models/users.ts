import pool from "../config/db.js";

// ------------------------------
// Types
// ------------------------------
export type User = {
  id: number;
  name: string;
  email: string;
  created_at: Date;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string; // hashed password
};

export type UpdateUserFields = {
  name?: string;
  email?: string;
  password?: string; // hashed password
};

// ------------------------------
// Get all users
// ------------------------------
export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users"
  );
  return result.rows;
};

// ------------------------------
// Find user by ID
// ------------------------------
export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0] || null;
};

// ------------------------------
// Find user by email (for login)
// ------------------------------
export const findUserByEmail = async (email: string): Promise<(User & { password: string }) | null> => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  return result.rows[0] || null;
};

// ------------------------------
// Create a new user
// ------------------------------
export const createUser = async ({
  name,
  email,
  password,
}: CreateUserInput): Promise<User> => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
    [name, email, password]
  );
  return result.rows[0];
};

// ------------------------------
// Update user by ID
// ------------------------------
export const updateUserById = async (
  id: number,
  updates: UpdateUserFields
): Promise<User> => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) throw new Error("No fields to update");

  const setClause = fields.map((field, index) => `${field}=$${index + 1}`).join(", ");
  const query = `UPDATE users SET ${setClause} WHERE id=$${fields.length + 1} RETURNING id, name, email, created_at`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

// ------------------------------
// Delete user by ID
// ------------------------------
export const deleteUserById = async (id: number): Promise<{ id: number } | null> => {
  const result = await pool.query(
    "DELETE FROM users WHERE id=$1 RETURNING id",
    [id]
  );
  return result.rows[0] || null;
};

// ------------------------------
// Delete all users
// ------------------------------
export const deleteAllUsers = async (): Promise<{ id: number }[]> => {
  const result = await pool.query("DELETE FROM users RETURNING id");
  return result.rows;
};
