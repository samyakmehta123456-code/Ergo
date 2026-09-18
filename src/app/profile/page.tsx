"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, CheckCircle2, Clock, Calendar, Flag, User, Mail, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats, setStats] = useState<{ total: number; completed: number; pending: number; highPriority: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        const tasksRes = await fetch("/api/tasks");
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          const tasksList = tasksData.tasks || [];
          const total = tasksList.length;
          const completed = tasksList.filter((t: any) => t.status === "COMPLETED").length;
          const pending = total - completed;
          const highPriority = tasksList.filter((t: any) => t.priority === "HIGH" || t.priority === "URGENT").length;
          setStats({ total, completed, pending, highPriority });
        }
      } catch (err) {
        console.error("Failed loading profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3559E0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#6A99D4]/20">
      {/* Top Bar */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="font-extrabold text-xl text-slate-900 tracking-tight">Ergo Profile</span>
        <div className="w-24"></div>
      </header>

      <main className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
        
        {/* Profile Card with Depth Effect */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_30px_rgba(53,89,224,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#3559E0]/10 via-[#6A99D4]/10 to-transparent rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
          
          <div className="flex items-center space-x-5 z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3559E0] to-[#6A99D4] text-white font-black text-3xl flex items-center justify-center shadow-md shadow-[#3559E0]/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || "User Account"}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5BB876]/15 text-[#5BB876] border border-[#5BB876]/30">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 mt-1 flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#E84E4E] hover:bg-[#d44343] text-white font-bold text-xs rounded-xl shadow-md shadow-[#E84E4E]/20 flex items-center justify-center space-x-2 transition z-10"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Task Overview Stats Grid */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
            Account Activity & Statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Tasks Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(53,89,224,0.05)] hover:shadow-[0_6px_25px_rgba(53,89,224,0.1)] transition-all flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Tasks</span>
                <div className="w-8 h-8 rounded-xl bg-[#3559E0]/10 flex items-center justify-center text-[#3559E0]">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900">{stats?.total || 0}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Created across all lists</p>
              </div>
            </div>

            {/* Completed Tasks Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(91,184,118,0.05)] hover:shadow-[0_6px_25px_rgba(91,184,118,0.1)] transition-all flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Completed</span>
                <div className="w-8 h-8 rounded-xl bg-[#5BB876]/10 flex items-center justify-center text-[#5BB876]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-[#5BB876]">{stats?.completed || 0}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Tasks done successfully</p>
              </div>
            </div>

            {/* Pending Tasks Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(106,153,212,0.05)] hover:shadow-[0_6px_25px_rgba(106,153,212,0.1)] transition-all flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Pending</span>
                <div className="w-8 h-8 rounded-xl bg-[#6A99D4]/10 flex items-center justify-center text-[#6A99D4]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-[#6A99D4]">{stats?.pending || 0}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Active tasks in progress</p>
              </div>
            </div>

            {/* High Priority Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(232,78,78,0.05)] hover:shadow-[0_6px_25px_rgba(232,78,78,0.1)] transition-all flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Urgent & High</span>
                <div className="w-8 h-8 rounded-xl bg-[#E84E4E]/10 flex items-center justify-center text-[#E84E4E]">
                  <Flag className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-[#E84E4E]">{stats?.highPriority || 0}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Requires priority attention</p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
