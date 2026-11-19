import React, { useState, useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, ShieldCheck, DollarSign } from "lucide-react";

export default function OrderForm({
  selectedInstrument,
  currentPrice = 0,
  availableCash = 0,
  currency = "INR",
  onExecuteOrder,
}) {
  const [orderType, setOrderType] = useState("BUY");
  const [quantity, setQuantity] = useState(10);
  const [orderStyle, setOrderStyle] = useState("MARKET");
  const [customPrice, setCustomPrice] = useState(currentPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setCustomPrice(currentPrice);
  }, [currentPrice]);

  const activePrice = orderStyle === "MARKET" ? currentPrice : customPrice;
  const estimatedTotal = (quantity * activePrice).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInstrument) return;
    if (quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      await onExecuteOrder({
        symbol: selectedInstrument,
        order_type: orderType,
        order_style: orderStyle,
        quantity: parseInt(quantity),
        price: parseFloat(activePrice),
      });
      setMessage({
        type: "success",
        text: `Successfully executed ${orderType} order for ${quantity} shares of ${selectedInstrument}!`,
      });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1B2735] border border-[#2D3E52] rounded-xl p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2D3E52]">
          <div>
            <h4 className="text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider">
              Simulated Execution
            </h4>
            <span className="text-[11px] text-[#9EADB8]">
              Target: <strong className="text-[#38bdf8]">{selectedInstrument || "Select Symbol"}</strong>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#9EADB8] block">Available Cash</span>
            <span className="font-mono text-xs font-semibold text-[#10B981]">
              {currency} {availableCash?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Order Type Tabs: BUY vs SELL */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-[#243447] p-1 rounded-lg border border-[#2D3E52]">
          <button
            type="button"
            onClick={() => setOrderType("BUY")}
            className={`py-2 rounded-md text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
              orderType === "BUY"
                ? "bg-[#10B981] text-[#1B2735] shadow-sm"
                : "text-[#9EADB8] hover:text-[#F3F5F5]"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>BUY / LONG</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType("SELL")}
            className={`py-2 rounded-md text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
              orderType === "SELL"
                ? "bg-[#EF4444] text-[#1B2735] shadow-sm"
                : "text-[#9EADB8] hover:text-[#F3F5F5]"
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>SELL / SHORT</span>
          </button>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Order Style: Market vs Limit */}
          <div>
            <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
              Order Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderStyle("MARKET")}
                className={`py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  orderStyle === "MARKET"
                    ? "bg-[#243447] text-[#F3F5F5] border-[#384E66]"
                    : "bg-[#1B2735] text-[#9EADB8] border-[#2D3E52]"
                }`}
              >
                Market (Live Quote)
              </button>
              <button
                type="button"
                onClick={() => setOrderStyle("LIMIT")}
                className={`py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  orderStyle === "LIMIT"
                    ? "bg-[#243447] text-[#F3F5F5] border-[#384E66]"
                    : "bg-[#1B2735] text-[#9EADB8] border-[#2D3E52]"
                }`}
              >
                Limit (Custom Price)
              </button>
            </div>
          </div>

          {/* Execution Price */}
          <div>
            <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
              Execution Price ({currency})
            </label>
            <input
              type="number"
              step="0.05"
              value={activePrice}
              onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
              disabled={orderStyle === "MARKET"}
              className="w-full bg-[#243447] text-[#F3F5F5] font-mono text-xs px-3 py-2 rounded-lg border border-[#2D3E52] disabled:opacity-75 focus:outline-none focus:border-[#9EADB8]"
            />
          </div>

          {/* Quantity */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-[#9EADB8]">
                Quantity (Units)
              </label>
              <div className="flex space-x-1">
                {[10, 25, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#243447] hover:bg-[#384E66] text-[#9EADB8] hover:text-[#F3F5F5] border border-[#2D3E52]"
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full bg-[#243447] text-[#F3F5F5] font-mono text-xs px-3 py-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              required
            />
          </div>

          {/* Cost Summary Breakdown */}
          <div className="p-3 bg-[#243447] border border-[#2D3E52] rounded-lg space-y-1.5 text-[11px]">
            <div className="flex justify-between text-[#9EADB8]">
              <span>Estimated Order Value:</span>
              <span className="font-mono text-[#F3F5F5] font-semibold">
                {currency} {parseFloat(estimatedTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-[#6C7E8D] text-[10px]">
              <span>Simulated Slippage & Brokerage:</span>
              <span className="font-mono">₹0.00 (Zero Fee)</span>
            </div>
          </div>

          {/* Notifications */}
          {message && (
            <div
              className={`p-2.5 rounded-lg text-[11px] border ${
                message.type === "success"
                  ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                  : "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !selectedInstrument}
            className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              orderType === "BUY"
                ? "bg-[#10B981] hover:bg-[#059669] text-[#1B2735]"
                : "bg-[#EF4444] hover:bg-[#dc2626] text-[#1B2735]"
            } disabled:opacity-50`}
          >
            {isSubmitting
              ? "Executing..."
              : `Submit ${orderType} Order (${selectedInstrument})`}
          </button>
        </form>
      </div>

      <div className="mt-4 pt-3 border-t border-[#2D3E52]/60 text-[10px] text-[#6C7E8D] flex items-center space-x-1.5">
        <ShieldCheck className="w-3 h-3 text-[#10B981]" />
        <span>Paper simulation mode. Strictly virtual capital.</span>
      </div>
    </div>
  );
}
