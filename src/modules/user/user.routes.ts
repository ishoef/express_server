import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";

const router = express.Router();
const { createUser, getUser } = userControllers;

// POST a user
router.post("/", createUser);

// GET all Users
router.get("/", getUser);

export const userRotues = router;
