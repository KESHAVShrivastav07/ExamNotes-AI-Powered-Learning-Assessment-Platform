import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pass', 'Fail'],
        default: 'Pass'
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Result', resultSchema);
