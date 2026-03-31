import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from './models/user.model.js';
import Admin from './models/admin.model.js';
import Teacher from './models/teacher.model.js';
import connectDb from './utils/connectDb.js';

dotenv.config();

const checkModels = async () => {
    try {
        await connectDb();
        console.log("UserModel collection:", UserModel.collection.name);
        console.log("Admin collection:", Admin.collection.name);
        console.log("Teacher collection:", Teacher.collection.name);
        
        const users = await UserModel.find({}).lean();
        console.log("Actual users in UserModel:", users.map(u => ({ email: u.email, credits: u.credits })));
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkModels();
