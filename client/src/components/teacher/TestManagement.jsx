import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../../App";

const TestManagement = ({ tests = [], refresh }) => {
  const [form, setForm] = useState({
    title: '',
    company: 'TCS',
    branch: 'CSE',
    semester: '1',
    duration: '',
    questionsCount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePublish = async () => {
    if (!form.title || !form.duration || !form.questionsCount) {
      setError("Please fill all required fields.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      // Send both companyName (model) and testDate (required)
      await axios.post(serverUrl + "/api/tests", {
        ...form,
        companyName: form.company,
        testDate: new Date(), // Required by schema
        duration: parseInt(form.duration),
        questionsCount: parseInt(form.questionsCount),
        status: "Live"
      }, { withCredentials: true });
      
      setForm({
        title: '',
        company: 'TCS',
        branch: 'CSE',
        semester: '1',
        duration: '',
        questionsCount: '',
      });
      if (refresh) refresh();
    } catch (err) {
      console.error("Publish error:", err);
      setError(err.response?.data?.message || "Failed to publish test.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await axios.delete(serverUrl + `/api/tests/${id}`, { withCredentials: true });
      if (refresh) refresh();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 overflow-hidden">
      {/* Create Test Card */}
      <DashboardCard title="Create New Test" icon="📝">
        <form className="space-y-4 py-4" onSubmit={(e) => e.preventDefault()}>
          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Test Title</label>
            <input 
              type="text" 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="e.g., OOPS Fundamentals" 
              className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company</label>
              <select 
                 value={form.company}
                 onChange={(e) => setForm({...form, company: e.target.value})}
                 className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white appearance-none"
              >
                <option>TCS</option>
                <option>Infosys</option>
                <option>Wipro</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration (Min)</label>
              <input 
                type="number" 
                value={form.duration}
                onChange={(e) => setForm({...form, duration: e.target.value})}
                placeholder="60" 
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Branch</label>
              <select 
                value={form.branch}
                onChange={(e) => setForm({...form, branch: e.target.value})}
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white appearance-none"
              >
                <option>CSE</option>
                <option>IT</option>
                <option>ECE</option>
                <option>ME</option>
                <option>CE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Semester</label>
              <select 
                value={form.semester}
                onChange={(e) => setForm({...form, semester: e.target.value})}
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white appearance-none"
              >
                {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Number of Questions</label>
             <input 
               type="number" 
               value={form.questionsCount}
               onChange={(e) => setForm({...form, questionsCount: e.target.value})}
               placeholder="20" 
               className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white" 
             />
          </div>

          <div className="flex items-center gap-3 mt-4">
             <button type="button" className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors text-white">
                + Add Questions (Coming Soon)
             </button>
             <button 
               onClick={handlePublish}
               disabled={loading}
               type="button" 
               className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/20 text-white"
             >
                {loading ? "Publishing..." : "Publish Test"}
             </button>
          </div>
        </form>
      </DashboardCard>

      {/* All Tests Card */}
      <DashboardCard title="All Created Tests" icon="📂">
        <div className="space-y-3 py-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          {tests.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-10">No tests created yet.</p>
          ) : (
            tests.map((test) => (
              <div key={test._id} className="p-4 rounded-xl bg-slate-800/30 border border-white/5 group hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-white">{test.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    test.status === "Live" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {test.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
                   <span className="bg-slate-700/50 px-2 py-1 rounded">Company: {test.companyName || test.company}</span>
                   <span className="bg-slate-700/50 px-2 py-1 rounded">Branch: {test.branch}</span>
                   <span className="bg-slate-700/50 px-2 py-1 rounded">Sem: {test.semester}</span>
                   <span className="bg-slate-700/50 px-2 py-1 rounded">{test.duration} mins</span>
                   <span className="bg-slate-700/50 px-2 py-1 rounded">{test.questionsCount} Qs</span>
                </div>
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-400 text-[10px] font-bold transition-colors">
                      Edit
                   </button>
                   <button 
                     onClick={() => handleDelete(test._id)}
                     className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-[10px] font-bold transition-colors"
                   >
                      Delete
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardCard>
    </div>
  );
};

export default TestManagement;
