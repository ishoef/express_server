import express, { request, Request, Response } from "express";
import { Pool, Result } from "pg";
import config from "./config";
import logger from "./middleware/middleware";
import initDB, { pool } from "./config/db";
import { userRotues } from "./modules/user/user.routes";

const app = express();
const port = config.port;

// parse middleware
app.use(express.json());

// for form data
// app.use(express.urlencoded());

// DB initializing
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("hello Ismail, How are you");
});

// Users CRUD ---------------
app.use("/users", userRotues);



// todos CRUD -------------------------------------------
// POST Todos
app.post("/todos", logger, async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );

    res.status(201).json({
      success: true,
      message: "Todo Created",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
    console.log(err.message);
  }
});

// GET All todos
app.get("/todos", logger, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    res.status(200).json({
      success: true,
      message: "All Data Get Successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
});

// GET todo by Id
app.get("/todos/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
    res.status(200).json({
      success: true,
      message: "todo get by id",
      data: result.rows,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "todo not get",
    });
  }
});

// UPDATE todo by id
app.put("/todos/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET title=$1 WHERE ID=$2 RETURNING *`,
      [title, id]
    );

    res.status(200).json({
      success: true,
      message: "Update the title of todo",
      data: result.rows,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "do not update the todo",
    });
  }
});

// DELETE todo by id
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const id = req.params?.id;
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);
    if (result.rowCount !== 0) {
      res.status(200).json({
        success: true,
        message: "the deleted successfully",
        data: result.rows,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "not found the todo",
      });
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found the todo",
    });
  }
});

// Not Found Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    messsage: "Route Not Found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Server is listening on the port ${port}`);
});
