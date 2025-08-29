"use client"
import { useState } from "react"
import Chart from "@/components/Chart"
import BollingerSettings from "@/components/BollingerSettings"
import type { BollingerInputs, BollingerStyle } from "@/lib/types"

export default function Page() {
  const [showSettings, setShowSettings] = useState(false)

  // Bollinger Inputs
  const [inputs, setInputs] = useState<BollingerInputs>({
    length: 20,
    maType: "SMA",
    source: "close",
    stdDev: 2,
    offset: 0,
  })

  // Bollinger Style
  const [style, setStyle] = useState<BollingerStyle>({
    showBasis: true,
    basisColor: "#2196f3",
    basisWidth: 2,
    basisStyle: "solid",
    showUpper: true,
    upperColor: "#f44336",
    upperWidth: 2,
    upperStyle: "solid",
    showLower: true,
    lowerColor: "#4caf50",
    lowerWidth: 2,
    lowerStyle: "solid",
    showBackground: true,
    backgroundOpacity: 0.2,
  })

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Chart */}
      <Chart inputs={inputs} style={style} />

      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="mt-4 px-4 py-2 rounded bg-blue-500 text-white"
      >
        Bollinger Settings
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <BollingerSettings
          inputs={inputs}
          style={style}
          onChange={(i, s) => {
            setInputs(i)
            setStyle(s)
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  )
}
