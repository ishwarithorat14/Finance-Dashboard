import React, { useState } from "react";
import {
  CalendarCheck,
  Award,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Compass,
  AlertCircle,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function MonthlyReviewView({
  reviewData,
  currentYearMonth,
  onChangeYearMonth,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("Learning");
  const [goalTarget, setGoalTarget] = useState(5);
  const [goalUnit, setGoalUnit] = useState("concepts");

  // Missed Goal Reason editing
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [missedReasonText, setMissedReasonText] = useState("");

  if (!reviewData) {
    return (
      <div className="py-12 text-center text-xs text-[#9EADB8]">
        Loading monthly performance data...
      </div>
    );
  }

  const {
    executive_summary,
    learning = {},
    trading = {},
    market_analysis = {},
    goals = {},
    accountability_patterns = [],
  } = reviewData;

  const handleCreateGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    onAddGoal({
      year_month: currentYearMonth,
      title: goalTitle.trim(),
      category: goalCategory,
      target_value: parseFloat(goalTarget) || 1,
      current_value: 0,
      unit: goalUnit,
      is_completed: false,
    });
    setGoalTitle("");
    setShowAddGoal(false);
  };

  const handleSaveMissedReason = (goalId) => {
    onUpdateGoal(goalId, { incomplete_reason: missedReasonText });
    setEditingGoalId(null);
    setMissedReasonText("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#1B2735] border border-[#2D3E52] rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#a78bfa]">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F3F5F5]">
              Monthly Performance Review
            </h2>
            <p className="text-xs text-[#9EADB8]">
              Automated review compiled strictly from your stored learning and trading activity
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#9EADB8]">Review Cycle:</span>
          <input
            type="month"
            value={currentYearMonth}
            onChange={(e) => onChangeYearMonth(e.target.value)}
            className="bg-[#243447] text-[#F3F5F5] font-mono text-xs px-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
          />
        </div>
      </div>

      {/* Synthesized Executive Summary */}
      <div className="p-4 bg-[#243447] border-l-4 border-[#38bdf8] rounded-r-xl space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] block">
          Terminal Executive Summary
        </span>
        <p className="text-xs text-[#F3F5F5] leading-relaxed">
          {executive_summary}
        </p>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Learning Performance */}
        <div className="p-5 bg-[#1B2735] border border-[#2D3E52] rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#38bdf8] uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4" />
              <span>Learning Mastery</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#F3F5F5] mb-1">
              {learning.concepts_completed}{" "}
              <span className="text-xs font-sans text-[#9EADB8]">
                of {learning.total_concepts} Concepts
              </span>
            </div>
            <div className="w-full bg-[#243447] h-1.5 rounded-full overflow-hidden border border-[#2D3E52] my-3">
              <div
                className="h-full bg-[#38bdf8] rounded-full"
                style={{ width: `${learning.learning_progress_pct}%` }}
              />
            </div>
            <div className="space-y-1.5 text-xs text-[#9EADB8]">
              <div className="flex justify-between">
                <span>Progress Score:</span>
                <span className="font-mono text-[#F3F5F5]">
                  {learning.learning_progress_pct}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Resources Studied:</span>
                <span className="font-mono text-[#F3F5F5]">
                  {learning.resources_studied}
                </span>
              </div>
            </div>
          </div>
          <div className="pt-3 mt-4 border-t border-[#2D3E52]/60 text-[11px] text-[#6C7E8D]">
            Curriculum data verified
          </div>
        </div>

        {/* 2. Trading Performance */}
        <div className="p-5 bg-[#1B2735] border border-[#2D3E52] rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#10B981] uppercase tracking-wider mb-3">
              <TrendingUp className="w-4 h-4" />
              <span>Trading Simulation</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#F3F5F5] mb-1">
              {trading.win_rate}%{" "}
              <span className="text-xs font-sans text-[#9EADB8]">Win Rate</span>
            </div>
            <div
              className={`font-mono text-sm font-semibold my-2 ${
                (trading.total_pnl || 0) >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
              }`}
            >
              {(trading.total_pnl || 0) >= 0 ? "+" : ""}
              ₹{trading.total_pnl?.toLocaleString("en-IN", { minimumFractionDigits: 2 })} Net P&L
            </div>
            <div className="space-y-1.5 text-xs text-[#9EADB8]">
              <div className="flex justify-between">
                <span>Total Closed Trades:</span>
                <span className="font-mono text-[#F3F5F5]">
                  {trading.total_simulated_trades}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Winning / Losing:</span>
                <span className="font-mono text-[#F3F5F5]">
                  {trading.winning_trades}W - {trading.losing_trades}L
                </span>
              </div>
            </div>
          </div>
          <div className="pt-3 mt-4 border-t border-[#2D3E52]/60 text-[11px] text-[#6C7E8D]">
            Paper transactions audited
          </div>
        </div>

        {/* 3. Market Analysis */}
        <div className="p-5 bg-[#1B2735] border border-[#2D3E52] rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#fbbf24] uppercase tracking-wider mb-3">
              <Compass className="w-4 h-4" />
              <span>Market Research</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#F3F5F5] mb-1">
              {market_analysis.companies_studied_count}{" "}
              <span className="text-xs font-sans text-[#9EADB8]">
                Companies Analyzed
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-[#9EADB8] my-3">
              <div className="flex justify-between">
                <span>News Events Analyzed:</span>
                <span className="font-mono text-[#F3F5F5]">
                  {market_analysis.news_analyzed_count}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Written Observations:</span>
                <span className="font-mono text-[#F3F5F5]">
                  {market_analysis.observations_recorded}
                </span>
              </div>
            </div>
          </div>
          <div className="pt-3 mt-4 border-t border-[#2D3E52]/60 text-[11px] text-[#6C7E8D]">
            Deep-dives and intelligence synthesis
          </div>
        </div>
      </div>

      {/* Goal Tracking Section */}
      <div className="bg-[#1B2735] border border-[#2D3E52] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2D3E52]">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-[#a78bfa]" />
            <h3 className="text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider">
              Goal Tracking & Missed Goal Accountability ({goals.items?.length || 0})
            </h3>
          </div>
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="px-3 py-1.5 rounded-lg bg-[#384E66] hover:bg-[#48627d] text-[#F3F5F5] text-xs font-semibold flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Monthly Target</span>
          </button>
        </div>

        {/* Add Goal Form */}
        {showAddGoal && (
          <form
            onSubmit={handleCreateGoalSubmit}
            className="p-4 bg-[#243447] border border-[#384E66] rounded-xl space-y-3 text-xs"
          >
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="e.g. Master DCF Valuation & complete 3 case studies"
              className="w-full bg-[#1B2735] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52]"
              autoFocus
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                className="bg-[#1B2735] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52]"
              >
                <option value="Learning">Learning</option>
                <option value="Trading">Trading</option>
                <option value="Market Analysis">Market Analysis</option>
              </select>
              <input
                type="number"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                placeholder="Target count"
                className="bg-[#1B2735] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52]"
              />
              <input
                type="text"
                value={goalUnit}
                onChange={(e) => setGoalUnit(e.target.value)}
                placeholder="Unit (e.g. concepts, trades)"
                className="bg-[#1B2735] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
                className="px-3 py-1 text-xs text-[#9EADB8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-[#384E66] text-xs font-semibold text-[#F3F5F5] rounded"
              >
                Add Goal
              </button>
            </div>
          </form>
        )}

        {/* Goals List */}
        <div className="space-y-3">
          {goals.items?.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#9EADB8]">
              No goals set for this month yet.
            </div>
          ) : (
            goals.items?.map((goal) => (
              <div
                key={goal.id}
                className="p-3.5 bg-[#243447] border border-[#2D3E52] rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <button
                      onClick={() =>
                        onUpdateGoal(goal.id, { is_completed: !goal.is_completed })
                      }
                      className="mt-0.5 text-[#9EADB8] hover:text-[#10B981] transition-colors"
                    >
                      {goal.is_completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#6C7E8D]" />
                      )}
                    </button>
                    <div>
                      <span
                        className={`font-semibold block ${
                          goal.is_completed
                            ? "line-through text-[#6C7E8D]"
                            : "text-[#F3F5F5]"
                        }`}
                      >
                        {goal.title}
                      </span>
                      <span className="text-[10px] text-[#9EADB8]">
                        Category: {goal.category} · Target: {goal.target_value}{" "}
                        {goal.unit}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                      goal.is_completed
                        ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                        : "bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30"
                    }`}
                  >
                    {goal.is_completed ? "Completed" : "Incomplete"}
                  </span>
                </div>

                {/* Missed Goal Reason Section */}
                {!goal.is_completed && (
                  <div className="pt-2 border-t border-[#2D3E52]/60">
                    {editingGoalId === goal.id ? (
                      <div className="space-y-2">
                        <label className="text-[10px] text-[#fbbf24] font-semibold block uppercase">
                          Why was this goal missed or delayed?
                        </label>
                        <textarea
                          rows={2}
                          value={missedReasonText}
                          onChange={(e) => setMissedReasonText(e.target.value)}
                          placeholder="e.g. Underestimated complexity of options pricing; lacked 2 hours on weekend..."
                          className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs p-2 rounded-lg border border-[#2D3E52] resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingGoalId(null)}
                            className="px-2 py-1 text-xs text-[#9EADB8]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveMissedReason(goal.id)}
                            className="px-3 py-1 bg-[#384E66] text-xs text-[#F3F5F5] rounded font-medium"
                          >
                            Save Reason
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9EADB8] italic">
                          {goal.incomplete_reason
                            ? `Reason: "${goal.incomplete_reason}"`
                            : "No reason logged yet for incomplete status."}
                        </span>
                        <button
                          onClick={() => {
                            setEditingGoalId(goal.id);
                            setMissedReasonText(goal.incomplete_reason || "");
                          }}
                          className="text-[11px] text-[#38bdf8] hover:underline shrink-0 ml-2"
                        >
                          {goal.incomplete_reason ? "Edit Reason" : "+ Add Reason"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Daily Accountability Recurring Patterns Analysis */}
      <div className="bg-[#1B2735] border border-[#2D3E52] rounded-xl p-5 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider">
          <AlertCircle className="w-4 h-4 text-[#fbbf24]" />
          <span>Daily Accountability: Recurring Obstacle Patterns</span>
        </div>
        <p className="text-xs text-[#9EADB8]">
          Aggregated reasons why daily tasks were missed or carried forward during this monthly cycle:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {accountability_patterns.length === 0 ? (
            <div className="col-span-full py-4 text-center text-xs text-[#10B981] bg-[#243447] rounded-lg border border-[#2D3E52]">
              Zero missed task reasons recorded! Perfect execution discipline.
            </div>
          ) : (
            accountability_patterns.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#243447] border border-[#2D3E52] rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-medium text-[#F3F5F5] block">
                    {item.reason}
                  </span>
                  <span className="text-[10px] text-[#9EADB8]">
                    Impact: {item.impact}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-[#fbbf24] px-2 py-0.5 rounded bg-[#1B2735] border border-[#2D3E52]">
                  {item.occurrences}x
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
