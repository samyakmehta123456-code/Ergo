"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ListFilter,
  Flag,
  LogOut,
  CheckSquare,
  Plus,
  FolderPlus,
} from "lucide-react";

import { isTaskToday, isTaskThisWeek, isTaskThisMonth } from "@/lib/utils";

interface SidebarProps {
  activeListId: string;
  setActiveListId: (id: string) => void;
  tasks: any[];
  user: { name: string; email: string } | null;
  onLogout: () => void;
  isCollapsed: boolean;
  customProjects: string[];
  onAddProject: (projectName: string) => void;
}

export function Sidebar({
  activeListId,
  setActiveListId,
  tasks,
  user,
  onLogout,
  isCollapsed,
  customProjects,
  onAddProject,
}: SidebarProps) {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const todayCount = tasks.filter(
    (t) => t.dueDate && isTaskToday(t.dueDate) && t.status !== "COMPLETED"
  ).length;

  const scheduledCount = tasks.filter(
    (t) => t.dueDate && isTaskThisWeek(t.dueDate) && t.status !== "COMPLETED"
  ).length;

  const monthlyCount = tasks.filter(
    (t) => t.dueDate && isTaskThisMonth(t.dueDate) && t.status !== "COMPLETED"
  ).length;

  const allCount = tasks.filter((t) => t.status !== "COMPLETED").length;

  const flaggedCount = tasks.filter(
    (t) => (t.priority === "URGENT" || t.priority === "HIGH") && t.status !== "COMPLETED"
  ).length;

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  const smartLists = [
    {
      id: "today",
      title: "Today",
      count: todayCount,
      icon: Calendar,
      iconColor: "text-[#6A99D4]",
    },
    {
      id: "scheduled",
      title: "Weekly",
      count: scheduledCount,
      icon: Clock,
      iconColor: "text-[#E84E4E]",
    },
    {
      id: "monthly",
      title: "Monthly",
      count: monthlyCount,
      icon: ListFilter,
      iconColor: "text-[#3559E0]",
    },
    {
      id: "all",
      title: "All",
      count: allCount,
      icon: CheckSquare,
      iconColor: "text-[#6A99D4]",
    },
    {
      id: "flagged",
      title: "Flagged",
      count: flaggedCount,
      icon: Flag,
      iconColor: "text-[#E68BA2]",
    },
    {
      id: "completed",
      title: "Completed",
      count: completedCount,
      icon: CheckCircle2,
      iconColor: "text-[#5BB876]",
    },
  ];

  // Derive unique projects dynamically from user's tasks + custom added projects
  const taskCategories = Array.from(
    new Set(tasks.map((t) => t.category).filter(Boolean))
  );
  const allProjects = Array.from(new Set([...customProjects, ...taskCategories]));

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim());
      setActiveListId(`cat-${newProjectName.trim()}`);
      setNewProjectName("");
      setIsAddingProject(false);
    }
  };

  const projectColors = [
    "bg-[#3559E0]",
    "bg-[#E84E4E]",
    "bg-[#5BB876]",
    "bg-[#F4C447]",
    "bg-[#6A99D4]",
    "bg-[#E68BA2]",
  ];

  if (isCollapsed) {
    return (
      <aside className="w-16 bg-[#F3F3F5] border-r border-slate-200/90 flex flex-col h-screen sticky top-0 items-center py-4 space-y-3 select-none flex-shrink-0 z-30 transition-all">
        <div className="flex-1 space-y-3 pt-2">
          {smartLists.map((card) => {
            const Icon = card.icon;
            const isActive = activeListId === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setActiveListId(card.id)}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-[#3559E0] text-white shadow-md shadow-[#3559E0]/30"
                    : "bg-white text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-100 hover:text-slate-900"
                }`}
                title={card.title}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-[#F3F3F5] border-r border-slate-200/90 flex flex-col h-screen sticky top-0 text-slate-800 flex-shrink-0 z-30 select-none transition-all">
      
      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
        
        {/* LIGHT GREYISH FLOATING BOX CONTAINER FOR NAVIGATION LISTS */}
        <div className="bg-[#EBECEF] rounded-2xl p-2 shadow-2xs border border-slate-300/60 space-y-1">
          {smartLists.map((item) => {
            const Icon = item.icon;
            const isActive = activeListId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveListId(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#3559E0] text-white font-bold shadow-md shadow-[#3559E0]/30"
                    : "text-slate-700 hover:bg-white/70 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? "bg-white/20 text-white" : "bg-white border border-slate-200/80 shadow-2xs " + item.iconColor
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <span>{item.title}</span>
                </div>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-white text-slate-600 border border-slate-200/80 shadow-2xs"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* PROJECTS SECTION */}
        <div className="space-y-1.5 pt-2">
          <div className="px-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Projects
            </span>
            <button
              onClick={() => setIsAddingProject(!isAddingProject)}
              className="p-1 hover:bg-slate-200/80 rounded-lg text-slate-500 hover:text-slate-900 transition flex items-center gap-1 text-[11px] font-bold"
              title="Add New Project"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Project</span>
            </button>
          </div>

          {/* New Project Input Form */}
          {isAddingProject && (
            <form onSubmit={handleCreateProjectSubmit} className="px-2 py-1 space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#3559E0] outline-none"
              />
              <div className="flex items-center justify-end space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] font-bold bg-[#3559E0] text-white rounded-lg hover:bg-[#2c4ac0] transition"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          {/* Render User Projects */}
          {allProjects.length === 0 ? (
            <div className="px-3 py-3 text-center bg-white/60 rounded-xl border border-slate-200/60">
              <FolderPlus className="w-5 h-5 mx-auto text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-500">No projects yet</p>
              <button
                onClick={() => setIsAddingProject(true)}
                className="mt-1.5 text-xs font-bold text-[#3559E0] hover:underline"
              >
                + Create First Project
              </button>
            </div>
          ) : (
            allProjects.map((projectName, idx) => {
              const listId = `cat-${projectName}`;
              const isActive = activeListId === listId;
              const projectTasksCount = tasks.filter(
                (t) => t.category.toLowerCase() === projectName.toLowerCase()
              ).length;
              const colorClass = projectColors[idx % projectColors.length];

              return (
                <button
                  key={projectName}
                  onClick={() => setActiveListId(listId)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-900 shadow-xs font-bold border border-slate-200"
                      : "text-slate-700 hover:bg-slate-200/60"
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="truncate">{projectName}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{projectTasksCount}</span>
                </button>
              );
            })
          )}
        </div>

      </div>

      {/* Footer User & Logout */}
      <div className="p-3 border-t border-slate-200/80 bg-[#F3F3F5]">
        {user && (
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}

