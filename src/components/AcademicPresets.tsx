"use client";

import { Sparkles, BookOpen, Code2, FlaskConical, Presentation, FileText, X } from "lucide-react";

interface AcademicPresetsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: {
    title: string;
    description: string;
    category: string;
    priority: string;
    dueDateOffsetDays: number;
  }) => void;
}

export function AcademicPresets({ isOpen, onClose, onSelectPreset }: AcademicPresetsProps) {
  if (!isOpen) return null;

  const presets = [
    {
      icon: Code2,
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      title: "Data Structures & Algorithms Assignment",
      description: "Implement Binary Search Trees, Graph Traversals (DFS/BFS) and submit C++ code with test cases.",
      category: "Computer Science",
      priority: "URGENT",
      dueDateOffsetDays: 2,
    },
    {
      icon: BookOpen,
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      title: "Linear Algebra Midterm Revision",
      description: "Review Eigenvalues, Eigenvectors, Matrix Transformations, and Vector Spaces (Chapters 4-6).",
      category: "Mathematics",
      priority: "HIGH",
      dueDateOffsetDays: 3,
    },
    {
      icon: FlaskConical,
      color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
      title: "Physics Lab Experiment Report",
      description: "Complete error calculation tables, fit response curves, and format PDF report according to lab manual.",
      category: "Lab Work",
      priority: "MEDIUM",
      dueDateOffsetDays: 4,
    },
    {
      icon: Presentation,
      color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      title: "Group Project Slide Deck",
      description: "Draft architecture diagrams, system workflow, and presentation slides for semester project review.",
      category: "Projects",
      priority: "HIGH",
      dueDateOffsetDays: 5,
    },
    {
      icon: FileText,
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      title: "Operating Systems Assignment Submission",
      description: "Solve Producer-Consumer Semaphore synchronization problems and write report.",
      category: "Computer Science",
      priority: "URGENT",
      dueDateOffsetDays: 1,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-ergo-text">
      <div className="bg-ergo-card rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-ergo-border relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-500" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Academic Task Auto-Fill Presets</h2>
              <p className="text-xs text-slate-400">Click any standard student template to add it instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-ergo-hover rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
          {presets.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  onSelectPreset(p);
                  onClose();
                }}
                className="group bg-ergo-sidebar hover:bg-ergo-hover border border-ergo-border/60 hover:border-emerald-500/50 p-4 rounded-2xl cursor-pointer transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${p.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                        {p.title}
                      </h3>
                      <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-2xs">
                        Auto-Fill
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[10px] font-medium text-slate-300 bg-ergo-card px-2 py-0.5 rounded border border-ergo-border">
                        {p.category}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400">
                        Due in {p.dueDateOffsetDays} day{p.dueDateOffsetDays > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-ergo-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ergo-sidebar hover:bg-ergo-hover text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
