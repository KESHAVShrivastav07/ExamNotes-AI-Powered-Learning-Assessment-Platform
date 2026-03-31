import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from './models/user.model.js';
import connectDb from './utils/connectDb.js';

dotenv.config();

const checkDb = async () => {
    try {
        await connectDb();
        const users = await UserModel.find({}).lean();
        console.log("USERS:", users.map(u => ({ email: u.email, credits: u.credits })));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDb();
