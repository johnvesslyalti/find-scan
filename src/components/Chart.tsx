"use client";
import { useEffect } from "react";
import { init, dispose, Chart as KChart } from "klinecharts";
import computeBollingerBands from "@/lib/indicators/bollinger";
import type { BollingerInputs, BollingerStyle, OHLCV } from "@/lib/types";

type ChartProps = {
  inputs: BollingerInputs;
  style: BollingerStyle;
};

export default function Chart({ inputs, style }: ChartProps) {
  useEffect(() => {
    const chart: KChart | null = init("chart");
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

        // For now, log a small sample to verify computation
        console.log("bollinger sample:", points.slice(-5))

        // Try to register overlays/lines if the chart API exposes createOverlay/createIndicator.
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const runtimeChart = chart as unknown as any
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

            // basis
            runtimeChart.createOverlay({ name: "line", attrs: [{ coordinates: basisCoords }] })

            // upper
            runtimeChart.createOverlay({ name: "line", attrs: [{ coordinates: upperCoords }] })

            // lower
            runtimeChart.createOverlay({ name: "line", attrs: [{ coordinates: lowerCoords }] })

            // polygon fill between upper and lower: concat upper then reversed lower
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
              runtimeChart.createOverlay({ name: "polygon", attrs: [{ coordinates: polyCoords }] })
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
      dispose("chart");
    };
  }, [inputs, style]); // rerun when inputs/style change

  return <div id="chart" className="w-full h-[600px]" />;
}
