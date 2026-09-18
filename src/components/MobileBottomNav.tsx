"use client";

import { CheckSquare, LayoutGrid, BarChart2, Sparkles, Download } from "lucide-react";

interface MobileBottomNavProps {
  activeTab: "list" | "kanban" | "analytics" | "presets";
  setActiveTab: (tab: "list" | "kanban" | "analytics" | "presets") => void;
  onOpenPresets: () => void;
  onDownloadApp: () => void;
}

export function MobileBottomNav({
  activeTab,
  setActiveTab,
  onOpenPresets,
  onDownloadApp,
}: MobileBottomNavProps) {
  const tabs = [
    { id: "list", label: "Tasks", icon: CheckSquare },
    { id: "kanban", label: "Board", icon: LayoutGrid },
    { id: "analytics", label: "Stats", icon: BarChart2 },
    { id: "presets", label: "Presets", icon: Sparkles },
  ] as const;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4 sm:hidden flex justify-center pointer-events-none">
      <div className="bg-emerald-600/95 backdrop-blur-md text-white px-2 py-1.5 rounded-full shadow-floating-nav border border-emerald-500/80 flex items-center justify-between space-x-1 pointer-events-auto max-w-sm w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "presets") {
                  onOpenPresets();
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-white text-emerald-700 shadow-md font-bold scale-105"
                  : "text-emerald-100 hover:text-white hover:bg-emerald-500/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-emerald-100"}`} />
              <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={onDownloadApp}
          className="py-1.5 px-2 text-amber-300 hover:text-white flex flex-col items-center justify-center transition"
          title="Download App"
        >
          <Download className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 leading-none font-semibold">Install</span>
        </button>
      </div>
    </div>
  );
}
