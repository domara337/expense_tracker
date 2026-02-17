import {
  findUserbyEmail,
  getAllUsers,
  getUserbyId,
  updateUserByid,
  deleteUserById,
} from "../models/users";

import { Request, Response } from "express";
import bcrypt from "bcrypt";

// ================= GET CURRENT USER =================
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getUserbyId(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...safeUser } = user;

    return res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL USERS =================
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();

    const safeUsers = users.map(({ password, ...rest }) => rest);

    return res.status(200).json({ users: safeUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET USER BY EMAIL =================
export const getUserbyEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUserbyEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...safeUser } = user;

    return res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET USER BY ID =================
export const findUserbyId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await getUserbyId(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...safeUser } = user;

    return res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE CURRENT USER =================
export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allowedUpdates = ["name", "email", "password"];
    const updates = Object.keys(req.body);

    const isValid = updates.every((field) =>
      allowedUpdates.includes(field)
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    const existingUser = await getUserbyId(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedData: Record<string, string> = {};

    for (const key of updates) {
      updatedData[key] = req.body[key];
    }

    if (req.body.password) {
      updatedData.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await updateUserByid(userId, updatedData);

    if (!updatedUser) {
      return res.status(400).json({ message: "Update failed" });
    }

    const { password, ...safeUser } = updatedUser;

    return res.status(200).json({
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE CURRENT USER =================
export const deleteMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedUser = await deleteUserById(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE USER BY ID (ADMIN ONLY) =================
export const delUserbyId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
