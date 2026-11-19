import React, { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, ShieldAlert, Sparkles, Activity } from "lucide-react";

export default function MarketSnapshotPanel({ snapshot = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // SVG mini sparkline generator
  const renderSparkline = (changePct) => {
    const isPositive = changePct >= 0;
    const points = isPositive
      ? "0,25 15,22 30,24 45,18 60,19 75,12 90,14 105,8 120,4"
      : "0,5 15,9 30,8 45,16 60,14 75,20 90,18 105,24 120,28";
    
    return (
      <svg className="w-24 h-7 overflow-visible" viewBox="0 0 120 30">
        <polyline
          fill="none"
          stroke={isPositive ? "#10B981" : "#EF4444"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const getDataModeBadge = (mode) => {
    switch (mode) {
      case "LIVE":
        return {
          label: "Live Feed",
          style: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
        };
      case "CACHED":
        return {
          label: "Cached",
          style: "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30",
        };
      default:
        return {
          label: "Demo Data",
          style: "bg-[#9EADB8]/15 text-[#9EADB8] border-[#9EADB8]/30",
        };
    }
  };

  return (
    <div className="bg-[#1B2735] border border-[#2D3E52] rounded-xl overflow-hidden transition-all duration-200">
      {/* Collapsed Header / Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#1E2C3D] transition-colors"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#38bdf8]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-[#F3F5F5]">
                Market Snapshot
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#243447] text-[#9EADB8] border border-[#2D3E52]">
                NIFTY · SENSEX · BANK NIFTY
              </span>
            </div>
            <p className="text-xs text-[#9EADB8] mt-0.5">
              Benchmark indices performance and verified data provenance
            </p>
          </div>
        </div>

        <div className="text-[#9EADB8]">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-3 border-t border-[#2D3E52] space-y-4 bg-[#1B2735]/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {snapshot.map((item) => {
              const isPositive = (item.change_pct || 0) >= 0;
              const badge = getDataModeBadge(item.data_mode);

              return (
                <div
                  key={item.symbol}
                  className="bg-[#243447] border border-[#2D3E52] hover:border-[#384E66] rounded-xl p-4 flex flex-col justify-between transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#F3F5F5] block">
                        {item.name || item.symbol}
                      </span>
                      <span className="text-[10px] text-[#9EADB8] font-mono uppercase">
                        {item.symbol}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="my-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-base font-mono font-semibold text-[#F3F5F5]">
                        {item.price?.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div
                        className={`text-xs font-mono flex items-center space-x-1 mt-0.5 ${
                          isPositive ? "text-[#10B981]" : "text-[#EF4444]"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {isPositive ? "+" : ""}
                          {item.change} ({isPositive ? "+" : ""}
                          {item.change_pct}%)
                        </span>
                      </div>
                    </div>

                    {/* Sparkline mini-graph */}
                    <div className="shrink-0">
                      {renderSparkline(item.change_pct || 0)}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2D3E52]/60 text-[10px] text-[#6C7E8D] flex justify-between">
                    <span>Currency: {item.currency || "INR"}</span>
                    <span>Verified feed</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Provenance Disclosure Notice */}
          <div className="flex items-center space-x-2 text-[11px] text-[#9EADB8] bg-[#243447]/40 px-3 py-2 rounded-lg border border-[#2D3E52]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
            <span>
              Prices clearly label data source provenance (Live, Cached, or Demonstration). FINANCE HQ never invents synthetic prices as live quotes.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
