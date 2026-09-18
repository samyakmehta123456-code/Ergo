"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { parseTaskDate } from "@/lib/utils";

interface RightCalendarPanelProps {
  tasks: any[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function RightCalendarPanel({ tasks, selectedDate, onSelectDate }: RightCalendarPanelProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onSelectDate(today);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const taskDatesMap = new Set(
    tasks
      .filter((t) => t.dueDate && t.status !== "COMPLETED")
      .map((t) => {
        const d = parseTaskDate(t.dueDate);
        return d ? format(d, "yyyy-MM-dd") : null;
      })
      .filter(Boolean)
  );

  return (
    <div className="bg-[#3559E0] text-white rounded-3xl p-6 shadow-[0_15px_35px_rgba(53,89,224,0.3)] border border-white/20 relative overflow-hidden space-y-4 select-none">
      {/* Background wave depth pattern image matching progress card */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.png')] bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none" />
      {/* Background ambient lighting element */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

      {/* Month Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-white" />
          <h3 className="text-base font-extrabold text-white tracking-tight">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={goToToday}
            className="px-2.5 py-1 text-xs font-bold text-white bg-white/20 hover:bg-white/30 rounded-lg transition border border-white/30 mr-1 shadow-2xs"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 text-center text-[11px] font-bold text-white/80 uppercase tracking-wider relative z-10">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 relative z-10">
        {days.map((day, idx) => {
          const formattedDay = format(day, "yyyy-MM-dd");
          const hasTask = taskDatesMap.has(formattedDay);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonthDay = isSameMonth(day, currentMonth);
          const isDayToday = isToday(day);

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(day)}
              className={`h-9 rounded-xl flex flex-col items-center justify-center relative transition text-xs font-bold ${
                isSelected
                  ? "bg-white text-slate-900 shadow-md shadow-black/20 scale-105 z-10"
                  : isDayToday
                  ? "bg-[#6A99D4] text-white shadow-xs border border-white/40"
                  : !isCurrentMonthDay
                  ? "text-white/40 hover:bg-white/10"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <span className={isSelected ? "text-slate-900 font-black text-xs" : ""}>
                {format(day, "d")}
              </span>

              {/* Task Indicator Dot */}
              {hasTask && (
                <span
                  className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                    isSelected ? "bg-[#E84E4E]" : "bg-[#F4C447]"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Status */}
      <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80 relative z-10">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E84E4E]" />
          <span>Scheduled tasks date</span>
        </span>
        <span className="font-semibold text-white">
          Selected: {format(selectedDate, "MMM d")}
        </span>
      </div>

    </div>
  );
}
