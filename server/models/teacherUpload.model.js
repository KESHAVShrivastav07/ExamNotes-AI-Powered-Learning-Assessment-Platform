import mongoose from "mongoose";

const teacherUploadSchema = new mongoose.Schema({
    title: String,
    description: String,
    fileUrl: String,
    subject: String,
    section: String,
    branch: String,
    semester: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    onModel: {
        type: String,
        default: 'Teacher'
    },
    summary: String,
    keyPoints: [String],
    questions: [
        {
            question: String,
            answer: String
        }
    ]
}, { timestamps: true, collection: 'teacheruploads' });

const TeacherUpload = mongoose.model("TeacherUpload", teacherUploadSchema);
export default TeacherUpload;
