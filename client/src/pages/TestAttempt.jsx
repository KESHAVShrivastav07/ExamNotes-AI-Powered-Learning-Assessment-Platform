import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiClock, FiActivity, FiTarget, FiAlertCircle } from 'react-icons/fi';
import { serverUrl } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, [id]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/tests`, { withCredentials: true });
      const foundTest = res.data.find(t => t._id === id);
      if (foundTest) {
        setTest(foundTest);
        setAnswers(new Array(foundTest.questions.length).fill(null));
      }
    } catch (error) {
      console.error("Fetch Test Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${serverUrl}/api/tests/submit`, {
        testId: id,
        answers: answers
      }, { withCredentials: true });
      
      setResult(res.data.result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submit Test Error:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!test) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <p className="text-gray-500">Test not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-150">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-20">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="test-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{test.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{test.companyName} Mock Series</p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-sm tracking-tight shadow-sm">
                  Question {currentQuestion + 1} / {test.questions.length}
                </div>
              </header>

              <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-white/[0.08] shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed mb-10">
                  {test.questions[currentQuestion].questionText}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {test.questions[currentQuestion].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleOptionSelect(idx)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                        answers[currentQuestion] === idx
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                          : 'bg-gray-50 dark:bg-slate-800/40 border-gray-100 dark:border-white/[0.05] text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500/50'
                      }`}
                    >
                      <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold ${
                        answers[currentQuestion] === idx ? 'bg-white/20' : 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-base font-semibold">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <footer className="flex items-center justify-between pt-8">
                <button
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/[0.05]"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentQuestion < test.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/10 transition-all active:scale-95"
                  >
                    Next Question
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-12 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/10 transition-all active:scale-95"
                  >
                    Submit Test
                    <FiCheckCircle className="w-4 h-4" />
                  </button>
                )}
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key="test-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12 py-10"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-500/5">
                <FiCheckCircle className="w-12 h-12" />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Test Completed!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Great job finishing the {test.title}. Here's how you performed across the sessions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <StatCard icon={<FiActivity />} label="Score" value={`${result.score}/${result.totalQuestions}`} color="indigo" />
                <StatCard icon={<FiTarget />} label="Accuracy" value={`${result.accuracy.toFixed(1)}%`} color="emerald" />
                <StatCard icon={<FiClock />} label="Time spent" value="12:45" color="purple" />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <button
                  onClick={() => navigate('/tests')}
                  className="px-10 py-3.5 rounded-2xl border border-gray-200 dark:border-white/[0.08] text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all"
                >
                  Back to All Tests
                </button>
                <button
                  onClick={() => navigate('/performance')}
                  className="px-10 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/10 transition-all"
                >
                  View Performance History
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-white/[0.08] shadow-sm group hover:border-indigo-500/50 transition-all">
    <div className={`w-10 h-10 mx-auto mb-4 rounded-xl flex items-center justify-center text-lg ${
      color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
      color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
      'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
    }`}>
      {icon}
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-xl font-extrabold text-gray-900 dark:text-white tabular-nums tracking-tight">{value}</h4>
  </div>
);

export default TestAttempt;
