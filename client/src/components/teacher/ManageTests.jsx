import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiSend, FiPieChart, FiList, FiCheckCircle, FiUser, FiBriefcase, FiCalendar, FiClock } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { serverUrl } from '../../App';
import { useSelector } from 'react-redux';

const ManageTests = () => {
    const [activeTab, setActiveTab] = useState('tests'); // Default to list view
    const [tests, setTests] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userData } = useSelector((state) => state.user);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        companyName: 'TCS',
        description: '',
        testDate: '',
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });

    useEffect(() => {
        if (activeTab === 'analytics') {
            fetchAnalytics();
        } else if (activeTab === 'tests') {
            fetchMyTests();
        }
    }, [activeTab]);

    const fetchMyTests = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${serverUrl}/api/tests`, { withCredentials: true });
            
            console.log("Tests:", res.data);
            console.log("User:", userData);

            // TASK 1: FIX TEACHER FILTER
            const myTests = res.data?.filter(test => test.createdBy?.toString() === userData?._id);
            setTests(myTests);
        } catch (error) {
            console.error("Fetch Tests Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        const companies = ['TCS', 'Infosys', 'Wipro'];
        return companies.map(c => {
            const companyResults = results.filter(r => r.testId?.companyName === c);
            const avgAccuracy = companyResults.length > 0 
                ? companyResults.reduce((acc, curr) => acc + curr.accuracy, 0) / companyResults.length 
                : 0;
            return { name: c, accuracy: avgAccuracy };
        });
    };

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${serverUrl}/api/tests/results/all`, { withCredentials: true });
            setResults(res.data);
        } catch (error) {
            console.error("Fetch Analytics Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
        });
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(`${serverUrl}/api/tests`, formData, { withCredentials: true });
            alert("Test created successfully!");
            setFormData({
                title: '',
                companyName: 'TCS',
                description: '',
                testDate: '',
                questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
            });
            setActiveTab('tests');
        } catch (error) {
            console.error("Submit Test Error:", error);
            alert("Failed to create test.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-4 p-1.5 rounded-2xl bg-white border border-gray-100 w-fit shadow-sm">
                <TabButton 
                    active={activeTab === 'tests'} 
                    onClick={() => setActiveTab('tests')} 
                    icon={<FiList />} 
                    label="My Published Tests" 
                />
                <TabButton 
                    active={activeTab === 'create'} 
                    onClick={() => setActiveTab('create')} 
                    icon={<FiPlus />} 
                    label="Create New Test" 
                />
                <TabButton 
                    active={activeTab === 'analytics'} 
                    onClick={() => setActiveTab('analytics')} 
                    icon={<FiPieChart />} 
                    label="Student Analytics" 
                />
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'tests' ? (
                    <motion.div 
                        key="my-tests"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {tests?.map((test) => (
                            <div key={test._id} className="group relative p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                        <FiBriefcase className="w-6 h-6" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100">
                                        {test.companyName}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                    {test.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
                                    {test.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <FiCalendar className="w-3.5 h-3.5" />
                                        {new Date(test.testDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FiClock className="w-3.5 h-3.5" />
                                        {test.questions?.length} Qs
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tests?.length === 0 && !loading && (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100">
                                <p className="text-gray-400 italic">You haven't published any mock tests yet.</p>
                                <button onClick={() => setActiveTab('create')} className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
                                    Create Your First Test
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : activeTab === 'create' ? (
                    <motion.form 
                        key="create-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Test Title</label>
                                <input 
                                    type="text" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. TCS NQT Mock 1"
                                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company</label>
                                <select 
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none appearance-none"
                                >
                                    <option value="TCS">TCS</option>
                                    <option value="Infosys">Infosys</option>
                                    <option value="Wipro">Wipro</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Test Date</label>
                                <input 
                                    type="datetime-local" 
                                    value={formData.testDate}
                                    onChange={(e) => setFormData({...formData, testDate: e.target.value})}
                                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Questions Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 px-2">Questions ({formData.questions.length})</h3>
                            {formData.questions.map((q, qIdx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={qIdx} 
                                    className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6 relative group"
                                >
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveQuestion(qIdx)}
                                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <FiTrash2 />
                                    </button>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Question {qIdx + 1}</label>
                                        <textarea 
                                            value={q.questionText}
                                            onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                                            placeholder="Type your question here..."
                                            className="w-full px-0 py-2 text-lg font-bold bg-transparent border-0 focus:ring-0 placeholder:text-gray-300 resize-none outline-none"
                                            rows="2"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-3 group/opt">
                                                <button 
                                                    type="button"
                                                    onClick={() => handleQuestionChange(qIdx, 'correctAnswer', oIdx)}
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                        q.correctAnswer === oIdx 
                                                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                                                        : 'border-gray-200 hover:border-indigo-400'
                                                    }`}
                                                >
                                                    {q.correctAnswer === oIdx && <FiCheckCircle size={12} />}
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                    className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                                                        q.correctAnswer === oIdx 
                                                        ? 'bg-indigo-50 text-indigo-700 font-bold' 
                                                        : 'bg-gray-50 text-gray-600 focus:bg-white border border-transparent focus:border-gray-200'
                                                    }`}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                            <button 
                                type="button"
                                onClick={handleAddQuestion}
                                className="w-full py-4 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                            >
                                <FiPlus className="text-lg" />
                                Add Another Question
                            </button>
                        </div>

                        <div className="flex justify-end pt-10">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="px-12 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <FiSend />}
                                Publish Test Series
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div 
                        key="analytics-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {/* Charts Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Average Accuracy by Company (%)</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getChartData()}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                            <Tooltip 
                                                cursor={{fill: '#f9fafb'}}
                                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                            />
                                            <Bar dataKey="accuracy" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-600/20">
                                <div>
                                    <FiCheckCircle className="text-3xl mb-4" />
                                    <h4 className="text-sm font-medium opacity-80">Total Participations</h4>
                                    <p className="text-5xl font-extrabold mt-2 tracking-tighter">{results.length}</p>
                                </div>
                                <div className="pt-8 border-t border-white/10 uppercase tracking-widest text-[10px] font-bold opacity-60">
                                    Last Updated: {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">Student Performance Log</h3>
                                <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
                                    <FiList />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="px-8 py-4">Student</th>
                                            <th className="px-8 py-4">Test Title</th>
                                            <th className="px-8 py-4 text-center">Score</th>
                                            <th className="px-8 py-4 text-center">Accuracy</th>
                                            <th className="px-8 py-4 text-right">Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {results.map((r, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                            {r.studentId?.name?.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{r.studentId?.name}</p>
                                                            <p className="text-[10px] text-gray-400">{r.studentId?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-700">{r.testId?.title}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{r.testId?.companyName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-center font-bold text-gray-600 tabular-nums">
                                                    {r.score} / {r.totalQuestions}
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`px-2 py-1 rounded-lg font-bold text-[11px] ${
                                                        r.accuracy >= 80 ? 'bg-emerald-50 text-emerald-600' : 
                                                        r.accuracy >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        {r.accuracy.toFixed(0)}%
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right text-gray-400 text-xs tabular-nums">
                                                    {new Date(r.submittedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {results.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-20 text-center text-gray-400 italic">No student attempts recorded yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            active 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
    >
        <span className="text-base">{icon}</span>
        {label}
    </button>
);

export default ManageTests;
