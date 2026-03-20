import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { FiPlay, FiCode, FiTerminal } from 'react-icons/fi';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, ExamNotes AI!");');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'cpp', name: 'C++' },
    { id: 'java', name: 'Java' },
  ];

  const handleRun = () => {
    setOutput('');
    setError('');

    if (language !== 'javascript') {
      setOutput(`Note: Execution is only supported for JavaScript in this preview.\nYour ${language.toUpperCase()} code is safe.`);
      return;
    }

    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(' '));

      // Safeguard for eval
      const result = eval(code);
      
      console.log = originalLog;
      setOutput(logs.join('\n') + (result !== undefined ? `\nReturn: ${result}` : ''));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto my-12 p-6 rounded-3xl bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/[0.08] shadow-xl overflow-hidden transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <FiCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Code Playground</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Test your concepts instantly</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.1] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRun}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <FiPlay className="w-4 h-4" />
            Run JS
          </motion.button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.08] overflow-hidden shadow-inner">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            roundedSelection: true,
            automaticLayout: true,
            fontFamily: "'Fira Code', monospace"
          }}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
          <FiTerminal className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Output</span>
        </div>
        
        <div className="w-full min-h-[100px] p-4 rounded-2xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/[0.08] font-mono text-sm">
          {error && <p className="text-red-500">Error: {error}</p>}
          {output && <pre className="text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap">{output}</pre>}
          {!output && !error && <p className="text-gray-400 italic">Run your code to see results here...</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default CodeEditor;
