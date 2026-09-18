import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isBefore, isThisWeek, isThisMonth } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseTaskDate(d: any): Date | null {
  if (!d) return null;
  if (d instanceof Date) return d;
  if (typeof d === "string") {
    const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const y = parseInt(match[1], 10);
      const m = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return new Date(y, m, day);
    }
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

export function isTaskToday(dateInput: any): boolean {
  const taskDate = parseTaskDate(dateInput);
  if (!taskDate) return false;
  const now = new Date();
  return (
    taskDate.getFullYear() === now.getFullYear() &&
    taskDate.getMonth() === now.getMonth() &&
    taskDate.getDate() === now.getDate()
  );
}

export function isSameCalendarDay(dateInput: any, targetDate: Date): boolean {
  const taskDate = parseTaskDate(dateInput);
  if (!taskDate) return false;
  return (
    taskDate.getFullYear() === targetDate.getFullYear() &&
    taskDate.getMonth() === targetDate.getMonth() &&
    taskDate.getDate() === targetDate.getDate()
  );
}

export function isTaskThisWeek(dateInput: any): boolean {
  const taskDate = parseTaskDate(dateInput);
  if (!taskDate) return false;
  return isThisWeek(taskDate, { weekStartsOn: 1 });
}

export function isTaskThisMonth(dateInput: any): boolean {
  const taskDate = parseTaskDate(dateInput);
  if (!taskDate) return false;
  return isThisMonth(taskDate);
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "No due date";
  const date = parseTaskDate(dateString);
  if (!date) return "No due date";
  return format(date, "MMM d, yyyy");
}

export function getDueDateStatus(dateString: string | Date | null | undefined, isCompleted: boolean) {
  if (!dateString || isCompleted) return { label: null, color: "" };
  const date = parseTaskDate(dateString);
  if (!date) return { label: null, color: "" };
  
  if (isTaskToday(dateString)) {
    return { label: "Due Today", color: "bg-amber-50 text-amber-700 border-amber-200 font-semibold" };
  }
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date < startOfToday) {
    return { label: "Overdue", color: "bg-red-50 text-red-700 border-red-200" };
  }
  
  return { label: "Upcoming", color: "bg-blue-50 text-blue-700 border-blue-200" };
}

export function getPriorityBadge(priority: string) {
  switch (priority.toUpperCase()) {
    case "URGENT":
      return { label: "Urgent", badgeClass: "bg-red-500 text-white font-bold" };
    case "HIGH":
      return { label: "High", badgeClass: "bg-orange-500 text-white font-semibold" };
    case "MEDIUM":
      return { label: "Medium", badgeClass: "bg-amber-400 text-slate-900 font-medium" };
    case "LOW":
    default:
      return { label: "Low", badgeClass: "bg-emerald-100 text-emerald-800 font-medium" };
  }
}

export function exportTasksToCSV(tasks: any[]) {
  const headers = ["ID", "Title", "Description", "Status", "Priority", "Category", "Due Date", "Created At"];
  const rows = tasks.map((t) => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${(t.description || "").replace(/"/g, '""')}"`,
    t.status,
    t.priority,
    `"${t.category}"`,
    t.dueDate ? format(new Date(t.dueDate), "yyyy-MM-dd") : "",
    format(new Date(t.createdAt), "yyyy-MM-dd HH:mm"),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `TaskFlow_Student_Tasks_${format(new Date(), "yyyyMMdd")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

