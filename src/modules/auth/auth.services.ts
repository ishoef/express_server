import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return `no user found for this email ${email}`;
  }

  const user = result.rows[0];
  const matchPass = await bcrypt.compare(password, user.password);

  if (!matchPass) {
    return "Password not match";
  }

  // Create JWT
  const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";
  const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, secret, {
    expiresIn: "7d",
  });

  console.log("token: ", { token });
  return { token, user };
};

export const authServices = {
  loginUser,
};
