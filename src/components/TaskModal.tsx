"use client";

import { useEffect, useState } from "react";
import { X, Calendar, AlertCircle, Plus } from "lucide-react";
import { TaskSchema } from "@/lib/validations";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: any) => Promise<void>;
  initialTask?: any;
  availableProjects?: string[];
  activeProjectName?: string;
}

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialTask,
  availableProjects = [],
  activeProjectName,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [priority, setPriority] = useState("MEDIUM");
  const [category, setCategory] = useState("General Project");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || "");
      setDescription(initialTask.description || "");
      setStatus(initialTask.status || "PENDING");
      setPriority(initialTask.priority || "MEDIUM");
      const proj = initialTask.category || "General Project";
      setCategory(proj);
      setCustomCategoryInput("");
      setIsCustomCategory(false);
      setDueDate(
        initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split("T")[0] : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      setPriority("MEDIUM");
      const defaultProj = activeProjectName || (availableProjects[0] || "General Project");
      setCategory(defaultProj);
      setCustomCategoryInput("");
      setIsCustomCategory(false);
      setDueDate("");
    }
    setError("");
  }, [initialTask, isOpen, activeProjectName, availableProjects]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const targetProject = isCustomCategory ? customCategoryInput.trim() : category;

    if (!targetProject) {
      setError("Please specify a project name");
      return;
    }

    // Restrict selecting past dates when creating a NEW task
    if (!initialTask && dueDate) {
      const selected = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        setError("Cannot set due date to a past date for new tasks");
        return;
      }
    }

    const payload = {
      title,
      description: description || null,
      status,
      priority,
      category: targetProject,
      dueDate: dueDate || null,
    };

    const parsed = TaskSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectList = Array.from(new Set([...availableProjects, "General Project"]));
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/60 relative overflow-hidden text-slate-900">

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-900">
            {initialTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-[#E84E4E]/10 border border-[#E84E4E]/30 text-[#E84E4E] px-3.5 py-2.5 rounded-xl text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Task Title <span className="text-[#E84E4E]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#3559E0] focus:border-[#3559E0] outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Description / Notes</label>
            <textarea
              rows={3}
              placeholder="Add project details, sub-tasks, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#3559E0] focus:border-[#3559E0] outline-none transition"
            />
          </div>

          {/* Grid Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Project</label>
              {!isCustomCategory ? (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "__NEW__") {
                      setIsCustomCategory(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-[#3559E0] outline-none cursor-pointer"
                >
                  {projectList.map((p) => (
                    <option key={p} value={p} className="bg-white text-slate-900 font-medium">
                      {p}
                    </option>
                  ))}
                  <option value="__NEW__" className="bg-white text-[#3559E0] font-bold">
                    + Add New Project...
                  </option>
                </select>
              ) : (
                <div className="space-y-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Project name..."
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#3559E0] rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-[#3559E0] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    Select existing project
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-[#3559E0] outline-none cursor-pointer"
              >
                <option value="LOW" className="bg-white text-slate-900 font-medium">Low</option>
                <option value="MEDIUM" className="bg-white text-slate-900 font-medium">Medium</option>
                <option value="HIGH" className="bg-white text-slate-900 font-medium">High</option>
                <option value="URGENT" className="bg-white text-slate-900 font-medium">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-[#3559E0] outline-none cursor-pointer"
              >
                <option value="PENDING" className="bg-white text-slate-900 font-medium">Pending</option>
                <option value="IN_PROGRESS" className="bg-white text-slate-900 font-medium">In Progress</option>
                <option value="COMPLETED" className="bg-white text-slate-900 font-medium">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              min={!initialTask ? todayStr : undefined}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-[#3559E0] outline-none transition"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#3559E0] hover:bg-[#2c4ac0] text-white rounded-xl font-bold transition shadow-md shadow-[#3559E0]/20 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
