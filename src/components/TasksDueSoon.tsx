"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, ChevronDown, Sparkles } from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

interface TasksDueSoonProps {
  tasks: any[];
  onToggleStatus: (task: any) => void;
  onEdit: (task: any) => void;
  onSeeAll: () => void;
}

export function TasksDueSoon({ tasks, onToggleStatus, onEdit, onSeeAll }: TasksDueSoonProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Filter pending/due soon tasks
  const dueSoonTasks = tasks.filter((t) => t.status !== "COMPLETED").slice(0, 6);

  const getTagColorClass = (category: string, priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "HIGH":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "MEDIUM":
        return "bg-violet-500/20 text-violet-300 border-violet-500/30";
      case "LOW":
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }
  };

  const formatRelativeDueDate = (dateStr: string | null) => {
    if (!dateStr) return "No Date";
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE"); // e.g. Saturday, Sunday, Tuesday
  };

  return (
    <div className="bg-ergo-card rounded-2xl border border-ergo-border overflow-hidden mb-8 shadow-md">
      
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-ergo-border/80">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-sm font-bold text-white hover:text-emerald-400 transition"
        >
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
          <span>Tasks Due Soon</span>
        </button>

        <button
          onClick={onSeeAll}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition flex items-center space-x-1"
        >
          <span>See all my tasks</span>
        </button>
      </div>

      {/* Task Rows (Matching Screenshot Table) */}
      {isOpen && (
        <div className="divide-y divide-ergo-border/50">
          {dueSoonTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No upcoming tasks due soon. Click + to create one or use Auto-Fill templates!
            </div>
          ) : (
            dueSoonTasks.map((task) => {
              const tagClass = getTagColorClass(task.category, task.priority);
              const dueText = formatRelativeDueDate(task.dueDate);

              return (
                <div
                  key={task.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-ergo-hover/60 transition group cursor-pointer"
                >
                  {/* Left: Checkbox + Title + Category */}
                  <div className="flex items-center space-x-3.5 flex-1 truncate pr-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(task);
                      }}
                      className="text-slate-500 hover:text-emerald-400 transition flex-shrink-0"
                    >
                      <Circle className="w-4 h-4 stroke-[1.75]" />
                    </button>

                    <span
                      onClick={() => onEdit(task)}
                      className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white truncate"
                    >
                      {task.title}
                    </span>

                    {task.category && (
                      <span className="text-[10px] text-slate-500 hidden md:inline truncate">
                        ‹ {task.category}
                      </span>
                    )}
                  </div>

                  {/* Right: Vibrant Pill Tags & Smart Due Date */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    
                    {/* Category / Priority Badge Pill */}
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${tagClass}`}
                    >
                      {task.category}
                    </span>

                    {/* Priority Tag */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline">
                      {task.priority}
                    </span>

                    {/* Due Date Text */}
                    <span
                      className={`text-xs font-semibold min-w-[70px] text-right ${
                        dueText === "Today"
                          ? "text-amber-400 font-bold"
                          : dueText === "Tomorrow"
                          ? "text-emerald-400"
                          : "text-slate-400"
                      }`}
                    >
                      {dueText}
                    </span>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
