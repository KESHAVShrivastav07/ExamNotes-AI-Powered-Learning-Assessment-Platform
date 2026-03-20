import mongoose from "mongoose";
const notesSchema = new mongoose.Schema({
    title: {
      type: String,
      default: "Untitled Note"
    },
    description: String,
    fileUrl: {
      type: String,
      required: false
    },
    subject: {
      type: String,
      required: false
    },
    section: {
      type: String,
      required: false
    },
    branch: {
      type: String,
      required: false
    },
    semester: {
      type: String,
      required: false
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
      required: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: false
    },
    onModel: {
      type: String,
      required: false,
      enum: ['UserModel', 'Teacher', 'Admin'],
      default: 'UserModel'
    },
    // AI Generated Fields
    summary: String,
    keyPoints: [String],
    questions: [
      {
        question: String,
        answer: String
      }
    ],
    // Original fields for backward compatibility or generic notes
    topic: String,
    content: mongoose.Schema.Types.Mixed
},{timestamps:true})

const Notes = mongoose.model("Notes" , notesSchema)

export default Notes