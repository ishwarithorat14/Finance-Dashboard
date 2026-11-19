import React, { useState } from "react";
import { X, Building2, Save, Trash2, Calendar, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

export default function CaseStudyModal({
  isOpen,
  onClose,
  caseStudy,
  onSave,
  onDelete,
}) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    company_name: caseStudy?.company_name || "",
    ticker: caseStudy?.ticker || "",
    sector: caseStudy?.sector || "Technology",
    business_model: caseStudy?.business_model || "",
    revenue_sources: caseStudy?.revenue_sources || "",
    competitive_advantage: caseStudy?.competitive_advantage || "",
    financial_performance: caseStudy?.financial_performance || "",
    growth_opportunities: caseStudy?.growth_opportunities || "",
    risks: caseStudy?.risks || "",
    personal_observations: caseStudy?.personal_observations || "",
    research_resources: caseStudy?.research_resources || "",
  });

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company_name.trim()) {
      alert("Company name is required.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-[#1B2735] border border-[#384E66] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3E52] bg-[#243447]/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#fbbf24]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F3F5F5]">
                {caseStudy?.id ? "Edit Case Study" : "New Company Case Study"}
              </h3>
              <p className="text-xs text-[#9EADB8]">
                In-depth business model and moat research
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9EADB8] hover:text-[#F3F5F5] p-1.5 rounded-md hover:bg-[#243447] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Top Info: Company, Ticker, Sector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#243447] border border-[#2D3E52] rounded-xl">
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                placeholder="e.g. Tata Consultancy Services"
                className="w-full bg-[#1B2735] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Ticker Symbol
              </label>
              <input
                type="text"
                value={form.ticker}
                onChange={(e) => handleChange("ticker", e.target.value)}
                placeholder="e.g. TCS.NS or NVDA"
                className="w-full bg-[#1B2735] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Industry Sector
              </label>
              <select
                value={form.sector}
                onChange={(e) => handleChange("sector", e.target.value)}
                className="w-full bg-[#1B2735] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Banking & Financials">Banking & Financials</option>
                <option value="Energy & Conglomerate">Energy & Conglomerate</option>
                <option value="Automotive">Automotive</option>
                <option value="Semiconductors & AI">Semiconductors & AI</option>
                <option value="Consumer & Retail">Consumer & Retail</option>
                <option value="Healthcare & Pharma">Healthcare & Pharma</option>
              </select>
            </div>
          </div>

          {/* Business Model & Revenue Sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#9EADB8] uppercase block">
                1. Business Model
              </label>
              <textarea
                rows={4}
                value={form.business_model}
                onChange={(e) => handleChange("business_model", e.target.value)}
                placeholder="How does this company create, deliver, and capture economic value?"
                className="w-full bg-[#243447] text-[#F3F5F5] p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#9EADB8] uppercase block">
                2. Revenue Sources & Segments
              </label>
              <textarea
                rows={4}
                value={form.revenue_sources}
                onChange={(e) => handleChange("revenue_sources", e.target.value)}
                placeholder="Breakdown of core divisions, client types, and monetization..."
                className="w-full bg-[#243447] text-[#F3F5F5] p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
              />
            </div>
          </div>

          {/* Competitive Advantage (Moat) & Financial Performance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#10B981] uppercase block flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3. Competitive Advantage (Economic Moat)</span>
              </label>
              <textarea
                rows={4}
                value={form.competitive_advantage}
                onChange={(e) => handleChange("competitive_advantage", e.target.value)}
                placeholder="Network effects, high switching costs, scale advantages, brand, patents..."
                className="w-full bg-[#243447] text-[#F3F5F5] p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#38bdf8] uppercase block flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>4. Financial Performance & Margins</span>
              </label>
              <textarea
                rows={4}
                value={form.financial_performance}
                onChange={(e) => handleChange("financial_performance", e.target.value)}
                placeholder="Operating margins, Return on Equity (ROE), Free Cash Flow, debt levels..."
                className="w-full bg-[#243447] text-[#F3F5F5] p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
              />
            </div>
          </div>

          {/* Growth Opportunities & Key Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#fbbf24] uppercase block">
                5. Growth Opportunities
              </label>
              <textarea
                rows={3}
                value={form.growth_opportunities}
                onChange={(e) => handleChange("growth_opportunities", e.target.value)}
                placeholder="Market expansion, new products, inorganic acquisitions..."
                className="w-full bg-[#243447] text-[#F3F5F5] p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#EF4444] uppercase block flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>6. Key Risks & Vulnerabilities</span>
              </label>
              <textarea
                rows={3}
                value={form.risks}
                onChange={(e) => handleChange("risks", e.target.value)}
                placeholder="Technological disruption, regulatory shifts, customer concentration..."
                className="w-full bg-[#243447] text-[#F3F5F5] p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
              />
            </div>
          </div>

          {/* Personal Observations & Research Sources */}
          <div className="space-y-1.5 p-4 bg-[#243447] border border-[#2D3E52] rounded-xl">
            <label className="text-[11px] font-semibold text-[#F3F5F5] uppercase block">
              7. Personal Investment Observations
            </label>
            <textarea
              rows={3}
              value={form.personal_observations}
              onChange={(e) => handleChange("personal_observations", e.target.value)}
              placeholder="Your personal thesis: Is this a high-quality compounder? At what valuation is it attractive?"
              className="w-full bg-[#1B2735] text-[#F3F5F5] p-3 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8] resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#9EADB8] uppercase block">
              8. Research Resources & Documents
            </label>
            <input
              type="text"
              value={form.research_resources}
              onChange={(e) => handleChange("research_resources", e.target.value)}
              placeholder="Annual Report FY24, Analyst Day transcript, Brokerage note..."
              className="w-full bg-[#243447] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#2D3E52] flex items-center justify-between">
            {caseStudy?.id ? (
              <button
                type="button"
                onClick={() => onDelete(caseStudy.id)}
                className="px-3 py-1.5 rounded-lg text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Study</span>
              </button>
            ) : <div />}

            <div className="flex space-x-2">
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
                <span>Save Case Study</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
