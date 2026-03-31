import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';

const AdminEditModal = ({ isOpen, onClose, entity, type, onUpdate }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (entity) setFormData(entity);
  }, [entity]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/[0.1] overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-gray-100 dark:border-white/[0.05] flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
            <h3 className="text-xl font-bold">Edit {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {type === 'user' && (
              <>
                <Field label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                <Field label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Semester" name="semester" value={formData.semester} onChange={handleChange} />
                  <Field label="Credits" name="credits" value={formData.credits} type="number" onChange={handleChange} />
                </div>
              </>
            )}

            {type === 'teacher' && (
              <>
                <Field label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                <Field label="Email Address" name="email" value={formData.email} onChange={handleChange} />
                <Field label="Department" name="department" value={formData.department} onChange={handleChange} />
              </>
            )}

            {type === 'test' && (
              <>
                <Field label="Test Title" name="title" value={formData.title} onChange={handleChange} />
                <Field label="Company" name="companyName" value={formData.companyName} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Status" name="status" value={formData.status} onChange={handleChange} />
                  <Field label="Date" name="testDate" value={formData.testDate} type="date" onChange={handleChange} />
                </div>
              </>
            )}

            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 dark:bg-white/5 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <FiCheck /> Update Details
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Field = ({ label, name, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value || ''} 
      onChange={onChange}
      className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/[0.05] focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
    />
  </div>
);

export default AdminEditModal;
