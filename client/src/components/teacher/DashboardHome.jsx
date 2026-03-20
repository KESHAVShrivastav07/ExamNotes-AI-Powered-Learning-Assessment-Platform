import React, { useState, useEffect } from "react";
import StatsSection from "./StatsSection";
import TestManagement from "./TestManagement";
import NotesManagement from "./NotesManagement";
import StudentManagement from "./StudentManagement";
import PerformanceSection from "./PerformanceSection";
import TeacherAnalytics from "./TeacherAnalytics";
import TeacherCodePlayground from "./TeacherCodePlayground";
import axios from "axios";
import { serverUrl } from "../../App";

function DashboardHome({ userData, setActiveSection }) {
  const [stats, setStats] = useState({});
  const [tests, setTests] = useState([]);
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch dynamic stats from the backend stats endpoint
      const statsRes = await axios.get(serverUrl + "/api/teacher/stats", { withCredentials: true });
      setStats(statsRes.data);

      // Fetch specific lists
      const [testsRes, notesRes, studentsRes, resultsRes] = await Promise.all([
        axios.get(serverUrl + "/api/tests", { withCredentials: true }),
        axios.get(serverUrl + "/api/teacher/notes", { withCredentials: true }),
        axios.get(serverUrl + "/api/teacher/students", { withCredentials: true }),
        axios.get(serverUrl + "/api/teacher/results", { withCredentials: true }),
      ]);

      const testsData = testsRes.data;
      const notesData = notesRes.data;
      const studentsData = studentsRes.data;
      const resultsData = resultsRes.data;

      console.log("Students:", studentsData.length);
      console.log("Results:", resultsData.length);

      // Merge Logic (As requested by user)
      const studentsWithResults = studentsData.map(student => {
        const studentResults = resultsData.filter(
          r => r.studentId && (r.studentId._id || r.studentId) === student._id
        );
        const latest = studentResults[0]; // results are sorted by recency in backend

        return {
          ...student,
          testsAttempted: studentResults.length,
          latestResult: latest
        };
      });

      setTests(testsData);
      setNotes(notesData);
      setStudents(studentsWithResults);
      setResults(resultsData);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="mt-6 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {/* 1. Stats Cards */}
      <StatsSection stats={stats} />

      {/* 2. Test Management Section */}
      <section id="test-management">
        <div className="flex items-center gap-4 mb-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Test Management</h2>
           <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent"></div>
        </div>
        <TestManagement tests={tests} refresh={fetchDashboardData} />
      </section>

      {/* 3. Notes Management Section */}
      <section id="notes-management">
        <div className="flex items-center gap-4 mb-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Notes Management</h2>
           <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent"></div>
        </div>
        <NotesManagement notes={notes} refresh={fetchDashboardData} />
      </section>

      {/* 4. Student Management Section */}
      <section id="student-management">
        <div className="flex items-center gap-4 mb-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Student Management</h2>
           <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent"></div>
        </div>
        <StudentManagement students={students} refresh={fetchDashboardData} />
      </section>

      {/* 5. Performance Section */}
      <section id="performance">
        <div className="flex items-center gap-4 mb-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Student Results</h2>
           <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent"></div>
        </div>
        <PerformanceSection results={results} />
      </section>

      {/* 6. Analytics Section */}
      <section id="analytics">
        <div className="flex items-center gap-4 mb-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Advanced Analytics</h2>
           <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent"></div>
        </div>
        <TeacherAnalytics tests={tests} notes={notes} results={results} />
      </section>

      {/* 7. Code Playground */}
      <section id="playground">
        <div className="flex items-center gap-4 mb-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Development Tools</h2>
           <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent"></div>
        </div>
        <TeacherCodePlayground />
      </section>
    </div>
  );
}

export default DashboardHome;
