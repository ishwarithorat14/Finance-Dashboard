import React, { useState } from "react";
import {
  Newspaper,
  Search,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Building,
  ArrowRight,
  Filter,
  CheckCircle2
} from "lucide-react";

export default function NewsList({
  news = [],
  categories = [],
  sectors = [],
  selectedCategory,
  onSelectCategory,
  selectedSector,
  onSelectSector,
  bookmarkedOnly,
  onToggleBookmarkedOnly,
  onOpenNewsDetail,
  onToggleBookmark,
}) {
  const [search, setSearch] = useState("");

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      !search ||
      item.headline.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase()) ||
      (item.companies_sectors && item.companies_sectors.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat === "All" ? null : cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
              (cat === "All" && !selectedCategory) || selectedCategory === cat
                ? "bg-[#243447] text-[#F3F5F5] border-[#384E66]"
                : "bg-[#1B2735] text-[#9EADB8] border-[#2D3E52] hover:text-[#F3F5F5]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1B2735] p-3 rounded-xl border border-[#2D3E52]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9EADB8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search headlines, sources, or companies..."
            className="w-full bg-[#243447] text-[#F3F5F5] placeholder-[#6C7E8D] text-xs pl-9 pr-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <select
            value={selectedSector || "All"}
            onChange={(e) => onSelectSector(e.target.value === "All" ? null : e.target.value)}
            className="bg-[#243447] text-[#F3F5F5] text-xs px-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] max-w-[160px] truncate"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={onToggleBookmarkedOnly}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border transition-colors ${
              bookmarkedOnly
                ? "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30"
                : "bg-[#243447] text-[#9EADB8] border-[#2D3E52] hover:text-[#F3F5F5]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked Only</span>
          </button>
        </div>
      </div>

      {/* Headlines List (Progressive Disclosure - Clean, Uncluttered) */}
      <div className="space-y-3">
        {filteredNews.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#9EADB8] bg-[#1B2735] rounded-xl border border-[#2D3E52]">
            No financial headlines match the selected filters.
          </div>
        ) : (
          filteredNews.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenNewsDetail(item)}
              className="bg-[#1B2735] hover:bg-[#1E2C3D] border border-[#2D3E52] hover:border-[#384E66] rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center justify-between group"
            >
              <div className="space-y-1.5 flex-1 pr-4 min-w-0">
                {/* Meta details */}
                <div className="flex items-center space-x-2 text-[10px] font-mono text-[#9EADB8] uppercase">
                  <span className="px-2 py-0.5 rounded bg-[#243447] border border-[#2D3E52] text-[#38bdf8]">
                    {item.category}
                  </span>
                  <span>•</span>
                  <span className="truncate">{item.source}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-[#6C7E8D]" />
                    <span>
                      {new Date(item.publication_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                </div>

                {/* Headline ONLY */}
                <h3 className="text-xs sm:text-sm font-semibold text-[#F3F5F5] group-hover:text-[#38bdf8] transition-colors leading-snug">
                  {item.headline}
                </h3>

                {/* Tags & Observations badge */}
                <div className="flex items-center space-x-2 text-[10px] text-[#9EADB8]">
                  {item.companies_sectors && (
                    <span className="font-mono text-[#6C7E8D]">
                      Involved: {item.companies_sectors}
                    </span>
                  )}
                  {item.personal_observations && (
                    <span className="text-[#10B981] flex items-center space-x-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Observation Logged</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action & Bookmark */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(item.id);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    item.is_bookmarked
                      ? "text-[#38bdf8] hover:bg-[#38bdf8]/10"
                      : "text-[#6C7E8D] hover:text-[#9EADB8]"
                  }`}
                  title={item.is_bookmarked ? "Bookmarked" : "Bookmark article"}
                >
                  {item.is_bookmarked ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
                <div className="p-2 text-[#9EADB8] group-hover:text-[#38bdf8] transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
