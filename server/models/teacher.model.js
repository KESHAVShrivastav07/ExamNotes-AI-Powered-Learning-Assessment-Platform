import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    role: {
      type: String,
      default: "teacher"
    },
    credits: {
      type: Number,
      default: 100,
      min: 0    
    },
    isCreditAvailable: {
      type: Boolean,
      default: true
    },

    notes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Notes",
      default: []
    }
  },
  {
    timestamps: true
  }
);


export default mongoose.model("Teacher", teacherSchema);