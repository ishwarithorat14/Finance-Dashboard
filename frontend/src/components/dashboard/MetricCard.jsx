import React from "react";
import { ArrowUpRight, CheckCircle2, TrendingUp, BookOpen, Compass, Award } from "lucide-react";

export default function MetricCard({
  title,
  progressPct,
  metricLabel,
  secondaryMetric,
  weeklyActivity,
  actionLabel,
  onClick,
  iconType = "learning",
}) {
  const getIcon = () => {
    switch (iconType) {
      case "learning":
        return <BookOpen className="w-4 h-4 text-[#38bdf8]" />;
      case "trading":
        return <TrendingUp className="w-4 h-4 text-[#10B981]" />;
      case "analysis":
        return <Compass className="w-4 h-4 text-[#fbbf24]" />;
      case "goal":
        return <Award className="w-4 h-4 text-[#a78bfa]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#9EADB8]" />;
    }
  };

  return (
    <div className="bg-[#1B2735] hover:bg-[#1E2C3D] border border-[#2D3E52] hover:border-[#384E66] rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center">
              {getIcon()}
            </div>
            <span className="text-xs font-semibold text-[#9EADB8] tracking-wider uppercase">
              {title}
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-[#F3F5F5]">
            {metricLabel || `${progressPct}%`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#243447] h-1.5 rounded-full overflow-hidden mb-3 border border-[#2D3E52]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              iconType === "trading"
                ? "bg-[#10B981]"
                : iconType === "analysis"
                ? "bg-[#fbbf24]"
                : iconType === "goal"
                ? "bg-[#a78bfa]"
                : "bg-[#38bdf8]"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>

        {/* Supporting Context / Activity */}
        <p className="text-[11px] text-[#9EADB8] truncate">
          {weeklyActivity || "No recorded activity this week"}
        </p>
      </div>

      {/* Clickable Action */}
      <div className="mt-4 pt-3 border-t border-[#2D3E52]/70 flex items-center justify-between">
        <button
          onClick={onClick}
          className="text-xs font-medium text-[#F3F5F5] group-hover:text-[#38bdf8] flex items-center space-x-1.5 transition-colors"
        >
          <span>{actionLabel || "View Details"}</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
