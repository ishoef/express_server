import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";

const router = express.Router();
const { createUser, getUser, getSingleUser } = userControllers;

// POST a user
router.post("/", createUser);

// GET all Users
router.get("/", getUser);

// GEt single user
router.get("/:id", getSingleUser);

export const userRotues = router;
