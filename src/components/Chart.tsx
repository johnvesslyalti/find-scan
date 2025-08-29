"use client"
import { useEffect } from "react"
import { init, dispose, Chart } from "klinecharts"
import { OHLCV } from "@/lib/types"

export default function ChartComponent() {
  useEffect(() => {
    const chart: Chart | null = init("chart")
    if (!chart) return

    fetch("/data/ohlcv.json")
      .then(res => res.json())
      .then((data: OHLCV[]) => {
        const bars = data.map(d => ({
          timestamp: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
        }))
        chart.applyNewData(bars)
      })

    return () => {
      dispose("chart")
    }
  }, [])

  return <div id="chart" className="w-full h-[600px]" />
}
