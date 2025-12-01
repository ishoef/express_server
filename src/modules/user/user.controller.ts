import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.services";

const createUser = async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, email } = req?.body;

  try {
    const result = await userServices.createUser(name, email);

    console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Data Inserted Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
    console.log(err.message);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();
    res.status(200).json({
      success: true,
      message: "Users Get Successfully",
      data: result.rows,
    });
  } catch (err: any) {
    console.log(err.message);
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await userServices.getSingleUser(id!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user found",
        data: result.rows[0],
      });
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email } = req.body;

  try {
    const result = await userServices.updateUser(name, email, id!);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found for update",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params?.id;

  try {
    const result = await userServices.deleteUser(id!);

    console.log(result);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found for deleting",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        data: result.rows,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const userControllers = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
