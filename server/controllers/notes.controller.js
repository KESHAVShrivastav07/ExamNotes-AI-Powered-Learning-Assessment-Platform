import Notes from "../models/notes.model.js"
import UserModel from "../models/user.model.js"
import TeacherUpload from "../models/teacherUpload.model.js"
import StudentNote from "../models/studentNote.model.js"

export const getMyNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const role = req.role;

        let queryNotes = {
            $or: [{ user: userId }, { uploadedBy: userId }]
        };
        
        // Base query for shared teacher notes
        let sharedQuery = null;

        if (role === "user") {
            const user = await UserModel.findById(userId);
            if (user && user.branch && user.semester) {
                // Include shared notes in unified Notes collection
                queryNotes.$or.push({
                    onModel: { $in: ["Teacher", "Admin"] },
                    branch: { $regex: new RegExp(`^${user.branch.trim()}$`, "i") },
                    semester: user.semester.trim(),
                    title: { $not: /AWS/i },
                    user: { $exists: false }
                });
                
                // Query for TeacherUpload collection
                sharedQuery = {
                    branch: { $regex: new RegExp(`^${user.branch.trim()}$`, "i") },
                    semester: user.semester.trim()
                };
            }
        }

        const fetchPromises = [
            Notes.find(queryNotes).select("title topic subject section summary onModel uploadedBy user branch semester createdAt").sort({ createdAt: -1 }),
            StudentNote.find({ user: userId }).select("title topic subject section summary onModel uploadedBy user branch semester classLevel examType revisionMode createdAt").sort({ createdAt: -1 })
        ];

        if (sharedQuery) {
            fetchPromises.push(
                TeacherUpload.find(sharedQuery).select("title topic subject section summary onModel uploadedBy user branch semester createdAt").sort({ createdAt: -1 })
            );
        }

        const results = await Promise.all(fetchPromises);
        let notes = [...results[0], ...results[1]];
        if (results[2]) notes = [...notes, ...results[2]];
        
        notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return res.status(200).json(notes);
    } catch (error) {
        console.error("getMyNotes error:", error);
        return res.status(500).json({ message: `getCurrentUser notes error ${error.message}` });
    }
}

export const getSingleNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const role = req.role;
        const noteId = req.params.id;

        let note = await Notes.findById(noteId);
        if (!note) {
            note = await TeacherUpload.findById(noteId);
        }
        if (!note) {
            note = await StudentNote.findById(noteId);
        }

        if (!note) {
            return res.status(404).json({ error: "Notes not found" });
        }

        // Check if user is owner
        const isOwner = note.user?.toString() === userId || note.uploadedBy?.toString() === userId;
        
        // Check if shared with student
        let isShared = false;
        if (!isOwner && role === "user" && note.onModel !== "UserModel") {
            const user = await UserModel.findById(userId);
            if (user && user.branch && user.semester) {
                const sameBranch = note.branch?.toLowerCase() === user.branch.toLowerCase();
                const sameSem = note.semester === user.semester;
                if (sameBranch && sameSem) isShared = true;
            }
        }

        if (!isOwner && !isShared && role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        return res.json({
            ...note.toObject(),
            content: note.content,
            topic: note.topic || note.title,
            createdAt: note.createdAt
        });
    } catch (error) {
        console.error("getSingleNotes error:", error);
        return res.status(500).json({ message: `getSingle notes error ${error.message}` });
    }
}