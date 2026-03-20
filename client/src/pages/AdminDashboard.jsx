import React, { useEffect, useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { FiUsers, FiFileText, FiActivity, FiLogOut, FiTrash2, FiEdit2, FiSearch, FiLayers, FiDatabase } from "react-icons/fi"
import Footer from "../components/Footer"
import { logout } from "../services/api"
import AdminEditModal from "../components/admin/AdminEditModal"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ students: 0, teachers: 0, tests: 0, notes: 0 });
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [editingType, setEditingType] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, teachersRes, notesRes, testsRes] = await Promise.all([
        axios.get(`${serverUrl}/api/admin/stats`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/users`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/teachers`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/notes/all`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/admin/tests/all`, { withCredentials: true })
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTeachers(teachersRes.data);
      setNotes(notesRes.data);
      setAllTests(testsRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUserData(null));
      navigate("/admin/login");
    } catch (e) { console.error(e); }
  };

  const handleEdit = (type, entity) => {
    setEditingType(type);
    setEditingEntity(entity);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      let endpoint = `/api/admin/${editingType}s/${editingEntity._id}`;
      // Logic for special cases if needed, but the current routes are pretty standard
      
      await axios.put(`${serverUrl}${endpoint}`, updatedData, { withCredentials: true });
      setIsEditModalOpen(false);
      fetchAllData();
    } catch (e) {
      console.error("Update failed", e);
      alert("Update failed. Please check your data.");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
       let endpoint = `/api/admin/${type}s/${id}`;
       if (type === 'test') endpoint = `/api/admin/tests/${id}`;
       if (type === 'note') endpoint = `/api/admin/notes/${id}`;
       
       await axios.delete(`${serverUrl}${endpoint}`, { withCredentials: true });
       fetchAllData();
    } catch (e) {
       console.error("Delete failed", e);
       alert("Deletion failed. Please try again.");
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-150'>
      {/* 1. PREMIUM HEADER */}
       <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/[0.05]">
        <div className="w-full px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <FiDatabase size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-500">System Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Welcome back, Admin 👑</p>
                <p className="text-[10px] text-gray-500">Fixed Session Active</p>
             </div>
             <button 
               onClick={handleLogout}
               className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-sm"
             >
               <FiLogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      <main className="w-full px-6 lg:px-10 py-10">
        
        {/* 2. STATS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<FiUsers />} title="Total Students" value={stats.students} color="indigo" onClick={() => setActiveTab("students")} />
          <StatCard icon={<FiLayers />} title="Total Teachers" value={stats.teachers} color="emerald" onClick={() => setActiveTab("teachers")} />
          <StatCard icon={<FiActivity />} title="Mock Tests" value={stats.tests} color="amber" onClick={() => setActiveTab("tests")} />
          <StatCard icon={<FiFileText />} title="Study Notes" value={stats.notes} color="rose" onClick={() => setActiveTab("notes")} />
        </section>

        {/* 3. MANAGEMENT CONTENT */}
        <div className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-gray-100 dark:border-white/[0.08] shadow-2xl overflow-hidden min-h-[60vh]">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap border-b border-gray-100 dark:border-white/[0.05] shadow-sm">
            <Tab active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="System Overview" icon={<FiSearch/>} />
            <Tab active={activeTab === "students"} onClick={() => setActiveTab("students")} label="Students" icon={<FiUsers/>} count={users.length} />
            <Tab active={activeTab === "teachers"} onClick={() => setActiveTab("teachers")} label="Teachers" icon={<FiLayers/>} count={teachers.length} />
            <Tab active={activeTab === "tests"} onClick={() => setActiveTab("tests")} label="Tests" icon={<FiActivity/>} count={allTests.length} />
            <Tab active={activeTab === "notes"} onClick={() => setActiveTab("notes")} label="Notes" icon={<FiFileText/>} count={notes.length} />
          </div>

          <div className="p-8 lg:p-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aggregating Data...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "overview" && <SystemOverview stats={stats} />}
                  {activeTab === "students" && <ManagementTable data={users} type="user" onDelete={handleDelete} onEdit={handleEdit} />}
                  {activeTab === "teachers" && <ManagementTable data={teachers} type="teacher" onDelete={handleDelete} onEdit={handleEdit} />}
                  {activeTab === "tests" && <ManagementTable data={allTests} type="test" onDelete={handleDelete} onEdit={handleEdit} />}
                  {activeTab === "notes" && <ManagementTable data={notes} type="note" onDelete={handleDelete} onEdit={handleEdit} />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AdminEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        entity={editingEntity}
        type={editingType}
        onUpdate={handleUpdate}
      />
      
      <div className="px-10 pb-10">
        <Footer />
      </div>
    </div>
  )
}

