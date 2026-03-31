import Test from "../models/test.model.js";
import Result from "../models/result.model.js";

// ── Create Test (Teacher/Admin) ──
export const createTest = async (req, res) => {
    try {
        const { title, companyName, description, questions, testDate, branch, semester, duration, status, scheduledDate } = req.body;

        const newTest = await Test.create({
            title,
            companyName,
            description,
            questions,
            testDate,
            branch,
            semester,
            duration,
            status,
            scheduledDate,
            createdBy: req.userId
        });

        res.status(201).json({ message: "Test created successfully", test: newTest });
    } catch (error) {
        console.error("Create Test Error:", error);
        res.status(500).json({ message: "Failed to create test" });
    }
};

// ── Get All Tests / Filter by Company ──
export const getTests = async (req, res) => {
    try {
        const { company, branch, semester } = req.query;
        let query = {};
        if (company) query.companyName = company;
        if (branch) query.branch = branch;
        if (semester) query.semester = semester;

        const tests = await Test.find(query).sort({ testDate: 1 });
        res.json(tests);
    } catch (error) {
        console.error("Get Tests Error:", error);
        res.status(500).json({ message: "Failed to fetch tests" });
    }
};

// ── Get Upcoming Tests ──
export const getUpcomingTests = async (req, res) => {
    try {
        const now = new Date();
        const tests = await Test.find({ 
            $or: [
                { testDate: { $gt: now } },
                { scheduledDate: { $gt: now } }
            ]
        }).sort({ testDate: 1 });
        res.json(tests);
    } catch (error) {
        console.error("Get Upcoming Tests Error:", error);
        res.status(500).json({ message: "Failed to fetch upcoming tests" });
    }
};

// ── Submit Test Result (Student) ──
export const submitResult = async (req, res) => {
    try {
        const { testId, answers } = req.body; // answers: [optionIndex, optionIndex, ...]

        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: "Test not found" });

        let score = 0;
        test.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score++;
            }
        });

        const totalQuestions = test.questions.length;
        const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

        const result = await Result.create({
            studentId: req.userId,
            testId,
            score,
            totalQuestions,
            accuracy
        });

        res.status(201).json({ message: "Test submitted successfully", result });
    } catch (error) {
        console.error("Submit Result Error:", error);
        res.status(500).json({ message: "Failed to submit result" });
    }
};

// ── Get Student Results ──
export const getStudentResults = async (req, res) => {
    try {
        const results = await Result.find({ studentId: req.userId })
            .populate('testId', 'title companyName testDate')
            .sort({ submittedAt: -1 });

        res.json(results);
    } catch (error) {
        console.error("Get Student Results Error:", error);
        res.status(500).json({ message: "Failed to fetch results" });
    }
};

// ── Get All Results (Teacher/Admin Stats) ──
export const getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate('studentId', 'name email')
            .populate('testId', 'title companyName')
            .sort({ submittedAt: -1 });

        res.json(results);
    } catch (error) {
        console.error("Get All Results Error:", error);
        res.status(500).json({ message: "Failed to fetch all results" });
    }
};
// ── Update Test ──
export const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTest = await Test.findOneAndUpdate(
            { _id: id, createdBy: req.userId },
            req.body,
            { new: true }
        );
        if (!updatedTest) return res.status(404).json({ message: "Test not found or unauthorized" });
        res.json({ message: "Test updated successfully", test: updatedTest });
    } catch (error) {
        console.error("Update Test Error:", error);
        res.status(500).json({ message: "Failed to update test" });
    }
};

// ── Delete Test ──
export const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTest = await Test.findOneAndDelete({ _id: id, createdBy: req.userId });
        if (!deletedTest) return res.status(404).json({ message: "Test not found or unauthorized" });
        res.json({ message: "Test deleted successfully" });
    } catch (error) {
        console.error("Delete Test Error:", error);
        res.status(500).json({ message: "Failed to delete test" });
    }
};
