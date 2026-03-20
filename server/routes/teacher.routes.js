import express from "express";
import multer from "multer";
import path from "path";
import isAuth from "../middleware/isAuth.js";
import { isTeacher } from "../middleware/roleBase.js";
import {
  uploadNote,
  getMyUploads,
  deleteUpload,
  viewUploadFile,
  addSubject,
  getSubjects,
  deleteSubject,
  getDashboardStats,
  getSharedNotes,
  getStudents,
  getTeacherResults,
  runCode
} from "../controllers/teacher.controller.js";

const router = express.Router();

/* ── Multer config ──────────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

// ── Notes APIs ───────────────────────
// POST /api/notes/upload -> maps to /api/teacher/notes/upload (via index.js)
router.post("/notes/upload", isAuth, isTeacher, upload.single("file"), uploadNote);
router.get("/notes", isAuth, isTeacher, getMyUploads);
router.get("/shared-notes", isAuth, getSharedNotes);
router.delete("/notes/:id", isAuth, isTeacher, deleteUpload);
router.get("/notes/view/:id", isAuth, isTeacher, viewUploadFile);

// ── Subject APIs ─────────────────────
// POST /api/notes/subjects -> maps to /api/teacher/subjects (via index.js)
router.post("/subjects", isAuth, isTeacher, addSubject);
router.get("/subjects", isAuth, isTeacher, getSubjects);
router.delete("/subjects/:id", isAuth, isTeacher, deleteSubject);

// ── Stats ────────────────────────────
router.get("/stats", isAuth, isTeacher, getDashboardStats);

// ── Student & Result APIs ────────────
router.get("/students", isAuth, isTeacher, getStudents);
router.get("/results", isAuth, isTeacher, getTeacherResults);
router.post("/run-code", isAuth, isTeacher, runCode);

export default router;
