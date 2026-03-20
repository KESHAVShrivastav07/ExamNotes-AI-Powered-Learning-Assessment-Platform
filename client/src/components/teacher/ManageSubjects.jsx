import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiPlus, FiTrash2, FiBookOpen, FiX } from "react-icons/fi";
import axios from "axios";
import { serverUrl } from "../../App";

function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchSubjects = async () => {
    try {
        const res = await axios.get(serverUrl + "/api/subjects", {
          withCredentials: true,
        });
      setSubjects(res.data);
    } catch (err) {
      console.error("Fetch subjects error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAdd = async () => {
    if (!newSubject.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }

    setAdding(true);
    setError("");
    try {
      const res = await axios.post(
        serverUrl + "/api/subjects",
        { name: newSubject },
        { withCredentials: true }
      );
      setNewSubject("");
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;

    try {
      await axios.delete(serverUrl + `/api/subjects/${id}`, {
        withCredentials: true,
      });
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your Subjects</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""} added
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setError("");
            setNewSubject("");
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-primary-600 text-white text-sm font-semibold
            hover:bg-primary-700 shadow-sm hover:shadow-md transition-all"
        >
          <FiPlus /> Add Subject
        </button>
      </div>

      {/* Subject list */}
      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
            Loading subjects...
          </motion.div>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FiBookOpen size={24} />
          </div>
          <h3 className="text-sm font-semibold text-gray-700">No subjects yet</h3>
          <p className="text-xs text-gray-400 mt-1">
            Click "Add Subject" to create your first subject.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 p-5
                hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                    <FiBookOpen size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {subject.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Added {new Date(subject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(subject._id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center
                    text-gray-300 hover:text-red-500 hover:bg-red-50
                    transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add New Subject
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                      text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="e.g. Operating Systems"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm mb-5
                    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                    bg-gray-50/50 placeholder:text-gray-400 transition-all"
                />

                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600
                      hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                      ${
                        adding
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
                      }`}
                  >
                    {adding ? "Adding..." : "Add Subject"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManageSubjects;
