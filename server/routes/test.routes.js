import express from 'express';
import { 
    createTest, 
    getTests, 
    getUpcomingTests, 
    submitResult, 
    getStudentResults, 
    getAllResults,
    updateTest,
    deleteTest
} from '../controllers/test.controller.js';
import isAuth from '../middleware/isAuth.js';
import { isTeacher, isStudent } from '../middleware/roleBase.js';

const router = express.Router();

// ── Teacher/Admin Routes ──
router.post('/', isAuth, isTeacher, createTest);
router.put('/:id', isAuth, isTeacher, updateTest);
router.delete('/:id', isAuth, isTeacher, deleteTest);
router.get('/results/all', isAuth, isTeacher, getAllResults);

// ── Shared Routes ──
router.get('/', isAuth, getTests);
router.get('/upcoming', isAuth, getUpcomingTests);

// ── Student Routes ──
router.post('/submit', isAuth, isStudent, submitResult);
router.get('/results', isAuth, getStudentResults);

export default router;
