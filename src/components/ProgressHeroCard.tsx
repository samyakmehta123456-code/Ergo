"use client";

import { Calendar, Plus } from "lucide-react";
import { format } from "date-fns";

interface ProgressHeroCardProps {
  title: string;
  totalTasks: number;
  completedTasks: number;
  targetDate?: string;
  onOpenCreate: () => void;
}

export function ProgressHeroCard({
  title,
  totalTasks,
  completedTasks,
  targetDate,
  onOpenCreate,
}: ProgressHeroCardProps) {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-[#3559E0] text-white rounded-3xl p-6 shadow-[0_15px_35px_rgba(53,89,224,0.3)] border border-white/20 relative overflow-hidden space-y-4">
      {/* Background wave depth pattern image */}
      <div 
        className="absolute inset-0 bg-[url('/bg-pattern.png')] bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none"
      />
      {/* Background ambient lighting element */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

      {/* Top Row: Title & Add Button */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{title}</h2>
          <p className="text-xs text-white/80 mt-1">
            You have <span className="text-[#F4C447] font-extrabold">{totalTasks - completedTasks}</span> open items
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="bg-white hover:bg-slate-100 text-[#3559E0] font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-1.5 pt-1 relative z-10">
        <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden border border-white/20 p-0.5">
          <div
            className="bg-gradient-to-r from-[#5BB876] to-[#6A99D4] h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-white/80">
          <span>Progress</span>
          <span className="text-white font-bold">{completionPercentage}%</span>
        </div>
      </div>

      {/* Bottom Due Date Info */}
      <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-white/80 relative z-10">
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#F4C447]" />
          <span>Target Date:</span>
          <span className="text-white font-medium">
            {targetDate || format(new Date(), "MMM d, yyyy")}
          </span>
        </div>
        <span className="text-white/70 text-[11px]">
          {completedTasks}/{totalTasks} completed
        </span>
      </div>

    </div>
  );
}
