"use client";

import { Search, Filter, List, LayoutGrid, Plus, Sparkles } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  viewMode: "list" | "kanban";
  setViewMode: (mode: "list" | "kanban") => void;
  onOpenCreateModal: () => void;
  onOpenPresetsModal: () => void;
  categories: string[];
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  viewMode,
  setViewMode,
  onOpenCreateModal,
  onOpenPresetsModal,
  categories,
}: FilterBarProps) {
  const statusOptions = [
    { id: "ALL", label: "All Tasks" },
    { id: "PENDING", label: "Pending" },
    { id: "IN_PROGRESS", label: "In Progress" },
    { id: "COMPLETED", label: "Completed" },
    { id: "OVERDUE", label: "Overdue" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-card border border-emerald-100/80 mb-6 space-y-4">
      
      {/* Top Search + Main Actions Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title, assignment name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          
          {/* Quick Presets Template Button */}
          <button
            onClick={onOpenPresetsModal}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Academic Templates</span>
            <span className="sm:hidden">Templates</span>
          </button>

          {/* Create Task Button */}
          <button
            onClick={onOpenCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 transition shadow-md hover:shadow-emerald-600/30 transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>

          {/* View Mode Switcher Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                viewMode === "list" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                viewMode === "kanban" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

        </div>

      </div>

      {/* Filter Tabs & Selectors Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        
        {/* Status Tab Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setStatusFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === opt.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Priority & Category Dropdown Selectors */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
