import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { FiPlay, FiTerminal, FiCode, FiCpu } from 'react-icons/fi';

const TeacherCodePlayground = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World!");');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'cpp', name: 'C++' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
  ];

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setOutput('// Compiling & Running...');
      
      const res = await axios.post(`${serverUrl}/api/teacher/run-code`, {
        sourceCode: code,
        language: language
      }, { withCredentials: true });

      if (res.data.stderr) {
        setOutput(`// Error:\n${res.data.stderr}`);
      } else {
        setOutput(res.data.stdout || '// Code executed successfully (No output)');
      }
    } catch (err) {
      setOutput(`// Execution Failed:\n${err.response?.data?.message || err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="mt-6">
      <DashboardCard title="Advanced Code Playground" icon="💻">
        <div className="flex flex-col gap-6 py-4">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <FiCode size={12} />
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                <FiCpu className="animate-pulse" /> Powered by Judge0 CE
              </span>
            </div>
            
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-xl shadow-indigo-900/20 active:scale-95 ${
                isRunning ? 'bg-slate-700 text-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRunning ? 'Running...' : <><FiPlay /> Run Code</>}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Editor Area */}
             <div className="lg:col-span-2 space-y-2">
                <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#1e1e1e] h-[450px] shadow-inner font-mono">
                   <Editor
                      height="100%"
                      language={language}
                      value={code}
                      theme="vs-dark"
                      onChange={(val) => setCode(val || '')}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        padding: { top: 20 },
                        smoothScrolling: true,
                        cursorBlinking: "expand",
                        fontFamily: "'Fira Code', monospace"
                      }}
                   />
                </div>
             </div>

             {/* Output Area */}
             <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <FiTerminal /> Output Console
                   </label>
                   {isRunning && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                </div>
                <div className="flex-1 bg-black text-emerald-400 p-6 font-mono text-xs rounded-2xl border border-white/5 shadow-2xl h-[450px] overflow-auto scrollbar-hide">
                   <pre className="whitespace-pre-wrap leading-relaxed opacity-90">
                      {output || '// Click "Run Code" to execute...'}
                   </pre>
                </div>
             </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default TeacherCodePlayground;
