import Notes from "../models/notes.model.js";
import TeacherUpload from "../models/teacherUpload.model.js";
import Subject from "../models/subject.model.js";
import Test from "../models/test.model.js";
import Result from "../models/result.model.js";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import { summarizePDF } from "../services/gemini.services.js";

const branchRegexEscape = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ── Upload Note with AI Integration ── */
export const uploadNote = async (req, res) => {
  try {
    const { title, description, section, subject, branch, semester } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 🔥 Step 1: Extract Text from PDF
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text;

    // 🔥 Step 2: Generate AI Summary, KeyPoints, and Questions
    let aiInsights = { summary: "", keyPoints: [], questions: [] };
    try {
      aiInsights = await summarizePDF(extractedText);
    } catch (aiError) {
      console.error("AI Insights Error:", aiError.message);
      // Continue without AI if it fails, but log it
    }

    // 🔥 Step 3: Save to TeacherUpload Model
    const newNote = await TeacherUpload.create({
      title,
      description,
      fileUrl: file.path, 
      subject,
      section,
      branch,
      semester,
      uploadedBy: req.userId,
      onModel: req.role === "admin" ? "Admin" : "Teacher",
      summary: aiInsights.summary,
      keyPoints: aiInsights.keyPoints,
      questions: aiInsights.questions,
    });

    res.status(201).json({ 
      message: "Note uploaded and analyzed successfully", 
      note: newNote 
    });
  } catch (error) {
    console.error("Upload Note Error:", error);
    res.status(500).json({ message: "Failed to upload and analyze note" });
  }
};

/* ── Get Shared Notes for Students ── */
export const getSharedNotes = async (req, res) => {
  try {
    const { branch, semester } = req.query;
    
    // Safety check with logging
    const branchStr = branch ? String(branch).trim() : null;
    const semStr = semester ? String(semester).trim() : null;

    console.log(`[getSharedNotes] User Query: Branch: ${branchStr}, Sem: ${semStr}`);

    let queryNodes = { onModel: { $in: ["Teacher", "Admin"] } };
    let queryTeacherUpload = {};

    if (branchStr) {
      const branchRegex = { $regex: new RegExp(`\\b${branchRegexEscape(branchStr)}\\b`, "i") };
      queryNodes.branch = branchRegex;
      queryTeacherUpload.branch = branchRegex;
    }

    if (semStr) {
      queryNodes.semester = semStr;
      queryTeacherUpload.semester = semStr;
    }

    const [notesUnifiedRaw, notesTeacherUploadRaw] = await Promise.all([
      Notes.find(queryNodes).populate("uploadedBy", "role").lean(),
      TeacherUpload.find(queryTeacherUpload).populate("uploadedBy", "role").lean()
    ]);

    // Same strict role logic as Management Table and getMyUploads
    const allNotesRaw = [...notesUnifiedRaw, ...notesTeacherUploadRaw].filter(note => {
      const uploaderRole = note.uploadedBy?.role;
      const isTeacherOrAdmin = (note.onModel === "Teacher" || note.onModel === "Admin" || uploaderRole === "teacher" || uploaderRole === "admin");
      return isTeacherOrAdmin && note.onModel !== "UserModel";
    });

    allNotesRaw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`[getSharedNotes] Found ${allNotesRaw.length} verified shared notes.`);
    res.json(allNotesRaw);
  } catch (error) {
    console.error("Get Shared Notes Error:", error);
    res.status(500).json({ message: "Failed to fetch shared notes" });
  }
};

/* ── Get My Uploads / Shared Notes ───────────────── */
export const getMyUploads = async (req, res) => {
  try {
    let queryNotesUnified = {};
    let queryTeacherUpload = {};

    if (req.role === "teacher") {
      queryNotesUnified = { uploadedBy: req.userId };
      queryTeacherUpload = { uploadedBy: req.userId };
    } else {
      const { branch, semester, subject } = req.query;
      
      const branchStr = branch ? String(branch).trim() : null;
      const semStr = semester ? String(semester).trim() : null;

      console.log(`[getMyUploads] Student Query: Branch: ${branchStr}, Sem: ${semStr}, Subject: ${subject}`);

      queryNotesUnified = { onModel: { $in: ["Teacher", "Admin"] }, user: { $exists: false }, title: { $not: /AWS/i } };
      queryTeacherUpload = {};

      if (branchStr) {
        const branchMatch = { $regex: new RegExp(`\\b${branchRegexEscape(branchStr)}\\b`, "i") };
        queryNotesUnified.branch = branchMatch;
        queryTeacherUpload.branch = branchMatch;
      }

      if (semStr) {
        queryNotesUnified.semester = semStr;
        queryTeacherUpload.semester = semStr;
      }

      if (subject) {
        const subRegex = { $regex: new RegExp(`^${String(subject).trim()}$`, "i") };
        queryNotesUnified.subject = subRegex;
        queryTeacherUpload.subject = subRegex;
      }
    }

    const [notesUnifiedRaw, notesTeacherUploadRaw] = await Promise.all([
      Notes.find(queryNotesUnified).populate("uploadedBy", "role").lean(),
      TeacherUpload.find(queryTeacherUpload).populate("uploadedBy", "role").lean()
    ]);

    // Role-based filtering to EXCLUSIVELY match Admin Dashboard's "Uploaded by Teacher" labels
    const allNotesRaw = [...notesUnifiedRaw, ...notesTeacherUploadRaw].filter(note => {
      const uploaderRole = note.uploadedBy?.role;
      const isTeacherOrAdmin = (note.onModel === "Teacher" || note.onModel === "Admin" || uploaderRole === "teacher" || uploaderRole === "admin");
      
      // Specifically filter out student content even if it's in a shared collection
      return isTeacherOrAdmin && note.onModel !== "UserModel";
    });

    allNotesRaw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allNotesRaw);
  } catch (error) {
    console.error("Get Notes Error:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

/* ── Delete Note ────────────────── */
export const deleteUpload = async (req, res) => {
  try {
    let note = await Notes.findOne({
      _id: req.params.id,
      uploadedBy: req.userId
    });
    let ModelToDelete = Notes;

    if (!note) {
      note = await TeacherUpload.findOne({
        _id: req.params.id,
        uploadedBy: req.userId
      });
      ModelToDelete = TeacherUpload;
    }

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Delete the file from disk if path exists
    if (note.fileUrl && fs.existsSync(note.fileUrl)) {
      fs.unlinkSync(note.fileUrl);
    }

    await ModelToDelete.deleteOne({ _id: note._id });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete Note Error:", error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

/* ── View/Download File ───────────── */
export const viewUploadFile = async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      note = await TeacherUpload.findById(req.params.id);
    }

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const absolutePath = path.resolve(note.fileUrl);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found on disk" });
    }

    res.download(absolutePath, note.title + ".pdf");
  } catch (error) {
    console.error("View File Error:", error);
    res.status(500).json({ message: "Failed to retrieve file" });
  }
};

