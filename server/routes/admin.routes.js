import express from "express";
import isAuth from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/roleBase.js";
import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  updateUser,
  getAllTeachers,
  deleteTeacher,
  getAllTests,
  deleteTest,
  getAllNotes,
  deleteNote
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(isAuth, isAdmin);

// Stats
router.get("/stats", getAdminStats);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

// Teachers
router.get("/teachers", getAllTeachers);
router.delete("/teachers/:id", deleteTeacher);

// Tests
router.get("/tests/all", getAllTests); // Using /all to avoid conflict with other routes if any
router.delete("/tests/:id", deleteTest);

// Notes
router.get("/notes/all", getAllNotes);
router.delete("/notes/:id", deleteNote);

export default router;
