"use client";

import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Zap, Sparkles, TrendingUp } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  userName?: string;
  onQuickAdd: () => void;
}

export function StatsOverview({ stats, userName = "Student", onQuickAdd }: StatsOverviewProps) {
  return (
    <div className="space-y-4 mb-6">
      
      {/* Primary ArmourID Style Welcome Header Card */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-emerald-100 relative overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              Welcome, {userName}
            </h1>
            <p className="text-xs text-slate-500">Track academic progress, course deadlines, and daily assignments.</p>
          </div>

          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Vault</span>
          </div>
        </div>

        {/* 3 Metric Cards Grid (Matching Image 1) */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Completed Card (Green accent background) */}
          <div className="bg-emerald-50/80 border border-emerald-200/70 p-3.5 rounded-xl transition hover:shadow-xs">
            <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold block uppercase tracking-wider">Completed</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-800">{stats.completedTasks}</span>
              <span className="text-[11px] font-medium text-emerald-600">Tasks</span>
            </div>
          </div>

          {/* Pending Card (Clean Slate) */}
          <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl transition hover:shadow-xs">
            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold block uppercase tracking-wider">Pending</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-800">{stats.pendingTasks}</span>
              <span className="text-[11px] font-medium text-slate-500">Active</span>
            </div>
          </div>

          {/* Overdue / High Priority Card (Amber/Orange) */}
          <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl transition hover:shadow-xs">
            <span className="text-[10px] sm:text-xs text-amber-800 font-semibold block uppercase tracking-wider">Attention</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-900">{stats.overdueTasks}</span>
              <span className="text-[11px] font-medium text-amber-700">Overdue</span>
            </div>
          </div>
        </div>

        {/* Form Auto-Fill / Quick Action Banner (Matching Image 1 Yellow Banner) */}
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-amber-100 p-1.5 rounded-lg text-amber-700">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Academic Task Auto-Fill</p>
              <p className="text-[11px] text-slate-600 hidden sm:block">Quickly populate course templates for homework and lab reports.</p>
            </div>
          </div>

          <button
            onClick={onQuickAdd}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition transform active:scale-95 whitespace-nowrap"
          >
            Auto-Fill
          </button>
        </div>

      </div>

      {/* Secondary Status & Progress Bar Card */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-800">Overall Productivity</span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {stats.completionRate}% Done
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {stats.completedTasks} of {stats.totalTasks} total tasks finished
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full sm:w-48 bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

    </div>
  );
}
