import { Request, Response } from "express";
import { todoServices } from "./todo.services";

const createTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoServices.createTodo(user_id, title);
    res.status(200).json({
      success: true,
      message: "Todo created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const todoControllers = {
  createTodo,
};
