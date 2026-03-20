import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiArrowRight, FiFilter, FiBriefcase } from 'react-icons/fi';
import { serverUrl } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const companies = ['All', 'TCS', 'Infosys', 'Wipro', 'Other'];

  useEffect(() => {
    fetchTests();
  }, [filter, userData]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'All') params.append('company', filter);
      if (userData?.branch) params.append('branch', userData.branch);
      if (userData?.semester) params.append('semester', userData.semester);
      
      const url = `${serverUrl}/api/tests?${params.toString()}`;
      
      const res = await axios.get(url, { withCredentials: true });
      setTests(res.data);
    } catch (error) {
      console.error("Fetch Tests Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-150">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-20">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Company-Wise Mock Tests
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Prepare for top tech companies with our specialized test series.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-white/[0.05]">
              {companies.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    filter === c 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {tests.map((test, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={test._id}
                  className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400`}>
                      <FiBriefcase className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gray-50 dark:bg-white/[0.05] text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-white/[0.05]">
                      {test.companyName}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {test.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
                    {test.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-8 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="w-3.5 h-3.5" />
                      {new Date(test.testDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5" />
                      {test.questions?.length} Questions
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/test/${test._id}`)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/10 transition-all active:scale-95"
                  >
                    Attempt Test
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {tests.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 dark:text-gray-500 font-medium italic">No tests available for this category yet.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TestList;
