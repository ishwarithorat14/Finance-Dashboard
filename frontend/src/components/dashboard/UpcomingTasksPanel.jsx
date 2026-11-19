import React, { useState } from "react";
import {
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function UpcomingTasksPanel({
  tasks = [],
  pendingCount = 0,
  completedCount = 0,
  onToggleComplete,
  onAddTask,
  onUpdateReason,
  onCarryForward,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Learning");
  const [newDueTime, setNewDueTime] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const incompleteReasons = [
    "Lack of time",
    "Unexpected interruption",
    "Difficulty understanding the topic",
    "Lack of focus",
    "Other",
  ];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      due_time: newDueTime || null,
      is_completed: false,
    });
    setNewTitle("");
    setNewDueTime("");
    setShowAddForm(false);
  };

  return (
    <div className="bg-[#1B2735] border border-[#2D3E52] rounded-xl overflow-hidden transition-all duration-200">
      {/* Collapsed Header / Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#1E2C3D] transition-colors"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#10B981]">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-[#F3F5F5]">
                Upcoming Tasks
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#243447] text-[#9EADB8] border border-[#2D3E52]">
                {pendingCount} pending · {completedCount} done
              </span>
            </div>
            <p className="text-xs text-[#9EADB8] mt-0.5">
              Daily accountability checklist and study targets
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
        <div className="px-5 pb-5 pt-2 border-t border-[#2D3E52] space-y-4 bg-[#1B2735]/60">
          {/* Action Toolbar */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-[#9EADB8] uppercase tracking-wider">
              Today's Queue
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={onCarryForward}
                disabled={pendingCount === 0}
                className="text-xs text-[#9EADB8] hover:text-[#38bdf8] disabled:opacity-40 flex items-center space-x-1 transition-colors"
              >
                <ArrowRight className="w-3 h-3" />
                <span>Carry Forward</span>
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs text-[#F3F5F5] hover:text-[#38bdf8] flex items-center space-x-1 font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
            </div>
          </div>

          {/* Quick Add Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddSubmit}
              className="p-3 bg-[#243447] border border-[#384E66] rounded-lg space-y-2.5"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What will you accomplish today?"
                className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs px-3 py-1.5 rounded border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
                autoFocus
              />
              <div className="flex space-x-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-[#1B2735] text-[#F3F5F5] text-xs px-2 py-1 rounded border border-[#2D3E52]"
                >
                  <option value="Learning">Learning</option>
                  <option value="Trading Practice">Trading Practice</option>
                  <option value="Market Analysis">Market Analysis</option>
                </select>
                <input
                  type="text"
                  value={newDueTime}
                  onChange={(e) => setNewDueTime(e.target.value)}
                  placeholder="Due Time (optional)"
                  className="bg-[#1B2735] text-[#F3F5F5] text-xs px-2 py-1 rounded border border-[#2D3E52] flex-1"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#384E66] hover:bg-[#48627d] text-xs text-[#F3F5F5] rounded font-medium"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          {/* Task List */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-4 text-xs text-[#9EADB8]">
                No pending tasks. Click "New Task" to set your focus.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border transition-all ${
                    task.is_completed
                      ? "bg-[#243447]/30 border-[#2D3E52] opacity-70"
                      : "bg-[#243447] border-[#2D3E52] hover:border-[#384E66]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2.5 flex-1">
                      <button
                        onClick={() => onToggleComplete(task.id, !task.is_completed)}
                        className="mt-0.5 text-[#9EADB8] hover:text-[#10B981] transition-colors shrink-0"
                      >
                        {task.is_completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#6C7E8D]" />
                        )}
                      </button>
                      <div className="space-y-0.5">
                        <span
                          className={`text-xs block ${
                            task.is_completed
                              ? "line-through text-[#6C7E8D]"
                              : "text-[#F3F5F5]"
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-[#9EADB8]">
                          <span className="px-1.5 py-0.5 rounded bg-[#1B2735] border border-[#2D3E52]">
                            {task.category}
                          </span>
                          {task.due_time && (
                            <span className="flex items-center space-x-1 text-[#6C7E8D]">
                              <Clock className="w-3 h-3" />
                              <span>{task.due_time}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inline Reason Selector if Incomplete */}
                  {!task.is_completed && (
                    <div className="mt-2 pt-2 border-t border-[#2D3E52]/50 flex items-center space-x-2">
                      <span className="text-[10px] text-[#9EADB8] shrink-0">
                        Reason if missed:
                      </span>
                      <select
                        value={task.incomplete_reason || ""}
                        onChange={(e) => onUpdateReason(task.id, e.target.value)}
                        className="bg-[#1B2735] text-[#F3F5F5] text-[10px] px-2 py-0.5 rounded border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] w-full"
                      >
                        <option value="">-- Incomplete Reason --</option>
                        {incompleteReasons.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
