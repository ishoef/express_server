import { pool } from "../../config/db";

const createUser = async (name: string, email: string) => {
  const result = await pool.query(
    `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
    [name, email]
  );

  return result;
};

// GET All User
const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

// GEt User by id
const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

// Updata user by id
const updateUser = async (name: string, email: string, id: string) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2 WHERE id = $3 RETURNING *`,
    [name, email, id]
  );

  return result;
};

export const userServices = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
};
