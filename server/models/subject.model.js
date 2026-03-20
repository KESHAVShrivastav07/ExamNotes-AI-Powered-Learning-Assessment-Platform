import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
