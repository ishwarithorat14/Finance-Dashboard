import React, { useState } from "react";
import {
  X,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Building,
  AlertCircle,
  Eye,
  CheckCircle2,
  Save,
  Newspaper
} from "lucide-react";

export default function NewsDetailModal({
  isOpen,
  onClose,
  newsItem,
  onToggleBookmark,
  onSaveObservations,
}) {
  if (!isOpen || !newsItem) return null;

  const [observations, setObservations] = useState(
    newsItem.personal_observations || ""
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    await onSaveObservations(newsItem.id, observations, newsItem.is_bookmarked);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-[#1B2735] border border-[#384E66] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#2D3E52] bg-[#243447]/60">
          <div className="flex items-start justify-between">
            <div className="space-y-1 pr-4">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[#9EADB8] uppercase">
                <span className="px-2 py-0.5 rounded bg-[#243447] border border-[#2D3E52]">
                  {newsItem.category}
                </span>
                <span>•</span>
                <span>{newsItem.source}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-[#6C7E8D]" />
                  <span>
                    {new Date(newsItem.publication_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>
              <h2 className="text-base font-bold text-[#F3F5F5] leading-snug">
                {newsItem.headline}
              </h2>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onToggleBookmark(newsItem.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  newsItem.is_bookmarked
                    ? "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30"
                    : "bg-[#243447] text-[#9EADB8] hover:text-[#F3F5F5] border-[#2D3E52]"
                }`}
                title={newsItem.is_bookmarked ? "Remove Bookmark" : "Bookmark Article"}
              >
                {newsItem.is_bookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="text-[#9EADB8] hover:text-[#F3F5F5] p-2 rounded-lg hover:bg-[#243447] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 10-Point Analysis Breakdown Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* 4. Short Explanation */}
          <div className="p-3.5 bg-[#243447] border-l-2 border-[#38bdf8] rounded-r-lg text-xs leading-relaxed text-[#F3F5F5]">
            <strong className="text-[#38bdf8] uppercase text-[10px] tracking-wider block mb-1">
              Executive Summary
            </strong>
            {newsItem.short_explanation}
          </div>

          {/* 5. What happened? */}
          {newsItem.what_happened && (
            <div className="space-y-1">
              <h4 className="text-[11px] font-semibold text-[#9EADB8] uppercase tracking-wider">
                5. What Happened?
              </h4>
              <p className="text-xs text-[#F3F5F5] bg-[#243447]/60 p-3 rounded-lg border border-[#2D3E52] leading-relaxed">
                {newsItem.what_happened}
              </p>
            </div>
          )}

          {/* 6. Who was affected? & 7. Companies/Sectors involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-[11px] font-semibold text-[#9EADB8] uppercase tracking-wider">
                6. Who Was Affected?
              </h4>
              <p className="text-xs text-[#F3F5F5] bg-[#243447]/60 p-3 rounded-lg border border-[#2D3E52] leading-relaxed">
                {newsItem.who_affected || "Market participants and relevant sectors."}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-[11px] font-semibold text-[#9EADB8] uppercase tracking-wider">
                7. Companies & Sectors Involved
              </h4>
              <p className="text-xs text-[#F3F5F5] bg-[#243447]/60 p-3 rounded-lg border border-[#2D3E52] leading-relaxed font-mono">
                {newsItem.companies_sectors || newsItem.sector || "Broad Market"}
              </p>
            </div>
          </div>

          {/* 8. Potential Market Implications */}
          {newsItem.market_implications && (
            <div className="space-y-1">
              <h4 className="text-[11px] font-semibold text-[#10B981] uppercase tracking-wider flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>8. Potential Market Implications</span>
              </h4>
              <p className="text-xs text-[#F3F5F5] bg-[#243447]/60 p-3 rounded-lg border border-[#2D3E52] leading-relaxed">
                {newsItem.market_implications}
              </p>
            </div>
          )}

          {/* 9. What should I monitor or investigate? */}
          {newsItem.what_to_monitor && (
            <div className="space-y-1">
              <h4 className="text-[11px] font-semibold text-[#fbbf24] uppercase tracking-wider flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>9. What Should I Monitor or Investigate?</span>
              </h4>
              <p className="text-xs text-[#F3F5F5] bg-[#243447]/60 p-3 rounded-lg border border-[#2D3E52] leading-relaxed">
                {newsItem.what_to_monitor}
              </p>
            </div>
          )}

          {/* 10. My Personal Observations */}
          <div className="p-4 bg-[#243447] border border-[#2D3E52] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-semibold text-[#F3F5F5] uppercase tracking-wider flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>10. My Personal Observations & Synthesis</span>
              </h4>
              <span className="text-[10px] text-[#6C7E8D]">
                Auto-saved to monthly review
              </span>
            </div>
            <textarea
              rows={3}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Record your personal market view: How does this align with your macro thesis? What trades does it trigger?"
              className="w-full bg-[#1B2735] text-[#F3F5F5] text-xs p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#243447]/60 border-t border-[#2D3E52] flex items-center justify-between">
          <div className="text-xs text-[#10B981] font-medium">
            {isSaved && "Observations saved to database!"}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-[#9EADB8] hover:text-[#F3F5F5]"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#384E66] hover:bg-[#48627d] text-xs font-semibold text-[#F3F5F5] flex items-center space-x-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Observations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
