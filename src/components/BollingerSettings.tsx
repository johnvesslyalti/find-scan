"use client"
import { useState } from "react"
import type { Props } from "../lib/types"

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

  const inputClass =
    "border rounded p-1 w-24 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"

  const numberInputClass =
    "border rounded p-1 w-20 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"

  const selectClass =
    "border rounded p-1 w-24 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"

  const checkboxClass = "w-4 h-4 accent-blue-500"

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose} // close when clicking outside
    >
      <div
        className="bg-white dark:bg-gray-800 p-4 rounded-2xl w-full max-w-md shadow-xl flex flex-col"
        onClick={e => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-300 dark:border-gray-600 mb-4">
          <button
            className={`flex-1 p-2 ${
              tab === "inputs" ? "border-b-2 border-blue-500 font-semibold" : ""
            }`}
            onClick={() => setTab("inputs")}
          >
            Inputs
          </button>
          <button
            className={`flex-1 p-2 ${
              tab === "style" ? "border-b-2 border-blue-500 font-semibold" : ""
            }`}
            onClick={() => setTab("style")}
          >
            Style
          </button>
        </div>

        {/* Inputs Tab */}
        {tab === "inputs" && (
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-2">
              <span>Length</span>
              <input
                type="number"
                value={localInputs.length}
                min={1}
                onChange={e =>
                  setLocalInputs({ ...localInputs, length: Math.max(1, +e.target.value) })
                }
                className={inputClass}
              />
            </label>

            <label className="flex items-center justify-between gap-2">
              <span>Basic MA Type</span>
              <select
                value={localInputs.maType}
                onChange={e =>
                  setLocalInputs({
                    ...localInputs,
                    maType: e.target.value as typeof localInputs.maType,
                  })
                }
                className={selectClass}
              >
                <option value="SMA">SMA</option>
              </select>
            </label>

            <label className="flex items-center justify-between gap-2">
              <span>Source</span>
              <select
                value={localInputs.source}
                onChange={e =>
                  setLocalInputs({
                    ...localInputs,
                    source: e.target.value as typeof localInputs.source,
                  })
                }
                className={selectClass}
              >
                <option value="close">Close</option>
              </select>
            </label>

            <label className="flex items-center justify-between gap-2">
              <span>StdDev (multiplier)</span>
              <input
                type="number"
                step={0.1}
                value={localInputs.stdDev}
                onChange={e =>
                  setLocalInputs({ ...localInputs, stdDev: +e.target.value })
                }
                className={inputClass}
              />
            </label>

            <label className="flex items-center justify-between gap-2">
              <span>Offset</span>
              <input
                type="number"
                value={localInputs.offset}
                onChange={e =>
                  setLocalInputs({ ...localInputs, offset: +e.target.value })
                }
                className={inputClass}
              />
            </label>
          </div>
        )}

        {/* Style Tab */}
        {tab === "style" && (
          <div className="space-y-4">
            {/* Reusable function for a style section */}
            {[
              {
                title: "Basis",
                show: "showBasis",
                color: "basisColor",
                width: "basisWidth",
                style: "basisStyle",
              },
              {
                title: "Upper",
                show: "showUpper",
                color: "upperColor",
                width: "upperWidth",
                style: "upperStyle",
              },
              {
                title: "Lower",
                show: "showLower",
                color: "lowerColor",
                width: "lowerWidth",
                style: "lowerStyle",
              },
            ].map(section => (
              <div key={section.title}>
                <div className="font-medium mb-2">{section.title}</div>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span>Visible</span>
                    <input
                      type="checkbox"
                      checked={localStyle[section.show as keyof typeof localStyle] as boolean}
                      onChange={e =>
                        setLocalStyle({
                          ...localStyle,
                          [section.show]: e.target.checked,
                        })
                      }
                      className={checkboxClass}
                    />
                  </label>

                  <div className="flex items-center justify-between gap-2">
                    <span>Color</span>
                    <input
                      type="color"
                      value={localStyle[section.color as keyof typeof localStyle] as string}
                      onChange={e =>
                        setLocalStyle({
                          ...localStyle,
                          [section.color]: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span>Width</span>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={localStyle[section.width as keyof typeof localStyle] as number}
                      onChange={e =>
                        setLocalStyle({
                          ...localStyle,
                          [section.width]: +e.target.value,
                        })
                      }
                      className={numberInputClass}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span>Style</span>
                    <select
                      value={localStyle[section.style as keyof typeof localStyle] as string}
                      onChange={e =>
                        setLocalStyle({
                          ...localStyle,
                          [section.style]: e.target.value,
                        })
                      }
                      className={selectClass}
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Background */}
            <div>
              <div className="font-medium mb-2">Background</div>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span>Visible</span>
                  <input
                    type="checkbox"
                    checked={localStyle.showBackground}
                    onChange={e =>
                      setLocalStyle({ ...localStyle, showBackground: e.target.checked })
                    }
                    className={checkboxClass}
                  />
                </label>
                <div className="flex items-center justify-between gap-2">
                  <span>Opacity</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={localStyle.backgroundOpacity}
                    onChange={e =>
                      setLocalStyle({ ...localStyle, backgroundOpacity: +e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={applyChanges}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
