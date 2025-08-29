"use client"
import { useState } from "react"

export type BollingerInputs = {
  length: number
  maType: "SMA" // for now only SMA, but keeping it extensible
  source: "close" // only close supported
  stdDev: number
  offset: number
}

export type BollingerStyle = {
  showBasis: boolean
  basisColor: string
  basisWidth: number
  basisStyle: "solid" | "dashed"

  showUpper: boolean
  upperColor: string
  upperWidth: number
  upperStyle: "solid" | "dashed"

  showLower: boolean
  lowerColor: string
  lowerWidth: number
  lowerStyle: "solid" | "dashed"

  showBackground: boolean
  backgroundOpacity: number
}

type Props = {
  inputs: BollingerInputs
  style: BollingerStyle
  onChange: (inputs: BollingerInputs, style: BollingerStyle) => void
  onClose: () => void
}

export default function BollingerSettings({
  inputs,
  style,
  onChange,
  onClose,
}: Props) {
  const [localInputs, setLocalInputs] = useState(inputs)
  const [localStyle, setLocalStyle] = useState(style)
  const [tab, setTab] = useState<"inputs" | "style">("inputs")

  const applyChanges = () => {
    onChange(localInputs, localStyle)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl w-[400px] shadow-xl">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 p-2 ${tab === "inputs" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
            onClick={() => setTab("inputs")}
          >
            Inputs
          </button>
          <button
            className={`flex-1 p-2 ${tab === "style" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
            onClick={() => setTab("style")}
          >
            Style
          </button>
        </div>

        {/* Inputs Tab */}
        {tab === "inputs" && (
          <div className="space-y-3">
            <label className="flex justify-between">
              Length:
              <input
                type="number"
                value={localInputs.length}
                onChange={e =>
                  setLocalInputs({ ...localInputs, length: +e.target.value })
                }
                className="border p-1 w-20 text-black"
              />
            </label>
            <label className="flex justify-between">
              StdDev Multiplier:
              <input
                type="number"
                value={localInputs.stdDev}
                onChange={e =>
                  setLocalInputs({ ...localInputs, stdDev: +e.target.value })
                }
                className="border p-1 w-20 text-black"
              />
            </label>
            <label className="flex justify-between">
              Offset:
              <input
                type="number"
                value={localInputs.offset}
                onChange={e =>
                  setLocalInputs({ ...localInputs, offset: +e.target.value })
                }
                className="border p-1 w-20 text-black"
              />
            </label>
          </div>
        )}

        {/* Style Tab */}
        {tab === "style" && (
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              Show Basis:
              <input
                type="checkbox"
                checked={localStyle.showBasis}
                onChange={e =>
                  setLocalStyle({ ...localStyle, showBasis: e.target.checked })
                }
              />
            </label>
            <label className="flex items-center justify-between">
              Basis Color:
              <input
                type="color"
                value={localStyle.basisColor}
                onChange={e =>
                  setLocalStyle({ ...localStyle, basisColor: e.target.value })
                }
              />
            </label>
            <label className="flex items-center justify-between">
              Background Fill:
              <input
                type="checkbox"
                checked={localStyle.showBackground}
                onChange={e =>
                  setLocalStyle({
                    ...localStyle,
                    showBackground: e.target.checked,
                  })
                }
              />
            </label>
            <label className="flex items-center justify-between">
              Background Opacity:
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={localStyle.backgroundOpacity}
                onChange={e =>
                  setLocalStyle({
                    ...localStyle,
                    backgroundOpacity: +e.target.value,
                  })
                }
              />
            </label>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={applyChanges}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
