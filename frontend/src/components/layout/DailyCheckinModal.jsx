import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";

export default function DailyCheckinModal({
  isOpen,
  onClose,
  tasks = [],
  onToggleComplete,
  onAddTask,
  onCarryForward,
  onUpdateReason,
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Learning");
  const [newDueTime, setNewDueTime] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

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
    setIsAdding(false);
  };

  const pendingCount = tasks.filter((t) => !t.is_completed).length;
  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#1B2735] border border-[#384E66] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3E52] bg-[#243447]/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F3F5F5]">
                Daily Accountability Check-in
              </h3>
              <p className="text-xs text-[#9EADB8]">
                {completedCount} completed · {pendingCount} pending
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#9EADB8]">
                No tasks logged for today yet. Set your daily finance focus!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    task.is_completed
                      ? "bg-[#243447]/40 border-[#2D3E52] opacity-75"
                      : "bg-[#243447] border-[#384E66]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
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
                      <div className="space-y-1">
                        <span
                          className={`text-xs block ${
                            task.is_completed
                              ? "line-through text-[#6C7E8D]"
                              : "text-[#F3F5F5] font-medium"
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
                          {task.is_carried_forward && (
                            <span className="text-[#38bdf8] italic">
                              Carried forward
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason selector if incomplete */}
                  {!task.is_completed && (
                    <div className="mt-2.5 pt-2 border-t border-[#2D3E52]/60 flex items-center space-x-2 text-xs">
                      <span className="text-[11px] text-[#9EADB8] shrink-0">
                        Reason if missed:
                      </span>
                      <select
                        value={task.incomplete_reason || ""}
                        onChange={(e) => onUpdateReason(task.id, e.target.value)}
                        className="bg-[#1B2735] text-[#F3F5F5] text-[11px] px-2 py-1 rounded border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] w-full"
                      >
                        <option value="">-- Select reason if unable to finish --</option>
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

          {/* Add New Task Form */}
          {isAdding ? (
            <form
              onSubmit={handleAddSubmit}
              className="p-3.5 bg-[#243447] border border-[#384E66] rounded-lg space-y-3"
            >
              <div className="text-xs font-semibold text-[#F3F5F5]">
                New Daily Focus Task
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What will you learn or trade today?"
                className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs px-3 py-2 rounded border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
                autoFocus
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-[#1B2735] text-[#F3F5F5] text-xs px-2.5 py-1.5 rounded border border-[#2D3E52]"
                >
                  <option value="Learning">Learning</option>
                  <option value="Trading Practice">Trading Practice</option>
                  <option value="Market Analysis">Market Analysis</option>
                  <option value="Review">Review</option>
                </select>
                <input
                  type="text"
                  value={newDueTime}
                  onChange={(e) => setNewDueTime(e.target.value)}
                  placeholder="Target Time (e.g. 4:00 PM)"
                  className="bg-[#1B2735] text-[#F3F5F5] text-xs px-2.5 py-1.5 rounded border border-[#2D3E52]"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded text-xs text-[#9EADB8] hover:text-[#F3F5F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#384E66] hover:bg-[#48627d] text-[#F3F5F5] text-xs font-medium"
                >
                  Add Task
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 border border-dashed border-[#384E66] hover:border-[#9EADB8] rounded-lg text-xs text-[#9EADB8] hover:text-[#F3F5F5] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Task</span>
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-[#243447]/60 border-t border-[#2D3E52] flex items-center justify-between">
          <button
            onClick={onCarryForward}
            disabled={pendingCount === 0}
            className="flex items-center space-x-1.5 text-xs text-[#9EADB8] hover:text-[#38bdf8] disabled:opacity-40 disabled:hover:text-[#9EADB8] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Carry Forward Unfinished to Tomorrow</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#243447] hover:bg-[#2b3e55] border border-[#384E66] text-xs font-medium text-[#F3F5F5] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
