"use client";

import { useState, useMemo } from "react";
import { ProgressHeroCard } from "@/components/ProgressHeroCard";
import { TaskCard } from "@/components/TaskCard";
import { Inbox } from "lucide-react";

interface SectionColumnsProps {
  title: string;
  tasks: any[];
  onToggleStatus: (task: any) => void;
  onToggleFlag?: (task: any) => void;
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onOpenCreate: () => void;
}

export function SectionColumns({
  title,
  tasks,
  onToggleStatus,
  onToggleFlag,
  onEdit,
  onDelete,
  onOpenCreate,
}: SectionColumnsProps) {
  const [filterState, setFilterState] = useState<"ALL" | "OPEN" | "CLOSED">("ALL");

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const openTasks = totalTasks - completedTasks;

  const displayTasks = useMemo(() => {
    let list = tasks;
    if (filterState === "OPEN") {
      list = tasks.filter((t) => t.status !== "COMPLETED");
    } else if (filterState === "CLOSED") {
      list = tasks.filter((t) => t.status === "COMPLETED");
    }
    return [...list].sort((a, b) => {
      const aDone = a.status === "COMPLETED" ? 1 : 0;
      const bDone = b.status === "COMPLETED" ? 1 : 0;
      return aDone - bDone;
    });
  }, [tasks, filterState]);

  return (
    <div className="space-y-6">
      
      {/* Progress Hero Card for Every List & View (Matching Reference Image Top Hero Card) */}
      <ProgressHeroCard
        title={title}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        onOpenCreate={onOpenCreate}
      />

      {/* Taskly Filter Pills Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <span>Filter:</span>
          
          <button
            onClick={() => setFilterState("ALL")}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 transition ${
              filterState === "ALL"
                ? "bg-[#3559E0] text-white shadow-xs shadow-[#3559E0]/25"
                : "bg-slate-200/80 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <span>All</span>
            <span className="bg-white/20 text-current px-1.5 py-0.2 rounded-full text-[10px]">
              {totalTasks}
            </span>
          </button>

          <button
            onClick={() => setFilterState("OPEN")}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 transition ${
              filterState === "OPEN"
                ? "bg-[#3559E0] text-white shadow-xs shadow-[#3559E0]/25"
                : "bg-slate-200/80 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <span>Open</span>
            <span className="bg-white/20 text-current px-1.5 py-0.2 rounded-full text-[10px]">
              {openTasks}
            </span>
          </button>

          <button
            onClick={() => setFilterState("CLOSED")}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 transition ${
              filterState === "CLOSED"
                ? "bg-[#3559E0] text-white shadow-xs shadow-[#3559E0]/25"
                : "bg-slate-200/80 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <span>Closed</span>
            <span className="bg-white/20 text-current px-1.5 py-0.2 rounded-full text-[10px]">
              {completedTasks}
            </span>
          </button>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {displayTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-[0_4px_20px_rgba(53,89,224,0.05)]">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No tasks match this filter</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Click Add Task to create a new item.</p>
            <button
              onClick={onOpenCreate}
              className="bg-[#3559E0] hover:bg-[#2c4ac0] text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-[#3559E0]/20"
            >
              + Create New Task
            </button>
          </div>
        ) : (
          displayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onToggleFlag={onToggleFlag}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

    </div>
  );
}
