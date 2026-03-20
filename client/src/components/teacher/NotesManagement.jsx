import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import axios from "axios";
import { serverUrl } from "../../App";

const NotesManagement = ({ notes = [], refresh }) => {
  const [form, setForm] = useState({
    title: '',
    subject: '',
    branch: 'CSE',
    semester: '1',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file || !form.title || !form.subject) {
      setError("Please fill all required fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subject", form.subject);
    formData.append("branch", form.branch);
    formData.append("semester", form.semester);
    formData.append("file", form.file);

    setUploading(true);
    setError("");
    try {
      await axios.post(serverUrl + "/api/teacher/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      setForm({ title: '', subject: '', branch: 'CSE', semester: '1', file: null });
      if (refresh) refresh();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload notes.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(serverUrl + `/api/teacher/notes/${id}`, { withCredentials: true });
      if (refresh) refresh();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 overflow-hidden">
      {/* Upload Notes Card */}
      <DashboardCard title="Upload New Notes" icon="📤">
        <form className="space-y-4 py-4" onSubmit={handleUpload}>
          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Note Title</label>
            <input 
              type="text" 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="e.g., OOPS Unit 1 Notes" 
              className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-white" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
              <input 
                type="text" 
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                placeholder="OOPS" 
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-white" 
              />
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">PDF File</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setForm({...form, file: e.target.files[0]})}
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={uploading}
            className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 text-white"
          >
            {uploading ? "Uploading..." : "Upload Notes"}
          </button>
        </form>
      </DashboardCard>

      {/* Uploaded Notes Card */}
      <DashboardCard title="Uploaded Notes" icon="📚">
        <div className="space-y-3 py-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-10">No notes uploaded yet.</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="p-4 rounded-xl bg-slate-800/30 border border-white/5 group hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-white">{note.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-gray-300 font-bold uppercase">
                    {note.subject}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
                   <span className="bg-slate-700/50 px-2 py-1 rounded">Branch: {note.branch}</span>
                   <span className="bg-slate-700/50 px-2 py-1 rounded">Sem: {note.semester}</span>
                   <span className="bg-slate-700/50 px-2 py-1 rounded">Subject: {note.subject}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <a 
                     href={note.fileUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-400 text-center text-[10px] font-bold transition-colors"
                   >
                      View PDF
                   </a>
                   <button 
                     onClick={() => handleDelete(note._id)}
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

export default NotesManagement;
