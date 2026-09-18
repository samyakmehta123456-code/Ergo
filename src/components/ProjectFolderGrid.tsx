"use client";

import { Folder, Layers, Sparkles, Code2, BookOpen, FlaskConical, Presentation, Terminal } from "lucide-react";

interface ProjectFolderGridProps {
  onOpenPresets: () => void;
}

export function ProjectFolderGrid({ onOpenPresets }: ProjectFolderGridProps) {
  const projects = [
    {
      title: "Computer Science CS101",
      subtitle: "Algorithms & C++ Labs",
      stats: "4 assignments • 2 due soon",
      icon: Code2,
      bg: "bg-gradient-to-br from-orange-500 to-amber-600 text-slate-950",
    },
    {
      title: "Linear Algebra & Math",
      subtitle: "Eigenvalues & Matrices",
      stats: "3 exams • 1 midterm",
      icon: BookOpen,
      bg: "bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950",
    },
    {
      title: "Physics Lab Experiments",
      subtitle: "Oscilloscope Error Analysis",
      stats: "2 lab reports • 1 due tomorrow",
      icon: FlaskConical,
      bg: "bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950",
    },
    {
      title: "Operating Systems Project",
      subtitle: "Kernel Synchronization",
      stats: "1 project • 5 slide decks",
      icon: Terminal,
      bg: "bg-gradient-to-br from-pink-500 to-rose-600 text-slate-950",
    },
    {
      title: "Data Structures & Algos",
      subtitle: "Trees & Graph Traversals",
      stats: "5 problem sets",
      icon: Layers,
      bg: "bg-gradient-to-br from-violet-500 to-indigo-600 text-white",
    },
  ];

  return (
    <div className="space-y-3 mb-8">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <span>Favorites & Subject Projects</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium">5 active courses</span>
      </div>

      {/* Grid of 5 Colorful Squircle Tiles (Matching Screenshot Bottom Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        {projects.map((proj, idx) => {
          const Icon = proj.icon;
          return (
            <div
              key={idx}
              onClick={onOpenPresets}
              className="group bg-ergo-card border border-ergo-border hover:border-slate-600 p-4 rounded-3xl flex flex-col justify-between h-44 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              {/* Colorful Icon Folder Box (Matching Screenshot squircle icons) */}
              <div
                className={`w-14 h-14 rounded-2xl ${proj.bg} flex items-center justify-center shadow-md transition transform group-hover:scale-105`}
              >
                <Icon className="w-7 h-7 stroke-[2]" />
              </div>

              {/* Title & Stats */}
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition line-clamp-2 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{proj.subtitle}</p>
                <p className="text-[9px] font-semibold text-slate-400 mt-1 truncate">{proj.stats}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
