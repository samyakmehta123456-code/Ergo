"use client";

import { CheckCircle2, Circle, Calendar, Zap, Sparkles, Check } from "lucide-react";
import { isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";

interface SimplerUpcomingViewProps {
  tasks: any[];
  onToggleStatus: (task: any) => void;
  onEdit: (task: any) => void;
  onOpenCreate: () => void;
}

export function SimplerUpcomingView({
  tasks,
  onToggleStatus,
  onEdit,
  onOpenCreate,
}: SimplerUpcomingViewProps) {
  const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED");

  const todayTasks = pendingTasks.filter((t) => t.dueDate && isToday(parseISO(t.dueDate)));
  const tomorrowTasks = pendingTasks.filter((t) => t.dueDate && isTomorrow(parseISO(t.dueDate)));
  const thisWeekTasks = pendingTasks.filter(
    (t) => t.dueDate && !isToday(parseISO(t.dueDate)) && !isTomorrow(parseISO(t.dueDate)) && isThisWeek(parseISO(t.dueDate))
  );
  const laterTasks = pendingTasks.filter(
    (t) => !t.dueDate || (!isToday(parseISO(t.dueDate)) && !isTomorrow(parseISO(t.dueDate)) && !isThisWeek(parseISO(t.dueDate)))
  );

  const sections = [
    { title: "Today", count: todayTasks.length, items: todayTasks, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { title: "Tomorrow", count: tomorrowTasks.length, items: tomorrowTasks, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { title: "This Week", count: thisWeekTasks.length, items: thisWeekTasks, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { title: "Later & Backlog", count: laterTasks.length, items: laterTasks, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Simple View Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-ergo-card p-5 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Simpler Focus View
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                Minimalist
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean task breakdown organized by time horizon for distraction-free completion.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-xl text-xs transition shadow-md"
        >
          + Add Task
        </button>
      </div>

      {/* 4 Time-Horizon Minimal Sections */}
      <div className="space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-ergo-card rounded-2xl p-4 border border-ergo-border space-y-3">
            
            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-ergo-border/60">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${sec.color}`}>
                  {sec.title}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{sec.count} items</span>
              </div>
            </div>

            {/* Checklist Items */}
            {sec.items.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2 px-1">No tasks scheduled for {sec.title.toLowerCase()}.</p>
            ) : (
              <div className="space-y-2">
                {sec.items.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-ergo-sidebar hover:bg-ergo-hover border border-ergo-border/40 transition group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 flex-1 truncate">
                      <button
                        onClick={() => onToggleStatus(task)}
                        className="w-5 h-5 rounded-full border border-slate-500 hover:border-emerald-400 flex items-center justify-center text-transparent hover:text-emerald-400 transition flex-shrink-0"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span
                        onClick={() => onEdit(task)}
                        className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white truncate"
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[10px] font-semibold text-slate-400 bg-ergo-bg px-2 py-0.5 rounded border border-ergo-border">
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
