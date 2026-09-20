"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Edit2, Trash2, Flag, AlertTriangle } from "lucide-react";
import { formatDate, getDueDateStatus } from "@/lib/utils";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string | null;
    reason?: string | null;
    status: string;
    priority: string;
    category: string;
    dueDate?: string | null;
    createdAt: string;
  };
  onToggleStatus: (task: any) => void;
  onToggleFlag?: (task: any) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggleStatus, onToggleFlag, onEdit, onDelete }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [reasonText, setReasonText] = useState(task.reason || "");
  const [isEditingReason, setIsEditingReason] = useState(false);
  const [savingReason, setSavingReason] = useState(false);

  const isCompleted = task.status === "COMPLETED";
  const isFlagged = task.priority === "HIGH" || task.priority === "URGENT";
  const dueStatus = getDueDateStatus(task.dueDate, isCompleted);
  const isOverdue = dueStatus.label === "Overdue" || (task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      setIsDeleting(true);
      onDelete(task.id);
    }
  };

  const handleSaveReasonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingReason(true);
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reasonText }),
      });
      if (res.ok) {
        setIsEditingReason(false);
        task.reason = reasonText;
      }
    } catch {
      // ignore
    } finally {
      setSavingReason(false);
    }
  };

  return (
    <div
      className={`rounded-3xl p-5 border transition-all duration-200 relative overflow-hidden backdrop-blur-md ${
        isCompleted
          ? "bg-gradient-to-br from-[#5BB876]/10 via-white to-emerald-50/30 border-[#5BB876]/40 shadow-[0_8px_25px_rgba(91,184,118,0.12)] hover:shadow-[0_12px_30px_rgba(91,184,118,0.2)] hover:scale-[1.008]"
          : "bg-gradient-to-br from-[#E84E4E]/5 via-white to-rose-50/30 border-[#E84E4E]/30 shadow-[0_8px_25px_rgba(232,78,78,0.1)] hover:shadow-[0_12px_30px_rgba(232,78,78,0.18)] hover:scale-[1.008]"
      }`}
    >
      {/* Subtle Background Pattern Layer for Depth Effect */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.png')] bg-cover opacity-10 pointer-events-none" />

      {/* Top Row: Title + Category Subtitle + Right Circle Checkbox */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="space-y-0.5 flex-1">
          <h3
            className={`text-base font-bold leading-snug ${
              isCompleted ? "line-through text-slate-500 font-medium" : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>
          <p className={`text-xs font-bold ${isCompleted ? "text-[#5BB876]" : "text-[#E84E4E]"}`}>
            {task.category}
          </p>
        </div>

        {/* Right Circle Completion Checkbox */}
        <button
          onClick={() => onToggleStatus(task)}
          className="transition flex-shrink-0 mt-0.5"
          title={isCompleted ? "Mark Open" : "Mark Closed"}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-[#5BB876] fill-[#5BB876]/20" />
          ) : (
            <Circle className="w-6 h-6 text-[#E84E4E] stroke-[2.2] hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Description Block */}
      {task.description && (
        <div className="mt-3 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/70 shadow-xs relative z-10">
          <span className="text-xs font-bold text-slate-800 block mb-0.5">Description:</span>
          <p className={`text-xs text-slate-600 font-normal leading-relaxed ${isCompleted ? "line-through opacity-70" : ""}`}>
            {task.description}
          </p>
        </div>
      )}

      {/* Overdue Delay Reason Block */}
      {isOverdue && (
        <div className="mt-3 bg-amber-50/90 backdrop-blur-md p-3 rounded-2xl border border-amber-200/80 shadow-xs relative z-10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Delay Reason:</span>
            </span>
            <button
              onClick={() => setIsEditingReason(!isEditingReason)}
              className="text-[10px] font-bold text-[#3559E0] hover:underline bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200"
            >
              {reasonText ? "Edit Reason" : "+ Add Reason"}
            </button>
          </div>

          {isEditingReason ? (
            <form onSubmit={handleSaveReasonSubmit} className="space-y-2 pt-1">
              <textarea
                rows={2}
                autoFocus
                placeholder="Explain why this task was not completed on the assigned day..."
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#3559E0] outline-none"
              />
              <div className="flex items-center justify-end space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsEditingReason(false)}
                  className="px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReason}
                  className="px-3 py-1 text-[11px] font-bold bg-[#3559E0] text-white rounded-lg hover:bg-[#2c4ac0] transition shadow-xs"
                >
                  {savingReason ? "Saving..." : "Save Reason"}
                </button>
              </div>
            </form>
          ) : reasonText ? (
            <p className="text-xs text-amber-950 font-medium italic leading-relaxed">
              "{reasonText}"
            </p>
          ) : (
            <p className="text-[11px] text-amber-700/80 font-normal italic">
              No delay reason provided yet. Click "+ Add Reason" to explain the delay.
            </p>
          )}
        </div>
      )}

      {/* Bottom Row: Due Info & Badge + Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 relative z-10">
        
        {/* Due Date Info */}
        <div className="flex items-center space-x-2">
          {task.dueDate ? (
            <span className="font-semibold text-slate-700">
              DUE: {formatDate(task.dueDate)}
            </span>
          ) : (
            <span className="text-slate-400 font-medium">No due date</span>
          )}

          {dueStatus.label && (
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-xl border ${
                dueStatus.label === "Overdue"
                  ? "bg-[#E84E4E]/15 text-[#E84E4E] border-[#E84E4E]/30"
                  : dueStatus.label === "Due Today"
                  ? "bg-[#F4C447]/20 text-[#9E7710] border-[#F4C447]/40"
                  : isCompleted
                  ? "bg-[#5BB876]/15 text-[#5BB876] border-[#5BB876]/30"
                  : "bg-[#3559E0]/15 text-[#3559E0] border-[#3559E0]/30"
              }`}
            >
              {dueStatus.label}
            </span>
          )}
        </div>

        {/* Flag, Edit & Delete Icons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggleFlag && onToggleFlag(task)}
            className={`p-1.5 rounded-lg transition ${
              isFlagged
                ? "text-[#E68BA2] bg-[#E68BA2]/15 hover:bg-[#E68BA2]/25"
                : "text-slate-400 hover:text-[#E68BA2] hover:bg-[#E68BA2]/10"
            }`}
            title={isFlagged ? "Unflag task" : "Flag task"}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? "fill-[#E68BA2]" : ""}`} />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-[#3559E0] hover:bg-[#3559E0]/10 rounded-lg transition"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-[#E84E4E] hover:bg-[#E84E4E]/10 rounded-lg transition disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