/* ── Add Subject ──────────────────── */
export const addSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const exists = await Subject.findOne({
      name: name.trim(),
      createdBy: req.userId
    });

    if (exists) {
      return res.status(409).json({ message: "Subject already exists" });
    }

    const subject = await Subject.create({
      name: name.trim(),
      createdBy: req.userId
    });

    res.status(201).json({ message: "Subject added", subject });
  } catch (error) {
    console.error("Add Subject Error:", error);
    res.status(500).json({ message: "Failed to add subject" });
  }
};

/* ── Get Subjects ─────────────────── */
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ createdBy: req.userId })
      .sort({ createdAt: -1 });

    res.json(subjects);
  } catch (error) {
    console.error("Get Subjects Error:", error);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

/* ── Delete Subject ───────────────── */
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await Subject.deleteOne({ _id: subject._id });

    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    res.status(500).json({ message: "Failed to delete subject" });
  }
};

/* ── Dashboard Stats ──────────────── */
export const getDashboardStats = async (req, res) => {
  try {
    const [notesCount, teacherUploadsCount] = await Promise.all([
      Notes.countDocuments({ uploadedBy: req.userId }),
      TeacherUpload.countDocuments({ uploadedBy: req.userId })
    ]);
    const totalUploads = notesCount + teacherUploadsCount;

    const totalSubjects = await Subject.countDocuments({
      createdBy: req.userId
    });
    
    // Expanded Stats
    const totalTests = await Test.countDocuments({ createdBy: req.userId });
    
    // For Average Score, we need to average all results of tests created by this teacher
    const teacherTests = await Test.find({ createdBy: req.userId }, '_id');
    const testIds = teacherTests.map(t => t._id);
    
    const results = await Result.find({ testId: { $in: testIds } });
    const totalResults = results.length;
    let avgScore = 0;
    if (totalResults > 0) {
      const sum = results.reduce((acc, curr) => acc + curr.score, 0);
      const totalPossible = results.reduce((acc, curr) => acc + (curr.totalQuestions || 10), 0);
      avgScore = Math.round((sum / totalPossible) * 100);
    }

    const studentsAttempted = await Result.distinct('studentId', { testId: { $in: testIds } });

    // Count per section
    const sectionCounts = await Notes.aggregate([
      { $match: { uploadedBy: req.userId } },
      { $group: { _id: "$section", count: { $sum: 1 } } }
    ]);

    res.json({
      totalUploads,
      totalSubjects,
      totalTests,
      avgScore,
      studentsAttemptedCount: studentsAttempted.length,
      sections: sectionCounts
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

/* ── Get Students ────────────────── */
export const getStudents = async (req, res) => {
  try {
    // In this system, "UserModel" with role "user" are students
    const UserModel = (await import("../models/user.model.js")).default;
    const students = await UserModel.find({ role: "user" }).select("name email branch semester");
    res.json(students);
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* ── Get Results for Teacher's Tests ── */
export const getTeacherResults = async (req, res) => {
  try {
    const teacherTests = await Test.find({ createdBy: req.userId }, '_id');
    const testIds = teacherTests.map(t => t._id);
    
    const results = await Result.find({ testId: { $in: testIds } })
      .populate('studentId', 'name email branch semester')
      .populate('testId', 'title companyName branch semester')
      .sort({ submittedAt: -1 });
      
    res.json(results);
  } catch (error) {
    console.error("Get Teacher Results Error:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};

/* ── Code Execution (Judge0) ───────── */
export const runCode = async (req, res) => {
  try {
    const { sourceCode, language } = req.body;
    
    // Mapping frontend IDs to Judge0 IDs
    const languageMap = {
      'cpp': 54,
      'java': 62,
      'python': 71,
      'javascript': 63,
      'c': 50,
      'go': 60,
      'rust': 73
    };

    const languageId = languageMap[language] || 63;
    const axios = (await import("axios")).default;

    const response = await axios.post("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
      source_code: sourceCode,
      language_id: languageId,
      stdin: ""
    });

    const { stdout, stderr, compile_output, message, status } = response.data;

    res.json({
      stdout: stdout || "",
      stderr: stderr || compile_output || message || "",
      status: status?.description || "Completed"
    });

  } catch (error) {
    console.error("Code Execution Error:", error.message);
    res.status(500).json({ 
      message: "Code execution failed", 
      error: error.response?.data?.message || error.message 
    });
  }
};
