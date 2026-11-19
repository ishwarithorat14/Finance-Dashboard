import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Search,
  Award,
  ArrowRight,
  Filter
} from "lucide-react";

export default function ConceptsList({
  categories = [],
  concepts = [],
  selectedCategoryId,
  onSelectCategory,
  onOpenConcept,
  onOpenQuiz,
  onCreateConcept,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCatId, setNewCatId] = useState(categories[0]?.id || 1);

  const filteredConcepts = concepts.filter((c) => {
    const matchesCat =
      !selectedCategoryId || c.category_id === selectedCategoryId;
    const matchesStatus =
      statusFilter === "All" || c.learning_status === statusFilter;
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.short_description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateConcept({
      category_id: Number(newCatId),
      name: newName.trim(),
      short_description: newDesc.trim() || "Core finance concept",
      content: "",
      learning_status: "Not Started",
      progress_pct: 0,
    });
    setNewName("");
    setNewDesc("");
    setShowCreateModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
      case "In Progress":
        return "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30";
      default:
        return "bg-[#9EADB8]/15 text-[#9EADB8] border-[#9EADB8]/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
            !selectedCategoryId
              ? "bg-[#243447] text-[#F3F5F5] border-[#384E66]"
              : "bg-[#1B2735] text-[#9EADB8] border-[#2D3E52] hover:text-[#F3F5F5]"
          }`}
        >
          All Domains ({concepts.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedCategoryId === cat.id
                ? "bg-[#243447] text-[#F3F5F5] border-[#384E66]"
                : "bg-[#1B2735] text-[#9EADB8] border-[#2D3E52] hover:text-[#F3F5F5]"
            }`}
          >
            {cat.name} ({cat.concept_count})
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1B2735] p-3 rounded-xl border border-[#2D3E52]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9EADB8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search finance concepts..."
            className="w-full bg-[#243447] text-[#F3F5F5] placeholder-[#6C7E8D] text-xs pl-9 pr-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#243447] text-[#F3F5F5] text-xs px-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-[#384E66] hover:bg-[#48627d] text-[#F3F5F5] text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Concept</span>
          </button>
        </div>
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredConcepts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#9EADB8] bg-[#1B2735] rounded-xl border border-[#2D3E52]">
            No concepts match your filter criteria.
          </div>
        ) : (
          filteredConcepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => onOpenConcept(concept)}
              className="bg-[#1B2735] hover:bg-[#1E2C3D] border border-[#2D3E52] hover:border-[#384E66] rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <span className="text-[10px] font-mono tracking-wider text-[#9EADB8] uppercase bg-[#243447] px-2 py-0.5 rounded border border-[#2D3E52]">
                    {concept.category_name}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {concept.has_quiz && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>Quiz</span>
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusBadge(
                        concept.learning_status
                      )}`}
                    >
                      {concept.learning_status}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-[#F3F5F5] group-hover:text-[#38bdf8] transition-colors mb-1.5">
                  {concept.name}
                </h4>
                <p className="text-xs text-[#9EADB8] line-clamp-2 leading-relaxed mb-4">
                  {concept.short_description}
                </p>
              </div>

              <div>
                {/* Progress Bar */}
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-[#9EADB8]">Mastery</span>
                  <span className="font-mono text-[#F3F5F5] font-semibold">
                    {concept.progress_pct}%
                  </span>
                </div>
                <div className="w-full bg-[#243447] h-1.5 rounded-full overflow-hidden border border-[#2D3E52] mb-3">
                  <div
                    className="h-full bg-[#38bdf8] rounded-full transition-all duration-300"
                    style={{ width: `${concept.progress_pct}%` }}
                  />
                </div>

                {/* Stopping Point / Next Action Preview */}
                {(concept.last_stopping_point || concept.next_action) && (
                  <div className="pt-2.5 border-t border-[#2D3E52]/60 text-[11px] text-[#9EADB8] flex items-center justify-between">
                    <span className="truncate pr-2">
                      <strong className="text-[#F3F5F5]">Next:</strong>{" "}
                      {concept.next_action || concept.last_stopping_point}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Concept Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#1B2735] border border-[#384E66] rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#F3F5F5]">
              Add New Finance Concept
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                  Category
                </label>
                <select
                  value={newCatId}
                  onChange={(e) => setNewCatId(e.target.value)}
                  className="w-full bg-[#243447] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                  Concept Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Yield Spread Analysis"
                  className="w-full bg-[#243447] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Key summary and objective of this concept..."
                  className="w-full bg-[#243447] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52] resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-[#9EADB8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#384E66] text-xs font-semibold text-[#F3F5F5] rounded-lg"
                >
                  Create Concept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
