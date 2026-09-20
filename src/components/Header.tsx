"use client";

import { useState } from "react";
import { Search, Plus, Download, PanelLeft, X, Calendar, FolderKanban } from "lucide-react";
import Link from "next/link";
import { exportTasksToCSV } from "@/lib/utils";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenCreate: () => void;
  tasks: any[];
  user: { name: string; email: string } | null;
  onToggleSidebar: () => void;
  onDemoLogin?: () => void;
  onToggleCalendar?: () => void;
  isCalendarOpen?: boolean;
  onOpenMobileProjects?: () => void;
}

export function Header({
  searchQuery,
  setSearchQuery,
  onOpenCreate,
  tasks,
  user,
  onToggleSidebar,
  onDemoLogin,
  onToggleCalendar,
  isCalendarOpen,
  onOpenMobileProjects,
}: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      
      {/* Left: Sidebar Collapse Toggle (Desktop only) + New Task + CSV Export + Calendar Icon */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Sidebar Toggle - HIDDEN on mobile, visible on md+ */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:inline-flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition border border-slate-200"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenCreate}
          className="bg-[#3559E0] hover:bg-[#2c4ac0] text-white font-bold p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-xs shadow-[#3559E0]/20"
          title="New Task"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        <button
          onClick={() => exportTasksToCSV(tasks)}
          title="Export CSV"
          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs transition border border-slate-200"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Calendar Toggle Button right beside Download Icon */}
        <button
          onClick={onToggleCalendar}
          title="Toggle Calendar View"
          className={`p-1.5 rounded-xl text-xs transition border flex items-center justify-center ${
            isCalendarOpen
              ? "bg-[#3559E0] text-white border-[#3559E0] shadow-sm"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
          }`}
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* CENTER: PURE TITLE 'Ergo' ONLY - PERFECTLY CENTERED */}
      {!isMobileSearchOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-none">
          <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">Ergo</span>
        </div>
      )}

      {/* Right: Projects (Mobile), Search & User Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Mobile Projects Icon Button (sm:hidden) */}
        {onOpenMobileProjects && (
          <button
            onClick={onOpenMobileProjects}
            className="sm:hidden p-1.5 bg-slate-100 hover:bg-slate-200 text-[#3559E0] rounded-xl text-xs transition border border-slate-200 flex items-center justify-center"
            title="Projects"
          >
            <FolderKanban className="w-4 h-4" />
          </button>
        )}

        {/* Desktop Search Bar (sm and up) */}
        <div className="hidden sm:relative sm:block w-40 sm:w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3559E0] focus:bg-white transition"
          />
        </div>

        {/* Mobile Search Icon Button & Expanded Input */}
        <div className="sm:hidden">
          {isMobileSearchOpen ? (
            <div className="flex items-center space-x-1 bg-slate-100 border border-slate-300 rounded-xl px-2 py-1">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-28 bg-transparent text-xs text-slate-900 outline-none"
              />
              <button
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-0.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs transition border border-slate-200 flex items-center justify-center"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {user ? (
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3559E0] to-[#6A99D4] text-white font-bold flex items-center justify-center text-xs shadow-xs shadow-[#3559E0]/30 hover:scale-105 transition-transform"
            title="View Profile"
          >
            {user.name.charAt(0).toUpperCase()}
          </Link>
        ) : (
          onDemoLogin && (
            <button
              onClick={onDemoLogin}
              className="bg-[#3559E0] hover:bg-[#2c4ac0] text-white font-bold px-2.5 py-1.5 rounded-xl text-xs transition shadow-xs"
            >
              Demo Access
            </button>
          )
        )}
      </div>

    </header>
  );
}
