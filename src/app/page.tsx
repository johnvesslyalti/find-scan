"use client"
import { useState } from "react"
import Chart from "@/components/Chart"
import BollingerSettings from "@/components/BollingerSettings"
import TopBar from "@/components/TopBar"
import LeftToolbar from "@/components/LeftToolbar"
import RightPanel from "@/components/RightPanel"
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
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <LeftToolbar />

        <main className="flex-1 p-4 flex flex-col">
          <div className="flex-1 bg-gray-900 rounded-lg shadow-inner">
            <Chart inputs={inputs} style={style} />
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div>
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Bollinger Settings
              </button>
            </div>
            <div className="text-sm text-gray-300">Data source: local ohlcv.json</div>
          </div>
        </main>

        <RightPanel />
      </div>

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
    </div>
  )
}
