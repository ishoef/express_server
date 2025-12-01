import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();
const { createUser, getUser, getSingleUser, updateUser, deleteUser } =
  userControllers;

// POST a user
router.post("/", createUser);

// GET all Users
router.get("/", getUser);

// GEt single user
router.get("/:id", getSingleUser);

// Udpate User by id
router.put("/:id", updateUser);

// Delete User by id
router.delete("/:id", deleteUser);

export const userRotues = router;
