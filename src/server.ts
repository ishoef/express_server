import express, { request, Request, Response } from "express";
import { Pool, Result } from "pg";
import config from "./config";
import logger from "./middleware";

const app = express();
const port = config.port;

// parse middleware
app.use(express.json());

// for form data
// app.use(express.urlencoded());

// connect to database
const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) UNIQUE NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("hello Ismail, How are you");
});

// Users CRUD --------------------
// Post Data
app.post("/users", async (req: Request, res: Response) => {
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

// GEt Data
app.get("/users", async (req: Request, res: Response) => {
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

// GET User by id
app.get("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not found",
      });
    } else {
      res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    }

    console.log(result.rows);
  } catch (err) {
    console.log(err);
  }
});

// Update User by id
app.put("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user Updated Successfully",
        data: result.rows[0],
      });
    }

    console.log(result.rows);
  } catch (err) {
    console.log(err);
  }
});

// Delete User by id
app.delete("/users/:id", async (req: Request, res: Response) => {
  const id = req.params?.id;

  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

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
});

// todos CRUD
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
