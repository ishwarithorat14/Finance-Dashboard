import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  User,
  SlidersHorizontal,
  Bell
} from "lucide-react";

export default function Topbar({
  marketStatus,
  onSearch,
  onOpenCheckin,
  pendingTasksCount = 0,
  onOpenSettings,
  isCollapsed,
}) {
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
      setCurrentTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-[#10B981] text-[#10B981]";
      case "PRE_MARKET":
        return "bg-[#fbbf24] text-[#fbbf24]";
      default:
        return "bg-[#9EADB8] text-[#9EADB8]";
    }
  };

  const statusColor = getStatusColor(marketStatus?.status);

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-30 bg-[#1B2735]/95 backdrop-blur-md border-b border-[#2D3E52] transition-all duration-300 flex items-center justify-between px-6 ${
        isCollapsed ? "left-16" : "left-64"
      }`}
    >
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#9EADB8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, tickers (RELIANCE, AAPL), case studies..."
            className="w-full bg-[#243447] text-[#F3F5F5] placeholder-[#6C7E8D] text-xs pl-9 pr-4 py-2 rounded-lg border border-[#2D3E52] focus:border-[#9EADB8] focus:outline-none transition-colors"
          />
        </form>
      </div>

      {/* Right Controls: Date, Market Status, Daily Check-In, User */}
      <div className="flex items-center space-x-4">
        {/* Date & Time Widget */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-[#9EADB8] bg-[#243447]/60 px-3 py-1.5 rounded-lg border border-[#2D3E52]">
          <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>{currentDateStr}</span>
          <span className="text-[#6C7E8D]">|</span>
          <Clock className="w-3.5 h-3.5 text-[#9EADB8]" />
          <span className="font-mono text-[11px]">{currentTimeStr}</span>
        </div>

        {/* Dynamic Market Status Indicator */}
        <div
          className="flex items-center space-x-2 bg-[#243447] px-3 py-1.5 rounded-lg border border-[#2D3E52] text-xs"
          title={marketStatus?.trading_hours || "Market Hours"}
        >
          <span className="relative flex h-2 w-2">
            {marketStatus?.status === "OPEN" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                marketStatus?.status === "OPEN"
                  ? "bg-[#10B981]"
                  : marketStatus?.status === "PRE_MARKET"
                  ? "bg-[#fbbf24]"
                  : "bg-[#6C7E8D]"
              }`}
            ></span>
          </span>
          <span className="text-[#F3F5F5] font-medium text-[11px] hidden sm:inline">
            {marketStatus?.message || "Market Status"}
          </span>
        </div>

        {/* Daily Accountability Check-in Button */}
        <button
          onClick={onOpenCheckin}
          className="relative flex items-center space-x-1.5 bg-[#243447] hover:bg-[#2b3e55] text-[#F3F5F5] text-xs px-3 py-1.5 rounded-lg border border-[#384E66] transition-all shadow-sm"
          title="Daily Accountability Check-in"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="hidden md:inline font-medium">Daily Check-in</span>
          {pendingTasksCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#38bdf8] text-[#1B2735] text-[10px] font-bold flex items-center justify-center">
              {pendingTasksCount}
            </span>
          )}
        </button>

        {/* Settings / Profile Quick Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-[#243447] hover:bg-[#2b3e55] text-[#9EADB8] hover:text-[#F3F5F5] border border-[#2D3E52] transition-colors"
          title="Terminal Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
