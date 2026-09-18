"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { SectionColumns } from "@/components/SectionColumns";
import { RightCalendarPanel } from "@/components/RightCalendarPanel";
import { TaskModal } from "@/components/TaskModal";
import { InstallPwaBanner } from "@/components/InstallPwaBanner";
import { toast } from "sonner";
import { isTaskToday, isTaskThisWeek, isTaskThisMonth, isSameCalendarDay, formatDate } from "@/lib/utils";
import { format } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Smart List / Category Filter & Date Selection
  const [activeListId, setActiveListId] = useState<string>("today");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customProjects, setCustomProjects] = useState<string[]>([]);

  // Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  useEffect(() => {
    fetchSessionAndTasks();
  }, []);

  const fetchSessionAndTasks = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login");
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);

      const tasksRes = await fetch("/api/tasks");
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }
    } catch {
      toast.error("Failed to load Ergo workspace");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = (projectName: string) => {
    setCustomProjects((prev) => Array.from(new Set([...prev, projectName])));
    toast.success(`Project "${projectName}" created`);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out from Ergo");
    router.push("/login");
    router.refresh();
  };

  const handleSaveTask = async (taskPayload: any) => {
    try {
      if (taskPayload.category) {
        setCustomProjects((prev) => Array.from(new Set([...prev, taskPayload.category])));
      }
      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskPayload } : t))
        );
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskPayload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Update failed");
        }
        toast.success("Task updated");
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskPayload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Create failed");
        }
        const data = await res.json();
        setTasks((prev) => [data.task, ...prev]);
        toast.success("New task created");
      }
      fetchSessionAndTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to save task");
      fetchSessionAndTasks();
    }
  };

  const handleToggleStatus = async (task: any) => {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (nextStatus === "COMPLETED") {
        toast.success("Task completed");
      } else {
        toast.error("Task in progress");
      }
    } catch {
      fetchSessionAndTasks();
    }
  };

  const handleToggleFlag = async (task: any) => {
    const isCurrentlyFlagged = task.priority === "HIGH" || task.priority === "URGENT";
    const nextPriority = isCurrentlyFlagged ? "MEDIUM" : "HIGH";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, priority: nextPriority } : t))
    );
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: nextPriority }),
      });
      if (nextPriority === "HIGH") {
        toast.success("Task flagged");
      } else {
        toast.info("Task unflagged");
      }
    } catch {
      fetchSessionAndTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      toast.success("Task deleted");
    } catch {
      fetchSessionAndTasks();
    }
  };

  // Filter & Sort Tasks (Open Tasks first, Completed Tasks below)
  const filteredTasks = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    // GLOBAL SEARCH: If user typed in search bar, search across ALL tasks!
    if (trimmedQuery.length > 0) {
      const matched = tasks.filter((t) => {
        return (
          t.title.toLowerCase().includes(trimmedQuery) ||
          (t.description && t.description.toLowerCase().includes(trimmedQuery)) ||
          (t.category && t.category.toLowerCase().includes(trimmedQuery))
        );
      });
      return [...matched].sort((a, b) => {
        const aDone = a.status === "COMPLETED" ? 1 : 0;
        const bDone = b.status === "COMPLETED" ? 1 : 0;
        return aDone - bDone;
      });
    }

    const matched = tasks.filter((t) => {
      // Smart Cards / Views Filter
      if (activeListId === "today") {
        return t.dueDate ? isSameCalendarDay(t.dueDate, selectedCalendarDate) : false;
      }
      if (activeListId === "scheduled") {
        return t.dueDate ? isTaskThisWeek(t.dueDate) : false;
      }
      if (activeListId === "monthly") {
        return t.dueDate ? isTaskThisMonth(t.dueDate) : false;
      }
      if (activeListId === "flagged") {
        return t.priority === "URGENT" || t.priority === "HIGH";
      }
      if (activeListId === "completed") {
        return t.status === "COMPLETED";
      }
      if (activeListId === "all") {
        return true;
      }

      // Category / Project Filter
      if (activeListId.startsWith("cat-")) {
        const catName = activeListId.replace("cat-", "").toLowerCase();
        return t.category.toLowerCase() === catName;
      }

      return true;
    });

    // Sort: Open tasks first, Completed tasks below
    return [...matched].sort((a, b) => {
      const aDone = a.status === "COMPLETED" ? 1 : 0;
      const bDone = b.status === "COMPLETED" ? 1 : 0;
      return aDone - bDone;
    });
  }, [tasks, searchQuery, activeListId, selectedCalendarDate]);

  // Selected Title Label
  const listTitle = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return `Search Results for "${searchQuery.trim()}"`;
    }
    switch (activeListId) {
      case "today":
        return isTaskToday(selectedCalendarDate)
          ? "Today's Tasks"
          : `Tasks for ${format(selectedCalendarDate, "MMM d, yyyy")}`;
      case "scheduled":
        return "Weekly Tasks";
      case "monthly":
        return "Monthly Tasks";
      case "flagged":
        return "Flagged Tasks";
      case "completed":
        return "Completed Tasks";
      case "all":
        return "All Vault Tasks";
      default:
        return activeListId.replace("cat-", "") + " Project";
    }
  }, [activeListId, selectedCalendarDate, searchQuery]);

  const allAvailableProjects = useMemo(() => {
    const taskCats = tasks.map((t) => t.category).filter(Boolean);
    return Array.from(new Set([...customProjects, ...taskCats]));
  }, [customProjects, tasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ergo-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading Ergo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">

      {/* Sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <Sidebar
          activeListId={activeListId}
          setActiveListId={setActiveListId}
          tasks={tasks}
          user={user}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          customProjects={customProjects}
          onAddProject={handleAddProject}
        />
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* PWA Install Notification */}
        <InstallPwaBanner />

        {/* Clean Header with Sidebar Toggle Button [|] */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCreate={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          tasks={tasks}
          user={user}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedCalendarDate={selectedCalendarDate}
          onSelectDate={(d) => {
            setSelectedCalendarDate(d);
            if (activeListId !== "today") setActiveListId("today");
          }}
        />

        {/* Main Workspace Body & Calendar Grid */}
        <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start pb-28 md:pb-6">

          {/* Main Section Area */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <SectionColumns
              title={listTitle}
              tasks={filteredTasks}
              onToggleStatus={handleToggleStatus}
              onToggleFlag={handleToggleFlag}
              onEdit={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDelete={handleDeleteTask}
              onOpenCreate={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            />
          </div>

          {/* Right Panel Calendar — hidden on mobile */}
          <div className="hidden lg:block lg:col-span-4 space-y-4">
            <RightCalendarPanel
              tasks={tasks}
              selectedDate={selectedCalendarDate}
              onSelectDate={(d) => {
                setSelectedCalendarDate(d);
                if (activeListId !== "today") setActiveListId("today");
              }}
            />
          </div>

        </main>

        {/* Floating Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.15)] flex items-center justify-between p-1.5 space-x-1 select-none">
          {[
            { id: "today", label: "Today", icon: "📅" },
            { id: "scheduled", label: "Weekly", icon: "🗓" },
            { id: "all", label: "All", icon: "☰" },
            { id: "flagged", label: "Flagged", icon: "🚩" },
            { id: "completed", label: "Done", icon: "✓" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveListId(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 text-xs font-bold gap-0.5 ${
                activeListId === item.id
                  ? "bg-[#3559E0] text-white shadow-md shadow-[#3559E0]/30 scale-105"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <span className="text-sm leading-none">{item.icon}</span>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 text-xs font-bold gap-0.5 text-white bg-[#3559E0] hover:bg-[#2c4ac0] shadow-md shadow-[#3559E0]/30"
          >
            <span className="text-sm leading-none">+</span>
            <span className="text-[10px] leading-tight">New</span>
          </button>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        availableProjects={allAvailableProjects}
        activeProjectName={activeListId.startsWith("cat-") ? activeListId.replace("cat-", "") : undefined}
      />

    </div>
  );
}


