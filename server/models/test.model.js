import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        enum: ['TCS', 'Infosys', 'Wipro', 'Other'],
        default: 'Other'
    },
    description: {
        type: String,
        trim: true
    },
    branch: {
        type: String,
        required: false
    },
    semester: {
        type: String,
        required: false
    },
    duration: {
        type: Number,
        required: false
    },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true } // Index of the correct option
        }
    ],
    status: {
        type: String,
        enum: ['Scheduled', 'Live', 'Completed'],
        default: 'Scheduled'
    },
    scheduledDate: {
        type: Date,
        required: false
    },
    testDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Test', testSchema);
