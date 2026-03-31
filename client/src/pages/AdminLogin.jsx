import React from "react";
import Auth from "./Auth";

function AdminLogin() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-150">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <Auth role="admin" note="Admins can manage users, teachers, and view all generated notes." />
      </div>
    </div>
  );
}

export default AdminLogin;
