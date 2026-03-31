import mongoose from "mongoose";

const studentNoteSchema = new mongoose.Schema({
    topic: String,
    title: {
        type: String,
        default: "Untitled Note"
    },
    classLevel: String,
    examType: String,
    revisionMode: Boolean,
    includeDiagram: Boolean,
    includeChart: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        default: 'UserModel'
    },
    content: mongoose.Schema.Types.Mixed,
    summary: String,
    keyPoints: [String],
    questions: [
        {
            question: String,
            answer: String
        }
    ]
}, { timestamps: true, collection: 'studentuploads' });

const StudentNote = mongoose.model("StudentNote", studentNoteSchema);
export default StudentNote;
