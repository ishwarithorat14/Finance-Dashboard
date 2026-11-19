import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Key,
  DollarSign,
  Globe,
  Database,
  Save,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetCapital,
  onResetDatabase,
}) {
  const [username, setUsername] = useState(settings?.username || "Investor");
  const [startingCapital, setStartingCapital] = useState(
    settings?.starting_virtual_capital || 1000000
  );
  const [marketPref, setMarketPref] = useState(
    settings?.market_preference || "IN"
  );
  const [alphaKey, setAlphaKey] = useState(settings?.alphavantage_api_key || "");
  const [finnhubKey, setFinnhubKey] = useState(settings?.finnhub_api_key || "");
  const [newsKey, setNewsKey] = useState(settings?.news_api_key || "");
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    if (settings) {
      setUsername(settings.username || "Investor");
      setStartingCapital(settings.starting_virtual_capital || 1000000);
      setMarketPref(settings.market_preference || "IN");
      setAlphaKey(settings.alphavantage_api_key || "");
      setFinnhubKey(settings.finnhub_api_key || "");
      setNewsKey(settings.news_api_key || "");
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await onUpdateSettings({
      username,
      starting_virtual_capital: parseFloat(startingCapital),
      market_preference: marketPref,
      alphavantage_api_key: alphaKey,
      finnhub_api_key: finnhubKey,
      news_api_key: newsKey,
    });
    setSaveMsg("Settings updated successfully!");
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleTriggerResetCapital = () => {
    if (
      window.confirm(
        `Are you sure you want to reset your paper trading balance to ₹${parseFloat(
          startingCapital
        ).toLocaleString("en-IN")}? This will clear open simulated positions.`
      )
    ) {
      onResetCapital(parseFloat(startingCapital), true);
    }
  };

  const handleTriggerResetDB = () => {
    if (
      window.confirm(
        "Warning: This will re-seed the entire curriculum, reset news, and wipe trade logs to pristine state. Proceed?"
      )
    ) {
      onResetDatabase();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-5 bg-[#1B2735] border border-[#2D3E52] rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#243447] border border-[#384E66] flex items-center justify-center text-[#9EADB8]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#F3F5F5]">
              Terminal Settings & Configuration
            </h2>
            <p className="text-xs text-[#9EADB8]">
              Manage virtual paper capital, market regions, API credentials, and database state
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
        {/* User & Capital Settings */}
        <div className="p-5 bg-[#1B2735] border border-[#2D3E52] rounded-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider pb-2 border-b border-[#2D3E52]">
            <DollarSign className="w-4 h-4 text-[#10B981]" />
            <span>Virtual Capital & Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Investor Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#243447] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Virtual Capital Allocation
              </label>
              <input
                type="number"
                step="50000"
                value={startingCapital}
                onChange={(e) => setStartingCapital(e.target.value)}
                className="w-full bg-[#243447] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#9EADB8] block mb-1">
                Market Region Focus
              </label>
              <select
                value={marketPref}
                onChange={(e) => setMarketPref(e.target.value)}
                className="w-full bg-[#243447] text-[#F3F5F5] p-2 rounded-lg border border-[#2D3E52]"
              >
                <option value="IN">Indian Markets (NSE / BSE)</option>
                <option value="US">US Markets (NYSE / NASDAQ)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px]">
            <span className="text-[#9EADB8]">
              Current Cash Balance:{" "}
              <strong className="font-mono text-[#F3F5F5]">
                ₹{settings?.current_cash_balance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleTriggerResetCapital}
              className="px-3 py-1.5 rounded-lg bg-[#243447] hover:bg-[#2b3e55] text-[#EF4444] border border-[#2D3E52] flex items-center space-x-1.5 transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Virtual Capital to Target</span>
            </button>
          </div>
        </div>

        {/* Modular External API Keys */}
        <div className="p-5 bg-[#1B2735] border border-[#2D3E52] rounded-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider pb-2 border-b border-[#2D3E52]">
            <Key className="w-4 h-4 text-[#38bdf8]" />
            <span>Modular Market Data & News APIs (Optional)</span>
          </div>

          <p className="text-xs text-[#9EADB8] leading-relaxed">
            FINANCE HQ features an offline-first modular fallback service. When API keys are left blank, high-fidelity verified cached and demonstration feeds are used automatically.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-[#9EADB8]">
                  Alpha Vantage API Key
                </label>
                <span className="text-[10px] text-[#6C7E8D]">
                  {alphaKey ? "Custom Key Configured" : "Default Mode Active"}
                </span>
              </div>
              <input
                type="password"
                value={alphaKey}
                onChange={(e) => setAlphaKey(e.target.value)}
                placeholder="Optional Alpha Vantage Key (leave blank for local feed)"
                className="w-full bg-[#243447] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-[#9EADB8]">
                  Finnhub Stock API Key
                </label>
                <span className="text-[10px] text-[#6C7E8D]">
                  {finnhubKey ? "Custom Key Configured" : "Default Mode Active"}
                </span>
              </div>
              <input
                type="password"
                value={finnhubKey}
                onChange={(e) => setFinnhubKey(e.target.value)}
                placeholder="Optional Finnhub Key"
                className="w-full bg-[#243447] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-[#9EADB8]">
                  NewsAPI Financial Feed Key
                </label>
                <span className="text-[10px] text-[#6C7E8D]">
                  {newsKey ? "Custom Key Configured" : "Curated Intelligence Active"}
                </span>
              </div>
              <input
                type="password"
                value={newsKey}
                onChange={(e) => setNewsKey(e.target.value)}
                placeholder="Optional NewsAPI Key"
                className="w-full bg-[#243447] text-[#F3F5F5] font-mono p-2 rounded-lg border border-[#2D3E52] focus:outline-none focus:border-[#9EADB8]"
              />
            </div>
          </div>
        </div>

        {/* Database Management */}
        <div className="p-5 bg-[#1B2735] border border-[#2D3E52] rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#F3F5F5] uppercase tracking-wider pb-2 border-b border-[#2D3E52]">
            <Database className="w-4 h-4 text-[#fbbf24]" />
            <span>Database & Storage Architecture</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#F3F5F5] block">
                Local SQLite Database Engine (SQLAlchemy ORM)
              </span>
              <span className="text-[11px] text-[#9EADB8]">
                Ready for seamless migration to PostgreSQL. All records persist across server restarts.
              </span>
            </div>
            <button
              type="button"
              onClick={handleTriggerResetDB}
              className="px-3 py-1.5 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 text-xs font-semibold transition-colors shrink-0 ml-4"
            >
              Re-seed Curriculum Data
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveMsg && (
            <span className="text-xs font-semibold text-[#10B981] flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveMsg}</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#384E66] hover:bg-[#48627d] text-xs font-bold text-[#F3F5F5] flex items-center space-x-2 transition-colors shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
