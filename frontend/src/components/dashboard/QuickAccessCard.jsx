import React from "react";
import { BookOpen, Activity, Compass, ArrowRight } from "lucide-react";

export default function QuickAccessCard({ onNavigate }) {
  const cards = [
    {
      id: "learn",
      title: "Finance Concepts & Case Studies",
      subtitle: "Organized curriculum, quizzes & corporate moats",
      icon: BookOpen,
      color: "text-[#38bdf8]",
    },
    {
      id: "practice",
      title: "Trading Simulation & Journal",
      subtitle: "Technical charts, virtual orders & trade review",
      icon: Activity,
      color: "text-[#10B981]",
    },
    {
      id: "intelligence",
      title: "Market News & Intelligence",
      subtitle: "10-point research breakdown & personal observations",
      icon: Compass,
      color: "text-[#fbbf24]",
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="text-xs font-semibold text-[#9EADB8] uppercase tracking-wider px-1">
        Quick Access Workspaces
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="bg-[#1B2735] hover:bg-[#1E2C3D] border border-[#2D3E52] hover:border-[#384E66] rounded-xl p-4 text-left transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center mb-3">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-[#9EADB8] group-hover:text-[#F3F5F5] group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#F3F5F5] block">
                  {card.title}
                </span>
                <span className="text-[11px] text-[#9EADB8] block mt-0.5">
                  {card.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
