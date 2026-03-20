import React from 'react';
import DashboardCard from './DashboardCard';

const PerformanceSection = ({ results = [] }) => {
  return (
    <div className="mt-6 overflow-hidden">
      <DashboardCard title="Student Performance" icon="🏆">
        {/* Results Table */}
        <div className="overflow-x-auto py-4 font-inter">
          {results.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-10">No results recorded yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 pb-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Test Name</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Branch/Sem</th>
                  <th className="px-4 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {results.map((res, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-slate-800/20 transition-colors group">
                    <td className="px-4 py-3 font-medium text-white">{res.studentId?.name || "Student"}</td>
                    <td className="px-4 py-3 text-gray-400">{res.testId?.title || "Test"}</td>
                    <td className="px-4 py-3 text-white font-bold">{res.score}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        res.status === "Pass" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                       {res.studentId?.branch} / {res.studentId?.semester}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                       {new Date(res.submittedAt || res.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};

export default PerformanceSection;
