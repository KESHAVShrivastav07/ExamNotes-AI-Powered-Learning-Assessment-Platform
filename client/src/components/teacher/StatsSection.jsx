import React from 'react';
import DashboardCard from './DashboardCard';

const StatsSection = ({ stats = {} }) => {
  const statList = [
    { title: "Total Tests Created", value: stats.totalTests || "0", icon: "📝" },
    { title: "Upcoming Tests", value: stats.upcomingCount || "0", icon: "📅" },
    { title: "Students Attempted", value: stats.studentsAttemptedCount || "0", icon: "👥" },
    { title: "Average Score", value: (stats.avgScore || "0") + "%", icon: "📊" },
    { title: "Total Notes Uploaded", value: stats.totalUploads || "0", icon: "📚" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statList.map((stat, index) => (
        <DashboardCard key={index} icon={stat.icon} title={stat.title} delay={index * 0.1}>
          <p className="text-2xl font-extrabold text-white mt-2">{stat.value}</p>
        </DashboardCard>
      ))}
    </div>
  );
};

export default StatsSection;
