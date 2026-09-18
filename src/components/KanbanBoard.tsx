"use client";

import { CheckCircle2, Circle, Plus, MoveRight, MoveLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface KanbanBoardProps {
  tasks: any[];
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onEdit: (task: any) => void;
  onOpenCreate: () => void;
}

export function KanbanBoard({ tasks, onUpdateStatus, onEdit, onOpenCreate }: KanbanBoardProps) {
  const columns = [
    {
      id: "PENDING",
      title: "To Do",
      accent: "bg-slate-400",
      items: tasks.filter((t) => t.status === "PENDING"),
    },
    {
      id: "IN_PROGRESS",
      title: "In Progress",
      accent: "bg-amber-400",
      items: tasks.filter((t) => t.status === "IN_PROGRESS"),
    },
    {
      id: "COMPLETED",
      title: "Completed",
      accent: "bg-emerald-400",
      items: tasks.filter((t) => t.status === "COMPLETED"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {columns.map((col) => (
        <div
          key={col.id}
          className="bg-ergo-card rounded-2xl p-4 border border-ergo-border flex flex-col h-full min-h-[420px]"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-ergo-border/60">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${col.accent}`} />
              <h3 className="font-bold text-white text-sm">{col.title}</h3>
              <span className="bg-ergo-sidebar px-2 py-0.5 rounded-full text-xs font-semibold text-slate-300 border border-ergo-border">
                {col.items.length}
              </span>
            </div>

            {col.id === "PENDING" && (
              <button
                onClick={onOpenCreate}
                className="p-1 hover:bg-ergo-hover rounded-lg text-slate-400 hover:text-white transition"
                title="Add Task"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Column Cards */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
            {col.items.length === 0 ? (
              <div className="border border-dashed border-ergo-border/80 rounded-xl p-6 text-center text-slate-500 text-xs">
                No tasks in {col.title}
              </div>
            ) : (
              col.items.map((task) => (
                <div
                  key={task.id}
                  className="bg-ergo-sidebar rounded-xl p-3.5 border border-ergo-border/80 hover:border-slate-500 transition space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      onClick={() => onEdit(task)}
                      className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-emerald-400 cursor-pointer line-clamp-2"
                    >
                      {task.title}
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-ergo-border/50">
                    <span className="bg-ergo-card text-slate-300 font-medium px-1.5 py-0.5 rounded border border-ergo-border">
                      {task.category}
                    </span>

                    <div className="flex items-center space-x-1">
                      {col.id !== "PENDING" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(task.id, col.id === "COMPLETED" ? "IN_PROGRESS" : "PENDING")
                          }
                          className="p-1 hover:bg-ergo-hover rounded text-slate-400 hover:text-white transition"
                          title="Move Left"
                        >
                          <MoveLeft className="w-3 h-3" />
                        </button>
                      )}
                      {col.id !== "COMPLETED" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(task.id, col.id === "PENDING" ? "IN_PROGRESS" : "COMPLETED")
                          }
                          className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded transition"
                          title="Move Right"
                        >
                          <MoveRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
