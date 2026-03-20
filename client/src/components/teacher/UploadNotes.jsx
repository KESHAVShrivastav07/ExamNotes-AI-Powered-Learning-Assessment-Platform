import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiUploadCloud, FiFile, FiX, FiCheck } from "react-icons/fi";
import axios from "axios";
import { serverUrl } from "../../App";

const SECTIONS = ["Placement", "OOPS", "DSA", "DBMS"];

function UploadNotes() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/subjects", {
          withCredentials: true,
        });
        setSubjects(res.data);
      } catch (err) {
        console.error("Fetch subjects error:", err);
      }
    };
    fetchSubjects();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setSection("");
    setSubject("");
    setBranch("");
    setSemester("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    setError("");

    if (!file || !title.trim() || !section || !subject || !branch || !semester) {
      setError("Please fill all required fields and select a file.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("section", section);
      formData.append("subject", subject);
      formData.append("branch", branch);
      formData.append("semester", semester);

      const res = await axios.post(
        serverUrl + "/api/notes/upload",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Success notification */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium"
          >
            <FiCheck className="text-lg" />
            Note uploaded successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-10
          flex flex-col items-center justify-center gap-4 cursor-pointer
          transition-all duration-200
          ${
            dragActive
              ? "border-primary-500 bg-primary-50/60"
              : file
              ? "border-emerald-300 bg-emerald-50/40"
              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
          }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          className="hidden"
        />

        {file ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FiFile size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="ml-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <FiX size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500">
              <FiUploadCloud size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drag & drop your file here, or{" "}
                <span className="text-primary-600 font-semibold">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOC, DOCX, PPT, PPTX, TXT — max 20MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Binary Search Tree Notes"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
              transition-all bg-gray-50/50 placeholder:text-gray-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the notes..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
              transition-all bg-gray-50/50 placeholder:text-gray-400"
          />
        </div>

        {/* Section & Subject — 2 column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section <span className="text-red-400">*</span>
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                transition-all bg-gray-50/50 text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">Select section</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-400">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                transition-all bg-gray-50/50 text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            {subjects.length === 0 && (
              <p className="text-xs text-amber-500 mt-1.5">
                No subjects yet. Go to "Manage Subjects" to add one.
              </p>
            )}
          </div>
        </div>

        {/* Branch & Semester — 2 column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch <span className="text-red-400">*</span>
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                transition-all bg-gray-50/50 text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">Select branch</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester <span className="text-red-400">*</span>
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                transition-all bg-gray-50/50 text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">Select semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s.toString()}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2
            px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200
            ${
              uploading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md"
            }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <FiUploadCloud /> Upload Notes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default UploadNotes;
