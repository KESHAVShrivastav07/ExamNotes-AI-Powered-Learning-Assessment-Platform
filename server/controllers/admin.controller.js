import UserModel from "../models/user.model.js";
import Teacher from "../models/teacher.model.js";
import Notes from "../models/notes.model.js";
import TeacherUpload from "../models/teacherUpload.model.js";
import StudentNote from "../models/studentNote.model.js";
import Test from "../models/test.model.js";
import Result from "../models/result.model.js";

const requireAdmin = (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  return null;
};

/* ── Platform Stats ────────────────── */
export const getAdminStats = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const [studentsCount, teachersCount, testsCount, notesCount, tUploadCount, sUploadCount] = await Promise.all([
      UserModel.countDocuments({ role: "user" }),
      Teacher.countDocuments(),
      Test.countDocuments(),
      Notes.countDocuments(),
      TeacherUpload.countDocuments(),
      StudentNote.countDocuments()
    ]);

    return res.status(200).json({
      students: studentsCount,
      teachers: teachersCount,
      tests: testsCount,
      notes: notesCount + tUploadCount + sUploadCount
    });
  } catch (error) {
    console.error("getAdminStats error", error);
    return res.status(500).json({ message: "Could not fetch stats" });
  }
};

/* ── User Management ────────────────── */
export const getAllUsers = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const users = await UserModel.find({ role: "user" })
      .select("name email branch semester credits createdAt")
      .lean();

    const usersWithStats = await Promise.all(users.map(async (user) => {
      const results = await Result.find({ studentId: user._id });
      const avgScore = results.length > 0 
        ? (results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / results.length).toFixed(1)
        : "0.0";

      return {
        ...user,
        averageScore: avgScore,
        testsAttempted: results.length
      };
    }));

    return res.status(200).json(usersWithStats);
  } catch (error) {
    console.error("getAllUsers error", error);
    return res.status(500).json({ message: "Could not fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    await UserModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

export const updateUser = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Update failed" });
  }
};

/* ── Teacher Management ──────────────── */
export const getAllTeachers = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const teachers = await Teacher.find().select("name email role createdAt").lean();
    
    const teachersWithStats = await Promise.all(teachers.map(async (teacher) => {
      const [testsCount, notesCount, tUploadCount] = await Promise.all([
        Test.countDocuments({ createdBy: teacher._id }),
        Notes.countDocuments({ uploadedBy: teacher._id }),
        TeacherUpload.countDocuments({ uploadedBy: teacher._id })
      ]);

      return {
        ...teacher,
        testsCreated: testsCount,
        notesUploaded: notesCount + tUploadCount,
        department: "Engineering"
      };
    }));

    return res.status(200).json(teachersWithStats);
  } catch (error) {
    console.error("getAllTeachers error", error);
    return res.status(500).json({ message: "Could not fetch teachers" });
  }
};

export const deleteTeacher = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    await Teacher.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

/* ── Test Management ────────────────── */
export const getAllTests = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const tests = await Test.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(tests);
  } catch (error) {
    return res.status(500).json({ message: "Fetch tests failed" });
  }
};

export const deleteTest = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    await Test.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

/* ── Notes Management ───────────────── */
export const getAllNotes = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    // 1. Fetch from ALL THREE collections
    const [notesUnified, notesTeacherUpload, notesStudentUpload] = await Promise.all([
      Notes.find().populate("uploadedBy", "name role").populate("user", "name role").lean(),
      TeacherUpload.find().populate("uploadedBy", "name role").lean(),
      StudentNote.find().populate("user", "name role").lean()
    ]);

    // 2. Converge them into one unified list
    const allNotesRaw = [...notesUnified, ...notesTeacherUpload, ...notesStudentUpload];
    
    // Sort by createdAt descending
    allNotesRaw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const processedNotes = allNotesRaw.map(note => {
      let label = "Created by Student";
      const uploader = note.uploadedBy || note.user;
      const role = uploader?.role;

      // Handle uploaderLabel based on collection or data
      if (note.onModel === "Teacher" || role === "teacher") {
        label = "Uploaded by Teacher";
      } else if (note.onModel === "Admin" || role === "admin") {
        label = "Uploaded by Admin";
      } else {
        label = "Created by Student";
      }
      
      return {
        ...note,
        title: note.title || note.topic || "Untitled Note",
        uploaderLabel: label,
        uploaderName: uploader?.name || "Unknown"
      };
    });

    return res.status(200).json(processedNotes);
  } catch (error) {
    console.error("Fetch notes error:", error);
    return res.status(500).json({ message: "Fetch notes failed" });
  }
};

export const deleteNote = async (req, res) => {
  const forbidden = requireAdmin(req, res);
  if (forbidden) return forbidden;

  try {
    const id = req.params.id;
    // Attempt deletion in all possible collections
    await Promise.allSettled([
      Notes.findByIdAndDelete(id),
      TeacherUpload.findByIdAndDelete(id),
      StudentNote.findByIdAndDelete(id)
    ]);

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};
