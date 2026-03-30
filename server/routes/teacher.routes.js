import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
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
// ⚠️ IMPORTANT: Specific routes MUST come before generic :id routes to avoid conflicts
router.get("/notes/view/:id", isAuth, viewUploadFile);  // Specific: view note by ID
router.get("/shared-notes", isAuth, getSharedNotes);    // Specific: get shared notes
router.get("/notes", isAuth, getMyUploads);             // General: get my uploads/shared
router.delete("/notes/:id", isAuth, isTeacher, deleteUpload);

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
