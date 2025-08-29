"use client";
import { useEffect, useRef, useState } from "react";
import { init, dispose, Chart as KChart } from "klinecharts";
import computeBollingerBands from "@/lib/indicators/bollinger";
import type { BollingerInputs, BollingerStyle, OHLCV } from "@/lib/types";

type ChartProps = {
  inputs: BollingerInputs;
  style: BollingerStyle;
};

export default function Chart({ inputs, style }: ChartProps) {
  const overlayIdsRef = useRef<string[]>([])
  const chartRef = useRef<KChart | null>(null)
  const pointsRef = useRef<ReturnType<typeof computeBollingerBands>>([])
  const [tooltip, setTooltip] = useState<{
    index: number | null
    basis: number | null
    upper: number | null
    lower: number | null
  }>({ index: null, basis: null, upper: null, lower: null })

  useEffect(() => {
    const chart: KChart | null = init("chart");
    chartRef.current = chart
    if (!chart) return;

    fetch("/data/ohlcv.json")
      .then((res) => res.json())
      .then((data: OHLCV[]) => {
        const bars = data.map((d) => ({
          timestamp: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
        }));

        chart.applyNewData(bars);

        // compute Bollinger bands and register as overlays/indicator
        const points = computeBollingerBands(
          bars.map(b => ({ time: b.timestamp, open: b.open, high: b.high, low: b.low, close: b.close, volume: b.volume })),
          inputs
        )
        pointsRef.current = points

        // Try to register overlays/lines if the chart API exposes createOverlay/createIndicator.
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const runtimeChart = chart as unknown as any
          // clear previous overlays we created
          if (Array.isArray(overlayIdsRef.current) && overlayIdsRef.current.length && typeof runtimeChart.removeOverlay === "function") {
            for (const id of overlayIdsRef.current) {
              try { runtimeChart.removeOverlay(id) } catch {}
            }
            overlayIdsRef.current = []
          }

          if (typeof runtimeChart.createOverlay === "function") {
            // Build coordinate arrays for basis, upper, lower
            const basisCoords = points
              .map((p, idx) => ({ x: idx, y: p.basis }))
              .filter((pt: { x: number; y: number | null }) => pt.y !== null)

            const upperCoords = points
              .map((p, idx) => ({ x: idx, y: p.upper }))
              .filter((pt: { x: number; y: number | null }) => pt.y !== null)

            const lowerCoords = points
              .map((p, idx) => ({ x: idx, y: p.lower }))
              .filter((pt: { x: number; y: number | null }) => pt.y !== null)

            const lineDash = (ls: string) => (ls === "dashed" ? [6, 6] : [])
            const lineStyle = (color: string, width: number, ls: string) => ({
              styles: { color, size: width, style: lineDash(ls) }
            })

            // basis
            if (style.showBasis) {
              const basisId = runtimeChart.createOverlay({ name: "line", attrs: [{ coordinates: basisCoords }], lock: true, extendData: lineStyle(style.basisColor, style.basisWidth, style.basisStyle) })
              if (basisId) overlayIdsRef.current.push(basisId)
            }

            // upper
            if (style.showUpper) {
              const upperId = runtimeChart.createOverlay({ name: "line", attrs: [{ coordinates: upperCoords }], lock: true, extendData: lineStyle(style.upperColor, style.upperWidth, style.upperStyle) })
              if (upperId) overlayIdsRef.current.push(upperId)
            }

            // lower
            if (style.showLower) {
              const lowerId = runtimeChart.createOverlay({ name: "line", attrs: [{ coordinates: lowerCoords }], lock: true, extendData: lineStyle(style.lowerColor, style.lowerWidth, style.lowerStyle) })
              if (lowerId) overlayIdsRef.current.push(lowerId)
            }

            // polygon fill between upper and lower: concat upper then reversed lower
            if (style.showBackground) {
              const polyCoords = []
              for (let i = 0; i < points.length; i++) {
                const u = points[i].upper
                if (u !== null) polyCoords.push({ x: i, y: u })
              }
              for (let i = points.length - 1; i >= 0; i--) {
                const l = points[i].lower
                if (l !== null) polyCoords.push({ x: i, y: l })
              }
              if (polyCoords.length >= 3) {
                const alpha = Math.min(1, Math.max(0, style.backgroundOpacity))
                const fill = `rgba(33, 150, 243, ${alpha})`
                const polyId = runtimeChart.createOverlay({ name: "polygon", attrs: [{ coordinates: polyCoords }], lock: true, extendData: { styles: { color: fill, borderSize: 0 } } })
                if (polyId) overlayIdsRef.current.push(polyId)
              }
            }
          } else if (typeof runtimeChart.createIndicator === "function") {
            // createIndicator might accept an object describing lines; try a minimal approach
            runtimeChart.createIndicator(
              {
                name: "BollingerBands",
                // minimal params; the library will likely ignore unknown fields safely
                params: inputs,
                lines: points.map(p => ({ time: p.time, basis: p.basis, upper: p.upper, lower: p.lower })),
              },
              true
            )
          }
        } catch (err) {
          // don't crash; the integration will be improved in a follow-up
          console.warn("Bollinger overlay creation skipped:", err)
        }
      });

    return () => {
      try {
        // remove our overlays explicitly if possible
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const runtimeChart = chartRef.current as unknown as any
        if (runtimeChart && typeof runtimeChart.removeOverlay === "function" && overlayIdsRef.current.length) {
          for (const id of overlayIdsRef.current) {
            try { runtimeChart.removeOverlay(id) } catch {}
          }
          overlayIdsRef.current = []
        }
      } catch {}
      dispose("chart");
    };
  }, [inputs, style]); // rerun when inputs/style change

  // subscribe to crosshair to update tooltip
  useEffect(() => {
    const chart = chartRef.current as unknown as any
    if (!chart || typeof chart.subscribeAction !== "function") return
    const handler = (param: any) => {
      try {
        const idx = param?.dataIndex
        if (typeof idx === "number" && pointsRef.current[idx]) {
          const p = pointsRef.current[idx]
          setTooltip({ index: idx, basis: p.basis, upper: p.upper, lower: p.lower })
        } else {
          setTooltip({ index: null, basis: null, upper: null, lower: null })
        }
      } catch {
        /* noop */
      }
    }
    chart.subscribeAction("crosshair", handler)
    return () => {
      try { chart.unsubscribeAction?.("crosshair", handler) } catch {}
    }
  }, [])

  return (
    <div id="chart" className="w-full h-full relative">
      {tooltip.index !== null && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          <div>BB Basis: {tooltip.basis?.toFixed(2) ?? "-"}</div>
          <div>BB Upper: {tooltip.upper?.toFixed(2) ?? "-"}</div>
          <div>BB Lower: {tooltip.lower?.toFixed(2) ?? "-"}</div>
        </div>
      )}
    </div>
  );
}
