import React, { useState } from "react";
import { X, BookOpen, Save, ShieldAlert, Award, TrendingUp } from "lucide-react";

export default function JournalModal({
  isOpen,
  onClose,
  onSave,
}) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    instrument: "",
    entry_price: "",
    exit_price: "",
    quantity: 10,
    strategy_used: "Breakout Strategy",
    reason_entry: "",
    reason_exit: "",
    stop_loss: "",
    target_price: "",
    result: "WIN",
    lessons_learned: "",
  });

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.instrument.trim() || !form.entry_price) {
      alert("Instrument and entry price are required.");
      return;
    }
    onSave({
      instrument: form.instrument.trim().toUpperCase(),
      entry_price: parseFloat(form.entry_price),
      exit_price: form.exit_price ? parseFloat(form.exit_price) : null,
      quantity: parseInt(form.quantity) || 1,
      strategy_used: form.strategy_used,
      reason_entry: form.reason_entry,
      reason_exit: form.reason_exit || null,
      stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : null,
      target_price: form.target_price ? parseFloat(form.target_price) : null,
      result: form.result,
      lessons_learned: form.lessons_learned || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#1B2735] border border-[#384E66] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3E52] bg-[#243447]/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#10B981]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F3F5F5]">
                Log Trade to Journal
              </h3>
              <p className="text-xs text-[#9EADB8]">
                Psychological and technical post-trade analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9EADB8] hover:text-[#F3F5F5] p-1 rounded-md hover:bg-[#243447] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Instrument, Quantity, Strategy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#243447] border border-[#2D3E52] rounded-xl">
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Instrument *
              </label>
              <input
                type="text"
                value={form.instrument}
                onChange={(e) => handleChange("instrument", e.target.value)}
                placeholder="e.g. RELIANCE.NS or AAPL"
                className="w-full bg-[#1B2735] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52] uppercase focus:outline-none focus:border-[#9EADB8]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className="w-full bg-[#1B2735] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Strategy Used
              </label>
              <select
                value={form.strategy_used}
                onChange={(e) => handleChange("strategy_used", e.target.value)}
                className="w-full bg-[#1B2735] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52]"
              >
                <option value="Breakout Strategy">Breakout Strategy</option>
                <option value="Moving Average Crossover">Moving Average Crossover</option>
                <option value="Mean Reversion">Mean Reversion</option>
                <option value="RSI Divergence">RSI Divergence</option>
                <option value="Momentum Continuation">Momentum Continuation</option>
                <option value="Value Investing Pullback">Value Investing Pullback</option>
              </select>
            </div>
          </div>

          {/* Pricing: Entry, Exit, Stop-loss, Target */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Entry Price *
              </label>
              <input
                type="number"
                step="0.05"
                value={form.entry_price}
                onChange={(e) => handleChange("entry_price", e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#243447] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Exit Price
              </label>
              <input
                type="number"
                step="0.05"
                value={form.exit_price}
                onChange={(e) => handleChange("exit_price", e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#243447] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Stop-Loss
              </label>
              <input
                type="number"
                step="0.05"
                value={form.stop_loss}
                onChange={(e) => handleChange("stop_loss", e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#243447] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Target Price
              </label>
              <input
                type="number"
                step="0.05"
                value={form.target_price}
                onChange={(e) => handleChange("target_price", e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#243447] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52]"
              />
            </div>
          </div>

          {/* Result Selection */}
          <div>
            <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1.5 uppercase">
              Trade Outcome
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["WIN", "LOSS", "BREAKEVEN", "OPEN"].map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => handleChange("result", res)}
                  className={`py-1.5 rounded-lg border font-mono text-xs font-semibold transition-colors ${
                    form.result === res
                      ? res === "WIN"
                        ? "bg-[#10B981] text-[#1B2735] border-[#10B981]"
                        : res === "LOSS"
                        ? "bg-[#EF4444] text-[#1B2735] border-[#EF4444]"
                        : "bg-[#243447] text-[#F3F5F5] border-[#384E66]"
                      : "bg-[#1B2735] text-[#9EADB8] border-[#2D3E52]"
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Rationale: Entry vs Exit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#9EADB8] uppercase block">
                Technical Reason for Entering *
              </label>
              <textarea
                rows={3}
                value={form.reason_entry}
                onChange={(e) => handleChange("reason_entry", e.target.value)}
                placeholder="Why did you take this setup? What indicators or price levels confirmed it?"
                className="w-full bg-[#243447] text-[#F3F5F5] p-2.5 rounded-lg border border-[#2D3E52] resize-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#9EADB8] uppercase block">
                Reason for Exiting
              </label>
              <textarea
                rows={3}
                value={form.reason_exit}
                onChange={(e) => handleChange("reason_exit", e.target.value)}
                placeholder="Hit target? Trailing stop touched? Market condition change?"
                className="w-full bg-[#243447] text-[#F3F5F5] p-2.5 rounded-lg border border-[#2D3E52] resize-none"
              />
            </div>
          </div>

          {/* Lessons Learned */}
          <div className="space-y-1 p-3.5 bg-[#243447] border border-[#2D3E52] rounded-xl">
            <label className="text-[11px] font-semibold text-[#38bdf8] uppercase block flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Lessons Learned & Trading Psychology</span>
            </label>
            <textarea
              rows={2}
              value={form.lessons_learned}
              onChange={(e) => handleChange("lessons_learned", e.target.value)}
              placeholder="What did this trade teach you about execution discipline, patience, or risk management?"
              className="w-full bg-[#1B2735] text-[#F3F5F5] p-2.5 rounded-lg border border-[#2D3E52] resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#2D3E52] flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-[#9EADB8] hover:text-[#F3F5F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#384E66] hover:bg-[#48627d] text-xs font-semibold text-[#F3F5F5] flex items-center space-x-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Journal Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
