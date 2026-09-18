"use client";

import { ShieldCheck, LogOut, Download, Sparkles, UserCheck } from "lucide-react";
import { exportTasksToCSV } from "@/lib/utils";

interface NavbarProps {
  user: { name: string; email: string } | null;
  tasks: any[];
  onLogout: () => void;
}

export function Navbar({ user, tasks, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100/70 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 text-white p-2 rounded-2xl shadow-sm flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-800 tracking-tight">TaskFlow</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> Lunorsoft
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Academic & Personal Student Vault</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <div className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">{user.name}</span>
                <span className="text-slate-400 block text-[10px] truncate max-w-[140px]">{user.email}</span>
              </div>
            </div>

            <button
              onClick={() => exportTasksToCSV(tasks)}
              title="Export tasks to CSV"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onLogout}
              title="Logout"
              className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 p-2 rounded-xl transition text-xs flex items-center border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
