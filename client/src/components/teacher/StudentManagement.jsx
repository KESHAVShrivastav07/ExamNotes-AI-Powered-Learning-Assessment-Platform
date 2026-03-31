import React from 'react';
import DashboardCard from './DashboardCard';

const StudentManagement = ({ students = [], refresh }) => {
  return (
    <div className="mt-6 overflow-hidden">
      <DashboardCard 
        title="Student Management" 
        icon="👥"
        extra={
          <button 
            onClick={refresh}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-gray-400 transition-all"
          >
            Refresh Data
          </button>
        }
      >
        <div className="overflow-x-auto py-4">
          {students.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-10">No students found.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 pb-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Branch/Sem</th>
                  <th className="px-4 py-3 text-center">Tests</th>
                  <th className="px-4 py-3">Latest Result</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {students.map((student, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-slate-800/20 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{student.name}</div>
                      <div className="text-[10px] text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 capitalize">{student.email.split('@')[0]}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {student.branch || "CSE"} / {student.semester || "1"}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-400 font-bold">{student.testsAttempted || 0}</td>
                    <td className="px-4 py-3">
                      {student.latestResult ? (
                        <div className="flex flex-col gap-0.5">
                           <div className="text-indigo-400 font-bold text-xs truncate max-w-[120px]">
                              {student.latestResult.testId?.title || "Mock Test"}
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500 font-medium">Score:</span>
                              <span className={`text-[10px] font-bold ${student.latestResult.score >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                                 {student.latestResult.score}/{student.latestResult.totalQuestions || 10}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                 student.latestResult.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                                 {student.latestResult.status}
                              </span>
                           </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-600 italic">No Result</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-[10px] font-bold text-white shadow-lg shadow-indigo-900/40 transition-all">
                            View Full Results
                         </button>
                      </div>
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

export default StudentManagement;
