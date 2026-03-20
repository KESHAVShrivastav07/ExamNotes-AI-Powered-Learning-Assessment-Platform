import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    credits:{
        type:Number,
        default:100,
        min:0
    },
    isCreditAvailable:{
        type:Boolean,
        default:true
    },
    role: {
      type: String,
      default: "user"
    },
    branch: {
      type: String,
      required: false
    },
    semester: {
      type: String,
      required: false
    },
    notes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Notes",
        default:[]

    }

},{timestamps:true})

const UserModel = mongoose.model("UserModel" , userSchema)

export default UserModel