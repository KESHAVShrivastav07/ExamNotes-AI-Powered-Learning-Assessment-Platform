import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiTrash2, FiDownload, FiFileText, FiFilter } from "react-icons/fi";
import axios from "axios";
import { serverUrl } from "../../App";

const ALL_SECTIONS = ["All", "Placement", "OOPS", "DSA", "DBMS"];

function MyUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchUploads = async () => {
    try {
      const res = await axios.get(serverUrl + "/api/notes", {
        withCredentials: true,
      });
      setUploads(res.data);
    } catch (err) {
      console.error("Fetch uploads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this upload? This cannot be undone.")) return;

    try {
      await axios.delete(serverUrl + `/api/notes/${id}`, {
        withCredentials: true,
      });
      setUploads((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(
        serverUrl + `/api/teacher/uploads/view/${id}`,
        { withCredentials: true, responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      const upload = uploads.find((u) => u._id === id);
      link.setAttribute("download", upload?.fileName || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("View/download error:", err);
    }
  };

  const filtered =
    activeFilter === "All"
      ? uploads
      : uploads.filter((u) => u.section === activeFilter);

  const sectionColorMap = {
    Placement: "bg-blue-50 text-blue-600 border-blue-100",
    OOPS: "bg-purple-50 text-purple-600 border-purple-100",
    DSA: "bg-emerald-50 text-emerald-600 border-emerald-100",
    DBMS: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <FiFilter className="text-gray-400 mr-1" />
        {ALL_SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${
                activeFilter === s
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            Loading uploads...
          </motion.div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FiFileText size={24} />
          </div>
          <h3 className="text-sm font-semibold text-gray-700">No uploads found</h3>
          <p className="text-xs text-gray-400 mt-1">
            {activeFilter === "All"
              ? "You haven't uploaded any notes yet."
              : `No notes in the "${activeFilter}" section.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((upload, i) => (
              <motion.div
                key={upload._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-gray-200 p-5
                  hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0 mt-0.5">
                      <FiFileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {upload.title}
                      </h4>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {upload.fileName}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border
                            ${sectionColorMap[upload.section] || "bg-gray-50 text-gray-600 border-gray-200"}`}
                        >
                          {upload.section}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                          {upload.subject}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(upload.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleView(upload._id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center
                        text-gray-400 hover:text-primary-600 hover:bg-primary-50
                        transition-colors"
                      title="Download"
                    >
                      <FiDownload size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(upload._id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center
                        text-gray-400 hover:text-red-500 hover:bg-red-50
                        transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default MyUploads;
