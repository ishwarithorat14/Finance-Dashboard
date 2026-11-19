import React, { useState } from "react";
import {
  Building2,
  Search,
  Plus,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Calendar,
  ArrowRight
} from "lucide-react";

export default function CaseStudiesList({
  caseStudies = [],
  onOpenCaseStudy,
  onNewCaseStudy,
}) {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");

  const sectors = ["All", ...new Set(caseStudies.map((c) => c.sector).filter(Boolean))];

  const filteredStudies = caseStudies.filter((c) => {
    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;
    const matchesSearch =
      !search ||
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      (c.ticker && c.ticker.toLowerCase().includes(search.toLowerCase())) ||
      (c.business_model && c.business_model.toLowerCase().includes(search.toLowerCase()));
    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1B2735] p-3 rounded-xl border border-[#2D3E52]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9EADB8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company (Reliance, TCS), sector, or moat..."
            className="w-full bg-[#243447] text-[#F3F5F5] placeholder-[#6C7E8D] text-xs pl-9 pr-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-[#243447] text-[#F3F5F5] text-xs px-3 py-1.5 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={onNewCaseStudy}
            className="px-3.5 py-1.5 bg-[#384E66] hover:bg-[#48627d] text-[#F3F5F5] text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Case Study</span>
          </button>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudies.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#9EADB8] bg-[#1B2735] rounded-xl border border-[#2D3E52]">
            No case studies found. Start your first company deep-dive!
          </div>
        ) : (
          filteredStudies.map((study) => (
            <div
              key={study.id}
              onClick={() => onOpenCaseStudy(study)}
              className="bg-[#1B2735] hover:bg-[#1E2C3D] border border-[#2D3E52] hover:border-[#384E66] rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#fbbf24]">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#F3F5F5] group-hover:text-[#38bdf8] transition-colors truncate max-w-[150px]">
                        {study.company_name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#9EADB8] uppercase">
                        {study.ticker || "N/A"}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#243447] text-[#9EADB8] border border-[#2D3E52]">
                    {study.sector}
                  </span>
                </div>

                {/* Business Model Summary */}
                <p className="text-xs text-[#9EADB8] line-clamp-2 leading-relaxed my-3">
                  {study.business_model || "No business model summary recorded."}
                </p>

                {/* Economic Moat Highlight */}
                {study.competitive_advantage && (
                  <div className="p-2.5 rounded-lg bg-[#243447]/60 border border-[#2D3E52] text-[11px] mb-3">
                    <span className="text-[10px] font-semibold text-[#10B981] uppercase flex items-center space-x-1 mb-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Moat & Advantage</span>
                    </span>
                    <p className="text-[#F3F5F5] line-clamp-2">
                      {study.competitive_advantage}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Footer */}
              <div className="pt-3 border-t border-[#2D3E52]/60 flex items-center justify-between text-[11px] text-[#9EADB8]">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-[#6C7E8D]" />
                  <span>
                    {study.analysis_date
                      ? new Date(study.analysis_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                </span>
                <span className="text-xs font-medium text-[#38bdf8] flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
