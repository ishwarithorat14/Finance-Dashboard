import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Filter,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";

export default function TradingJournal({
  entries = [],
  stats = {},
  onOpenNewEntry,
}) {
  const [resultFilter, setResultFilter] = useState("All");
  const [strategyFilter, setStrategyFilter] = useState("All");

  const strategies = [
    "All",
    ...new Set(entries.map((e) => e.strategy_used).filter(Boolean)),
  ];

  const filteredEntries = entries.filter((e) => {
    const matchesResult = resultFilter === "All" || e.result === resultFilter;
    const matchesStrategy =
      strategyFilter === "All" || e.strategy_used === strategyFilter;
    return matchesResult && matchesStrategy;
  });

  const getResultBadge = (result) => {
    switch (result) {
      case "WIN":
        return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
      case "LOSS":
        return "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30";
      case "OPEN":
        return "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30";
      default:
        return "bg-[#9EADB8]/15 text-[#9EADB8] border-[#9EADB8]/30";
    }
  };

  return (
    <div className="space-y-5">
      {/* Performance Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-[#1B2735] border border-[#2D3E52] rounded-xl">
          <span className="text-[10px] text-[#9EADB8] uppercase tracking-wider block">
            Win Rate
          </span>
          <div className="flex items-center space-x-1.5 mt-1">
            <Award className="w-4 h-4 text-[#fbbf24]" />
            <span className="font-mono text-base font-bold text-[#F3F5F5]">
              {stats.win_rate || 0}%
            </span>
          </div>
          <span className="text-[10px] text-[#6C7E8D] block mt-0.5">
            {stats.wins || 0}W - {stats.losses || 0}L ({stats.closed_trades || 0} closed)
          </span>
        </div>

        <div className="p-4 bg-[#1B2735] border border-[#2D3E52] rounded-xl">
          <span className="text-[10px] text-[#9EADB8] uppercase tracking-wider block">
            Total Realized P&L
          </span>
          <div
            className={`font-mono text-base font-bold mt-1 ${
              (stats.total_pnl || 0) >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
            }`}
          >
            {(stats.total_pnl || 0) >= 0 ? "+" : ""}
            ₹{stats.total_pnl?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-[#6C7E8D] block mt-0.5">
            Closed trades performance
          </span>
        </div>

        <div className="p-4 bg-[#1B2735] border border-[#2D3E52] rounded-xl">
          <span className="text-[10px] text-[#9EADB8] uppercase tracking-wider block">
            Profit Factor
          </span>
          <span className="font-mono text-base font-bold text-[#38bdf8] block mt-1">
            {stats.profit_factor || 0}
          </span>
          <span className="text-[10px] text-[#6C7E8D] block mt-0.5">
            Gross win / Gross loss ratio
          </span>
        </div>

        <div className="p-4 bg-[#1B2735] border border-[#2D3E52] rounded-xl">
          <span className="text-[10px] text-[#9EADB8] uppercase tracking-wider block">
            Logged Trades
          </span>
          <span className="font-mono text-base font-bold text-[#F3F5F5] block mt-1">
            {entries.length}
          </span>
          <span className="text-[10px] text-[#6C7E8D] block mt-0.5">
            Active and archived journal logs
          </span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1B2735] p-3 rounded-xl border border-[#2D3E52]">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#38bdf8]" />
          <span className="text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider">
            Trade Log Records ({filteredEntries.length})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="bg-[#243447] text-[#F3F5F5] text-xs px-2.5 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none"
          >
            <option value="All">All Outcomes</option>
            <option value="WIN">WIN Only</option>
            <option value="LOSS">LOSS Only</option>
            <option value="OPEN">OPEN Positions</option>
          </select>

          <select
            value={strategyFilter}
            onChange={(e) => setStrategyFilter(e.target.value)}
            className="bg-[#243447] text-[#F3F5F5] text-xs px-2.5 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none max-w-[150px] truncate"
          >
            {strategies.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenNewEntry}
            className="px-3 py-1.5 bg-[#384E66] hover:bg-[#48627d] text-[#F3F5F5] text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Trade</span>
          </button>
        </div>
      </div>

      {/* Trade Log Table */}
      <div className="bg-[#1B2735] border border-[#2D3E52] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#243447] text-[#9EADB8] border-b border-[#2D3E52] uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Instrument</th>
                <th className="py-2.5 px-4">Outcome</th>
                <th className="py-2.5 px-4">Strategy</th>
                <th className="py-2.5 px-4">Entry / Exit</th>
                <th className="py-2.5 px-4">Net P&L</th>
                <th className="py-2.5 px-4">Reason / Notes</th>
                <th className="py-2.5 px-4">Lessons Learned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3E52]">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#9EADB8]">
                    No trades match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-[#243447]/60 transition-colors align-top"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-[#F3F5F5] whitespace-nowrap">
                      {e.instrument}
                      <span className="block text-[10px] font-sans text-[#9EADB8]">
                        Qty: {e.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getResultBadge(
                          e.result
                        )}`}
                      >
                        {e.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#F3F5F5] font-medium whitespace-nowrap">
                      {e.strategy_used}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#9EADB8] whitespace-nowrap">
                      <div>₹{e.entry_price}</div>
                      <div className="text-[#6C7E8D]">
                        {e.exit_price ? `₹${e.exit_price}` : "Active"}
                      </div>
                    </td>
                    <td
                      className={`py-3 px-4 font-mono font-semibold whitespace-nowrap ${
                        (e.pnl_amount || 0) >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
                      }`}
                    >
                      {(e.pnl_amount || 0) >= 0 ? "+" : ""}
                      ₹{e.pnl_amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      {e.pnl_percentage ? (
                        <span className="block text-[10px]">
                          ({(e.pnl_percentage || 0) >= 0 ? "+" : ""}
                          {e.pnl_percentage}%)
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 px-4 text-[#9EADB8] max-w-xs">
                      <p className="line-clamp-2">
                        <strong className="text-[#F3F5F5]">Entry:</strong> {e.reason_entry}
                      </p>
                      {e.reason_exit && (
                        <p className="line-clamp-1 text-[11px] text-[#6C7E8D] mt-0.5">
                          <strong>Exit:</strong> {e.reason_exit}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#38bdf8] max-w-xs italic text-[11px]">
                      {e.lessons_learned || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
