"use client";
import { useEffect } from "react";
import { init, dispose, Chart as KChart } from "klinecharts";
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

        // 🔑 Here you’ll later call your computeBollingerBands(bars, inputs)
        // and use chart.createIndicator() to draw the bands with style
      });

    return () => {
      dispose("chart");
    };
  }, [inputs, style]); // rerun when inputs/style change

  return <div id="chart" className="w-full h-[600px]" />;
}
