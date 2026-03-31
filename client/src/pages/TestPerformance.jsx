import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, Legend 
} from 'recharts';
import { FiTrendingUp, FiBarChart2, FiAward, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TestPerformance = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(false); // Default to false for UI testing if no data
      const res = await axios.get(`${serverUrl}/api/tests/results`, { withCredentials: true });
      setResults(res.data);
    } catch (error) {
      console.error("Fetch Results Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for Charts
  const chartData = results.map(r => ({
    name: r.testId?.title?.substring(0, 10) || 'Test',
    score: r.score,
    accuracy: r.accuracy,
    fullDate: new Date(r.submittedAt).toLocaleDateString()
  })).reverse();

  const averageAccuracy = results.length > 0 
    ? (results.reduce((acc, curr) => acc + curr.accuracy, 0) / results.length).toFixed(1)
    : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-150">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-20">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Performance Analytics
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Track your progress across different company test series.
            </p>
          </div>
          <button 
            onClick={() => navigate('/tests')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/[0.08] text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all"
          >
            <FiArrowLeft />
            Back to Tests
          </button>
        </header>

        {results.length > 0 ? (
          <div className="space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatItem icon={<FiAward />} label="Tests Attempted" value={results.length} color="indigo" />
              <StatItem icon={<FiTrendingUp />} label="Avg. Accuracy" value={`${averageAccuracy}%`} color="emerald" />
              <StatItem icon={<FiCalendar />} label="Latest Score" value={`${results[0].score}/${results[0].totalQuestions}`} color="purple" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Bar Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-white/[0.08] shadow-sm"
              >
                <div className="flex items-center gap-2 mb-8">
                  <FiBarChart2 className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Score History</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Accuracy Line Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-white/[0.08] shadow-sm"
              >
                <div className="flex items-center gap-2 mb-8">
                  <FiTrendingUp className="text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Accuracy Progression (%)</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Detailed Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-gray-100 dark:border-white/[0.08] overflow-hidden"
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Test Title</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4 text-center">Accuracy</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white capitalize">{r.testId?.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-[10px]">
                          {r.testId?.companyName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-600 dark:text-gray-300 tabular-nums">{r.score} / {r.totalQuestions}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                           <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.08] overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${r.accuracy}%` }} />
                           </div>
                           <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-[11px]">{r.accuracy.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400 tabular-nums text-xs font-medium">
                        {new Date(r.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-white/[0.05] flex items-center justify-center text-gray-400">
               <FiTrendingUp className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Test Results Yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                 Once you complete your first company mock test, your performance analytics will appear here.
              </p>
            </div>
            <button 
              onClick={() => navigate('/tests')}
              className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/10 transition-all"
            >
               Browse Tests Now
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const StatItem = ({ icon, label, value, color }) => (
  <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-white/[0.08] shadow-sm flex items-center gap-6">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
      color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
      color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
      'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
    }`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums tracking-tight">{value}</h3>
    </div>
  </div>
);

export default TestPerformance;
