import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Activity,
  Compass,
  CalendarCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) {
  const navItems = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "practice", label: "Practice", icon: Activity },
    { id: "intelligence", label: "Market Intelligence", icon: Compass },
    { id: "review", label: "Monthly Review", icon: CalendarCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-[#1B2735] border-r border-[#2D3E52] transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#2D3E52]">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#9EADB8] shadow-sm">
                <TrendingUp className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <div>
                <span className="font-semibold text-sm tracking-wider text-[#F3F5F5] uppercase block">
                  Finance HQ
                </span>
                <span className="text-[10px] text-[#9EADB8] tracking-widest uppercase block -mt-0.5">
                  Research Terminal
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#38bdf8]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md text-[#9EADB8] hover:text-[#F3F5F5] hover:bg-[#243447] transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#243447] text-[#F3F5F5] border border-[#384E66] shadow-sm"
                    : "text-[#9EADB8] hover:text-[#F3F5F5] hover:bg-[#243447]/60"
                } ${isCollapsed ? "justify-center px-0" : "space-x-3"}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#38bdf8]" : "text-[#9EADB8]"
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#2D3E52]">
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full py-2 flex justify-center text-[#9EADB8] hover:text-[#F3F5F5] hover:bg-[#243447] rounded-lg transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="bg-[#243447]/80 rounded-lg p-2.5 border border-[#2D3E52]">
            <div className="flex items-center space-x-2 text-[11px] text-[#9EADB8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="truncate">Paper Simulation Active</span>
            </div>
            <div className="text-[10px] text-[#6C7E8D] mt-1">
              Zero real capital risk
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
