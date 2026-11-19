import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
} from "lightweight-charts";

export default function TradingViewChart({
  candles = [],
  indicators = {},
  showVolume = true,
  showSma20 = true,
  showSma50 = false,
  height = 380,
}) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create TradingView Lightweight Chart instance
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: "#1B2735" },
        textColor: "#9EADB8",
        fontSize: 12,
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(51, 70, 92, 0.4)" },
        horzLines: { color: "rgba(51, 70, 92, 0.4)" },
      },
      crosshair: {
        vertLine: {
          color: "#9EADB8",
          width: 1,
          style: 1,
          labelBackgroundColor: "#243447",
        },
        horzLine: {
          color: "#9EADB8",
          width: 1,
          style: 1,
          labelBackgroundColor: "#243447",
        },
      },
      timeScale: {
        borderColor: "#2D3E52",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#2D3E52",
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.25 : 0.1,
        },
      },
    });

    chartRef.current = chart;

    // 1. Candlestick Series
    let candlestickSeries;
    try {
      if (typeof chart.addCandlestickSeries === "function") {
        candlestickSeries = chart.addCandlestickSeries({
          upColor: "#10B981",
          downColor: "#EF4444",
          borderVisible: false,
          wickUpColor: "#10B981",
          wickDownColor: "#EF4444",
        });
      } else if (typeof chart.addSeries === "function" && CandlestickSeries) {
        candlestickSeries = chart.addSeries(CandlestickSeries, {
          upColor: "#10B981",
          downColor: "#EF4444",
          borderVisible: false,
          wickUpColor: "#10B981",
          wickDownColor: "#EF4444",
        });
      }
    } catch (e) {
      console.warn("Candlestick series creation fallback:", e);
    }

    if (candlestickSeries && candles && candles.length > 0) {
      candlestickSeries.setData(candles);
    }

    // 2. Volume Series
    if (showVolume && candles && candles.length > 0) {
      try {
        const volumeData = candles.map((c) => ({
          time: c.time,
          value: c.volume || 1000000,
          color:
            c.close >= c.open
              ? "rgba(16, 185, 129, 0.35)"
              : "rgba(239, 68, 68, 0.35)",
        }));

        let volumeSeries;
        if (typeof chart.addHistogramSeries === "function") {
          volumeSeries = chart.addHistogramSeries({
            priceFormat: { type: "volume" },
            priceScaleId: "", // overlay
          });
        } else if (typeof chart.addSeries === "function" && HistogramSeries) {
          volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: "volume" },
            priceScaleId: "",
          });
        }

        if (volumeSeries) {
          volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
          });
          volumeSeries.setData(volumeData);
        }
      } catch (err) {
        console.warn("Volume series setup error:", err);
      }
    }

    // 3. SMA 20 Overlay Line
    if (showSma20 && indicators?.sma20 && indicators.sma20.length > 0) {
      try {
        let sma20Series;
        if (typeof chart.addLineSeries === "function") {
          sma20Series = chart.addLineSeries({
            color: "#38bdf8",
            lineWidth: 2,
            title: "SMA 20",
          });
        } else if (typeof chart.addSeries === "function" && LineSeries) {
          sma20Series = chart.addSeries(LineSeries, {
            color: "#38bdf8",
            lineWidth: 2,
            title: "SMA 20",
          });
        }
        if (sma20Series) {
          sma20Series.setData(indicators.sma20);
        }
      } catch (err) {
        console.warn("SMA20 error:", err);
      }
    }

    // 4. SMA 50 Overlay Line
    if (showSma50 && indicators?.sma50 && indicators.sma50.length > 0) {
      try {
        let sma50Series;
        if (typeof chart.addLineSeries === "function") {
          sma50Series = chart.addLineSeries({
            color: "#fbbf24",
            lineWidth: 2,
            title: "SMA 50",
          });
        } else if (typeof chart.addSeries === "function" && LineSeries) {
          sma50Series = chart.addSeries(LineSeries, {
            color: "#fbbf24",
            lineWidth: 2,
            title: "SMA 50",
          });
        }
        if (sma50Series) {
          sma50Series.setData(indicators.sma50);
        }
      } catch (err) {
        console.warn("SMA50 error:", err);
      }
    }

    // Fit content
    chart.timeScale().fitContent();

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [candles, indicators, showVolume, showSma20, showSma50, height]);

  return (
    <div className="w-full relative">
      <div
        ref={chartContainerRef}
        className="w-full rounded-lg overflow-hidden border border-[#2D3E52]"
      />
      {candles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1B2735]/80 text-[#9EADB8] text-xs">
          Loading market chart data...
        </div>
      )}
    </div>
  );
}