/* UI COMPONENTS */

function StatCard({ icon, title, value, color, onClick }) {
  const colorMap = {
    indigo: "from-indigo-600/20 text-indigo-600",
    emerald: "from-emerald-600/20 text-emerald-600",
    amber: "from-amber-600/20 text-amber-600",
    rose: "from-rose-600/20 text-rose-600"
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group p-8 rounded-[2rem] bg-gradient-to-br ${colorMap[color]} to-transparent border border-gray-100 dark:border-white/[0.05] shadow-xl hover:shadow-2xl transition-transform duration-150 ease-out hover:scale-105 transform will-change-transform cursor-pointer overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-150 transition-transform duration-150">
        {icon}
      </div>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center text-2xl shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
          <h3 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">{value}</h3>
        </div>
      </div>
    </motion.div>
  )
}

function Tab({ active, onClick, label, icon, count }) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-6 text-sm font-bold flex items-center gap-3 transition-all border-b-2
        ${active ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-[10px]">{count}</span>}
    </button>
  )
}

function SystemOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="p-10 rounded-[2rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Master Overview</h2>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8">The platform is currently hosting {stats.students} active learners and {stats.teachers} expert mentors.</p>
            <div className="flex gap-4">
               <div className="px-4 py-2 bg-white/20 rounded-xl text-xs font-bold">Uptime: 99.9%</div>
               <div className="px-4 py-2 bg-white/20 rounded-xl text-xs font-bold">Stable Version</div>
            </div>
         </div>
         <FiDatabase className="absolute -bottom-10 -right-10 text-[15rem] opacity-10" />
      </div>
      <div className="p-10 rounded-[2rem] border border-gray-100 dark:border-white/[0.05] flex flex-col justify-center">
         <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
         <div className="space-y-6">
            <StatRow label="Tests Available" value={stats.tests} />
            <StatRow label="Notes Shared" value={stats.notes} />
         </div>
      </div>
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/[0.05] pb-4">
       <span className="text-gray-500 font-medium">{label}</span>
       <span className="text-lg font-black text-indigo-600">{value}</span>
    </div>
  )
}

function ManagementTable({ data, type, onDelete, onEdit }) {
  if (data.length === 0) return <div className="text-center py-20 italic text-gray-400">No {type}s found in the database.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] border-b border-gray-100 dark:border-white/[0.05]">
          <tr>
            <th className="px-6 py-5">Entity Name</th>
            <th className="px-6 py-5">Additional Details</th>
            <th className="px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {data.map((item) => (
            <tr key={item._id} className="group hover:bg-gray-50 dark:hover:bg-indigo-600/5 transition-all">
              <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {(item.name || item.title || item.topic).charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.name || item.title || item.topic}</h4>
                    <p className="text-[10px] text-gray-500 truncate">{item.email || item.companyName || item.subject}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-6">
                <div className="flex flex-wrap gap-2">
                   {type === 'user' && (
                     <>
                        <Badge label={`Sem ${item.semester}`} color="indigo" />
                        <Badge label={`${item.credits} Credits`} color="amber" />
                        <Badge label={`${item.averageScore}% Avg`} color="emerald" />
                     </>
                   )}
                   {type === 'teacher' && (
                     <>
                        <Badge label={`${item.testsCreated} Tests`} color="indigo" />
                        <Badge label={`${item.notesUploaded} Notes`} color="rose" />
                        <Badge label={item.department} color="emerald" />
                     </>
                   )}
                   {type === 'test' && (
                     <>
                        <Badge label={item.companyName} color="amber" />
                        <Badge label={item.createdBy?.name || "AI"} color="indigo" />
                        <Badge label={item.status} color={item.status === 'Live' ? 'emerald' : 'indigo'} />
                     </>
                   )}
                   {type === 'note' && (
                     <>
                        <Badge label={item.subject} color="rose" />
                        <Badge label={`By ${item.user?.name || 'Unknown'}`} color="indigo" />
                     </>
                   )}
                </div>
              </td>
              <td className="px-6 py-6 text-right">
                <div className="flex items-center justify-end gap-3">
                  <button 
                    onClick={() => onEdit(type, item)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={() => onDelete(type, item._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Badge({ label, color }) {
  const colors = {
    indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600",
    rose: "bg-rose-50 dark:bg-rose-500/10 text-rose-600"
  };
  return <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${colors[color]}`}>{label}</span>
}

export default AdminDashboard
