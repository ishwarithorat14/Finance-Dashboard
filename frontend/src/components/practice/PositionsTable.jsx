import React from "react";
import {
  TrendingUp,
  TrendingDown,
  XCircle,
  Briefcase,
  DollarSign,
  PieChart
} from "lucide-react";

export default function PositionsTable({
  portfolio,
  onClosePosition,
}) {
  const positions = portfolio?.open_positions || [];
  const currency = portfolio?.currency || "INR";

  return (
    <div className="bg-[#1B2735] border border-[#2D3E52] rounded-xl overflow-hidden">
      {/* Portfolio Header Bar */}
      <div className="p-4 bg-[#243447]/60 border-b border-[#2D3E52] grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <span className="text-[10px] text-[#9EADB8] uppercase block">
            Total Portfolio Equity
          </span>
          <span className="font-mono text-sm font-bold text-[#F3F5F5]">
            {currency} {portfolio?.total_equity?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#9EADB8] uppercase block">
            Available Virtual Cash
          </span>
          <span className="font-mono text-sm font-semibold text-[#38bdf8]">
            {currency} {portfolio?.current_cash_balance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#9EADB8] uppercase block">
            Positions Value
          </span>
          <span className="font-mono text-sm font-semibold text-[#F3F5F5]">
            {currency} {portfolio?.positions_value?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#9EADB8] uppercase block">
            Unrealized P&L
          </span>
          <div
            className={`font-mono text-sm font-bold flex items-center space-x-1 ${
              (portfolio?.total_unrealized_pnl || 0) >= 0
                ? "text-[#10B981]"
                : "text-[#EF4444]"
            }`}
          >
            {(portfolio?.total_unrealized_pnl || 0) >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>
              {(portfolio?.total_unrealized_pnl || 0) >= 0 ? "+" : ""}
              {portfolio?.total_unrealized_pnl?.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (
              {(portfolio?.total_return_pct || 0) >= 0 ? "+" : ""}
              {portfolio?.total_return_pct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Table Title */}
      <div className="px-5 py-3 border-b border-[#2D3E52] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-[#38bdf8]" />
          <h4 className="text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider">
            Open Simulated Positions ({positions.length})
          </h4>
        </div>
        <span className="text-[10px] text-[#9EADB8]">
          Real-time mark-to-market
        </span>
      </div>

      {/* Positions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#243447] text-[#9EADB8] border-b border-[#2D3E52] uppercase text-[10px] font-mono tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Instrument</th>
              <th className="py-2.5 px-4">Qty</th>
              <th className="py-2.5 px-4">Avg Entry</th>
              <th className="py-2.5 px-4">Current Price</th>
              <th className="py-2.5 px-4">Position Value</th>
              <th className="py-2.5 px-4">Unrealized P&L</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D3E52]">
            {positions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#9EADB8]">
                  No open positions. Use the order form to enter a simulated trade.
                </td>
              </tr>
            ) : (
              positions.map((pos) => {
                const isProfitable = (pos.unrealized_pnl || 0) >= 0;
                return (
                  <tr
                    key={pos.symbol}
                    className="hover:bg-[#243447]/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-[#F3F5F5]">
                      {pos.symbol}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#F3F5F5]">
                      {pos.quantity}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#9EADB8]">
                      {pos.average_entry_price?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#F3F5F5]">
                      {pos.current_price?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#F3F5F5]">
                      {pos.total_value?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`py-3 px-4 font-mono font-semibold ${
                        isProfitable ? "text-[#10B981]" : "text-[#EF4444]"
                      }`}
                    >
                      {isProfitable ? "+" : ""}
                      {pos.unrealized_pnl?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ({isProfitable ? "+" : ""}
                      {pos.unrealized_pnl_pct}%)
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onClosePosition(pos.symbol, pos.quantity)}
                        className="px-2.5 py-1 rounded bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 text-[10px] font-semibold transition-colors"
                      >
                        Close Position
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
