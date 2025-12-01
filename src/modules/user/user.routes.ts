import express, { Request, Response } from "express";
import { pool } from "../../config/db";

const router = express.Router();

// POST a user
router.post("/", async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, email } = req?.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );

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
});

// GET all Users
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Users Get Successfully",
      data: result.rows,
    });
  } catch (err: any) {
    console.log(err.message);
  }
});

export const userRotues = router;
