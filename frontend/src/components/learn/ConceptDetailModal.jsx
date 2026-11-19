import React, { useState } from "react";
import {
  X,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Award,
  Edit3,
  Save,
  ArrowRight
} from "lucide-react";

export default function ConceptDetailModal({
  isOpen,
  onClose,
  concept,
  onUpdateConcept,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
  onOpenQuiz,
}) {
  if (!isOpen || !concept) return null;

  const [status, setStatus] = useState(concept.learning_status || "Not Started");
  const [progressPct, setProgressPct] = useState(concept.progress_pct || 0);
  const [stoppingPoint, setStoppingPoint] = useState(concept.last_stopping_point || "");
  const [nextAction, setNextAction] = useState(concept.next_action || "");
  const [notes, setNotes] = useState(concept.personal_notes || "");
  const [isSaved, setIsSaved] = useState(false);

  // New Resource Form
  const [showAddRes, setShowAddRes] = useState(false);
  const [newResTitle, setNewResTitle] = useState("");
  const [newResUrl, setNewResUrl] = useState("");
  const [newResType, setNewResType] = useState("article");
  const [newResDesc, setNewResDesc] = useState("");

  const handleSaveConceptMeta = async () => {
    await onUpdateConcept(concept.id, {
      learning_status: status,
      progress_pct: Number(progressPct),
      last_stopping_point: stoppingPoint,
      next_action: nextAction,
      personal_notes: notes,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!newResTitle.trim()) return;
    await onAddResource({
      concept_id: concept.id,
      title: newResTitle.trim(),
      url: newResUrl.trim() || null,
      resource_type: newResType,
      description: newResDesc.trim() || null,
      is_completed: false,
    });
    setNewResTitle("");
    setNewResUrl("");
    setNewResDesc("");
    setShowAddRes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-[#1B2735] border border-[#384E66] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3E52] bg-[#243447]/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#38bdf8]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-[#9EADB8] uppercase block">
                {concept.category_name}
              </span>
              <h3 className="text-base font-semibold text-[#F3F5F5]">
                {concept.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {concept.has_quiz && (
              <button
                onClick={() => onOpenQuiz(concept)}
                className="px-3 py-1.5 rounded-lg bg-[#fbbf24]/15 hover:bg-[#fbbf24]/25 border border-[#fbbf24]/30 text-xs font-semibold text-[#fbbf24] flex items-center space-x-1.5 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Concept Quiz</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#9EADB8] hover:text-[#F3F5F5] p-1.5 rounded-md hover:bg-[#243447] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Status & Progress Bar Control */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#243447] border border-[#2D3E52] rounded-xl">
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1.5 uppercase">
                Learning Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs px-3 py-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-semibold text-[#9EADB8] uppercase">
                  Progress Tracker
                </label>
                <span className="font-mono text-[#F3F5F5] font-semibold">
                  {progressPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressPct}
                onChange={(e) => setProgressPct(e.target.value)}
                className="w-full accent-[#38bdf8] cursor-pointer"
              />
            </div>
          </div>

          {/* Short Description & Content */}
          <div className="space-y-2">
            <div className="text-xs text-[#9EADB8] leading-relaxed italic border-l-2 border-[#38bdf8] pl-3 py-1">
              {concept.short_description}
            </div>
            {concept.content && (
              <div className="p-4 bg-[#1B2735] border border-[#2D3E52] rounded-xl text-[#F3F5F5] text-xs leading-relaxed space-y-2 whitespace-pre-line font-sans">
                {concept.content}
              </div>
            )}
          </div>

          {/* Stopping Point & Next Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#243447] border border-[#2D3E52] rounded-xl space-y-1.5">
              <label className="text-[11px] font-semibold text-[#9EADB8] uppercase flex items-center space-x-1.5">
                <span>Last Stopping Point</span>
              </label>
              <input
                type="text"
                value={stoppingPoint}
                onChange={(e) => setStoppingPoint(e.target.value)}
                placeholder="Where did you pause your reading?"
                className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs px-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>

            <div className="p-3.5 bg-[#243447] border border-[#2D3E52] rounded-xl space-y-1.5">
              <label className="text-[11px] font-semibold text-[#9EADB8] uppercase flex items-center space-x-1.5">
                <span>Next Immediate Action</span>
              </label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="What is your next study milestone?"
                className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs px-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>
          </div>

          {/* Personal Notes */}
          <div className="p-4 bg-[#243447] border border-[#2D3E52] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#9EADB8] uppercase">
                Personal Research Notes & Synthesis
              </label>
              <span className="text-[10px] text-[#6C7E8D]">
                Reflect in your own words
              </span>
            </div>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record your takeaways, formulas, mental models, or market observations..."
              className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
            />
          </div>

          {/* Learning Resources */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9EADB8] uppercase tracking-wider">
                Learning Resources ({concept.resources?.length || 0})
              </span>
              <button
                onClick={() => setShowAddRes(!showAddRes)}
                className="text-xs text-[#38bdf8] hover:text-[#7dd3fc] flex items-center space-x-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Resource</span>
              </button>
            </div>

            {/* Add Resource Form */}
            {showAddRes && (
              <form
                onSubmit={handleCreateResource}
                className="p-3 bg-[#243447] border border-[#384E66] rounded-xl space-y-2.5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newResTitle}
                    onChange={(e) => setNewResTitle(e.target.value)}
                    placeholder="Resource Title"
                    className="sm:col-span-2 bg-[#1B2735] text-[#F3F5F5] text-xs px-3 py-1.5 rounded border border-[#2D3E52]"
                    autoFocus
                  />
                  <select
                    value={newResType}
                    onChange={(e) => setNewResType(e.target.value)}
                    className="bg-[#1B2735] text-[#F3F5F5] text-xs px-2 py-1.5 rounded border border-[#2D3E52]"
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="book">Book</option>
                    <option value="doc">Official Documentation</option>
                    <option value="paper">Academic Paper</option>
                  </select>
                </div>
                <input
                  type="url"
                  value={newResUrl}
                  onChange={(e) => setNewResUrl(e.target.value)}
                  placeholder="URL link (e.g. https://...)"
                  className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs px-3 py-1.5 rounded border border-[#2D3E52]"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRes(false)}
                    className="px-3 py-1 text-xs text-[#9EADB8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#384E66] text-xs text-[#F3F5F5] rounded font-medium"
                  >
                    Save Resource
                  </button>
                </div>
              </form>
            )}

            {/* Resource List */}
            <div className="space-y-2">
              {concept.resources?.length === 0 ? (
                <div className="text-center py-4 text-xs text-[#6C7E8D]">
                  No resources attached yet. Add article or document links above.
                </div>
              ) : (
                concept.resources?.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-[#243447] border border-[#2D3E52] rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={r.is_completed}
                        onChange={(e) =>
                          onUpdateResource(r.id, { is_completed: e.target.checked })
                        }
                        className="rounded bg-[#1B2735] border-[#2D3E52] text-[#10B981] focus:ring-0 cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs truncate ${
                              r.is_completed
                                ? "line-through text-[#6C7E8D]"
                                : "text-[#F3F5F5] font-medium"
                            }`}
                          >
                            {r.title}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#1B2735] text-[#9EADB8] border border-[#2D3E52]">
                            {r.resource_type}
                          </span>
                        </div>
                        {r.description && (
                          <p className="text-[11px] text-[#9EADB8] truncate mt-0.5">
                            {r.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-[#9EADB8] hover:text-[#38bdf8] transition-colors"
                          title="Open resource"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => onDeleteResource(r.id)}
                        className="p-1 text-[#9EADB8] hover:text-[#EF4444] transition-colors"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#243447]/60 border-t border-[#2D3E52] flex items-center justify-between">
          <div className="text-xs text-[#10B981] font-medium">
            {isSaved && "Changes saved successfully to database."}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-[#9EADB8] hover:text-[#F3F5F5] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSaveConceptMeta}
              className="px-4 py-2 rounded-lg bg-[#384E66] hover:bg-[#48627d] text-xs font-semibold text-[#F3F5F5] flex items-center space-x-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
