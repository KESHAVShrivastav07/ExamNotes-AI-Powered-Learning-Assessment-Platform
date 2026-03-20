import React from 'react';
import DashboardCard from './DashboardCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { FiTrendingUp, FiUsers, FiBookOpen, FiActivity } from 'react-icons/fi';

const TeacherAnalytics = ({ tests = [], notes = [], results = [] }) => {
  // 1. Process Score Data (Avg score per test)
  const scoreData = tests.map(test => {
    const testResults = results.filter(r => (r.testId?._id || r.testId) === test._id);
    const avgScore = testResults.length > 0 
      ? Math.round(testResults.reduce((acc, curr) => acc + curr.score, 0) / testResults.length) 
      : 0;
    return { name: test.title.slice(0, 10), avg: avgScore, attempts: testResults.length };
  });

  // 2. Student Analytics: Top & Low Performers
  const studentStats = results.reduce((acc, curr) => {
    const sid = curr.studentId?._id || curr.studentId;
    if (!sid) return acc;
    if (!acc[sid]) {
      acc[sid] = { 
        name: curr.studentId?.name || "Unknown", 
        avgScore: 0, 
        total: 0, 
        tests: 0 
      };
    }
    acc[sid].total += curr.score;
    acc[sid].tests += 1;
    acc[sid].avgScore = acc[sid].total / acc[sid].tests;
    return acc;
  }, {});

  const sortedStudents = Object.values(studentStats).sort((a, b) => b.avgScore - a.avgScore);
  const topPerformers = sortedStudents.slice(0, 5);
  const lowPerformers = sortedStudents.slice(-5).reverse().filter(s => s.avgScore < 50);

  // 3. Notes Analytics: Most Viewed
  const mostViewedNotes = [...notes]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  // 4. Pass/Fail Ratio per Test
  const perTestPassFail = tests.map(test => {
    const testResults = results.filter(r => (r.testId?._id || r.testId) === test._id);
    const pass = testResults.filter(r => r.status === 'Pass').length;
    const fail = testResults.length - pass;
    return { name: test.title.slice(0, 8), pass, fail };
  });

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-8 mt-6">
      {/* Overview Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCard title="Score History & Attempts" icon={<FiActivity className="text-indigo-400" />}>
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line name="Avg Score" type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                <Line name="Attempts" type="monotone" dataKey="attempts" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#8b5cf6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Pass/Fail Ratio per Test" icon={<FiTrendingUp className="text-emerald-400" />}>
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perTestPassFail}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar name="Passed" dataKey="pass" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="Failed" dataKey="fail" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* Student Performance Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DashboardCard title="Top Performers" icon={<FiUsers className="text-amber-400" />}>
           <div className="mt-4 space-y-3">
              {topPerformers.length === 0 ? <p className="text-gray-500 text-xs italic">No data available.</p> : topPerformers.map((s, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5">
                    <span className="text-xs font-bold text-gray-200">{s.name}</span>
                    <span className="text-xs font-black text-emerald-400">{Math.round(s.avgScore)}%</span>
                 </div>
              ))}
           </div>
        </DashboardCard>

        <DashboardCard title="Needs Improvement" icon={<FiActivity className="text-red-400" />}>
           <div className="mt-4 space-y-3">
              {lowPerformers.length === 0 ? <p className="text-gray-500 text-xs italic text-center py-4">No low performers detected! 🎉</p> : lowPerformers.map((s, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <span className="text-xs font-bold text-gray-300">{s.name}</span>
                    <span className="text-xs font-black text-red-400">{Math.round(s.avgScore)}%</span>
                 </div>
              ))}
           </div>
        </DashboardCard>
      </div>

      {/* Notes Analytics */}
      <DashboardCard title="Most Viewed Shared Notes" icon={<FiBookOpen className="text-indigo-400" />}>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            {mostViewedNotes.length === 0 ? <div className="col-span-full text-center py-6 text-gray-500 text-xs italic">No notes data yet.</div> : mostViewedNotes.map((note, i) => (
               <div key={i} className="p-4 rounded-2xl bg-slate-800/30 border border-white/5 flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold mb-2">
                     #{i + 1}
                  </div>
                  <h4 className="text-[11px] font-bold text-gray-200 truncate w-full">{note.title}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{note.subject}</p>
                  <div className="mt-auto pt-4 flex items-center gap-2 text-indigo-400 font-black text-xs">
                     {note.viewCount || 0} <span className="text-[8px] uppercase tracking-widest text-gray-600">Views</span>
                  </div>
               </div>
            ))}
         </div>
      </DashboardCard>
    </div>
  );
};

export default TeacherAnalytics;
