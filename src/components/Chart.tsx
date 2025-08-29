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

        // TODO: create overlay/indicator with chart.createOverlay or chart.createIndicator
      });

    return () => {
      dispose("chart");
    };
  }, [inputs, style]); // rerun when inputs/style change

  return <div id="chart" className="w-full h-[600px]" />;
}
