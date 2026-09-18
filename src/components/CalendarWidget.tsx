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
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface CalendarWidgetProps {
  tasks: any[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarWidget({ tasks, selectedDate, onSelectDate }: CalendarWidgetProps) {
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
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Map tasks to dates for quick lookup
  const taskDatesMap = new Set(
    tasks
      .filter((t) => t.dueDate && t.status !== "COMPLETED")
      .map((t) => format(parseISO(t.dueDate), "yyyy-MM-dd"))
  );

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.06),0_5px_15px_rgba(53,89,224,0.08)] border border-slate-200/90 relative overflow-hidden space-y-4 select-none">
      
      {/* Calendar Header: Month, Navigation, Today Button */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-[#3559E0]" />
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={goToToday}
            className="px-2.5 py-1 text-xs font-bold text-[#3559E0] bg-[#3559E0]/10 hover:bg-[#3559E0]/20 rounded-lg transition border border-[#3559E0]/20 mr-1"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider relative z-10">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
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
              className={`h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center relative transition text-xs font-bold ${
                isSelected
                  ? "bg-[#3559E0] text-white shadow-lg shadow-[#3559E0]/35 scale-105 z-10 font-black"
                  : isDayToday
                  ? "bg-[#3559E0]/15 text-[#3559E0] border border-[#3559E0]/30 font-extrabold"
                  : !isCurrentMonthDay
                  ? "text-slate-300 hover:bg-slate-50"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{format(day, "d")}</span>

              {/* Task Indicator Dot */}
              {hasTask && (
                <span
                  className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                    isSelected ? "bg-white" : "bg-[#E84E4E]"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend Footnote */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 relative z-10">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E84E4E]" />
          <span>Scheduled tasks date</span>
        </span>
        <span className="font-bold text-slate-800">
          Selected: {format(selectedDate, "MMM d, yyyy")}
        </span>
      </div>

    </div>
  );
}
