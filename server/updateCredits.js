import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from './models/user.model.js';
import Admin from './models/admin.model.js';
import Teacher from './models/teacher.model.js';
import connectDb from './utils/connectDb.js';

dotenv.config();

const updateAllCredits = async () => {
    try {
        await connectDb();
        console.log("Connected to DB, updating credits for all roles...");

        // Update all users/admins/teachers who don't have credits or have undefined credits
        const uRes = await UserModel.updateMany(
            { credits: { $exists: false } }, 
            { $set: { credits: 100, isCreditAvailable: true } }
        );
        
        const aRes = await Admin.updateMany(
            { credits: { $exists: false } }, 
            { $set: { credits: 100, isCreditAvailable: true } }
        );
        
        const tRes = await Teacher.updateMany(
            { credits: { $exists: false } }, 
            { $set: { credits: 100, isCreditAvailable: true } }
        );

        console.log(`Updated Users: ${uRes.modifiedCount}`);
        console.log(`Updated Admins: ${aRes.modifiedCount}`);
        console.log(`Updated Teachers: ${tRes.modifiedCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error updates:", error);
        process.exit(1);
    }
};

updateAllCredits();
