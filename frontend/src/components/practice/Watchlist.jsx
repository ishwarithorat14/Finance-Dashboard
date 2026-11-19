import React, { useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, Eye, Search } from "lucide-react";

export default function Watchlist({
  watchlist = [],
  selectedSymbol,
  onSelectSymbol,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) {
  const [newSymbol, setNewSymbol] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    onAddToWatchlist(newSymbol.trim().toUpperCase());
    setNewSymbol("");
    setShowAdd(false);
  };

  return (
    <div className="bg-[#1B2735] border border-[#2D3E52] rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-3.5 border-b border-[#2D3E52] flex items-center justify-between bg-[#243447]/60">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-[#38bdf8]" />
          <h4 className="text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider">
            Watchlist ({watchlist.length})
          </h4>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-1 rounded-md text-[#9EADB8] hover:text-[#F3F5F5] hover:bg-[#243447] transition-colors"
          title="Add ticker to watchlist"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Symbol Input */}
      {showAdd && (
        <form
          onSubmit={handleAddSubmit}
          className="p-2.5 bg-[#243447] border-b border-[#2D3E52] flex space-x-2"
        >
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Ticker (e.g. INFY.NS, AAPL)"
            className="flex-1 bg-[#1B2735] text-[#F3F5F5] text-xs px-2.5 py-1 rounded border border-[#2D3E52] uppercase focus:outline-none focus:border-[#9EADB8]"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 bg-[#384E66] hover:bg-[#48627d] text-xs font-medium text-[#F3F5F5] rounded"
          >
            Add
          </button>
        </form>
      )}

      {/* Watchlist Items */}
      <div className="divide-y divide-[#2D3E52] overflow-y-auto flex-1">
        {watchlist.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#9EADB8]">
            No instruments pinned. Click "+" to monitor tickers.
          </div>
        ) : (
          watchlist.map((item) => {
            const isSelected = selectedSymbol === item.symbol;
            const isPositive = (item.change_pct || 0) >= 0;

            return (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item.symbol)}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors group ${
                  isSelected
                    ? "bg-[#243447] border-l-2 border-[#38bdf8]"
                    : "hover:bg-[#243447]/60"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-semibold text-[#F3F5F5] block truncate font-mono">
                    {item.symbol}
                  </span>
                  <span className="text-[10px] text-[#9EADB8] truncate block">
                    {item.name || item.exchange}
                  </span>
                </div>

                <div className="text-right shrink-0 flex items-center space-x-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#F3F5F5] block">
                      {item.price?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span
                      className={`font-mono text-[10px] flex items-center justify-end space-x-0.5 ${
                        isPositive ? "text-[#10B981]" : "text-[#EF4444]"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {item.change_pct}%
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(item.symbol);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#9EADB8] hover:text-[#EF4444] transition-all"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
