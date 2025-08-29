"use client"
import React from "react"

export default function RightPanel() {
  return (
    <aside className="w-72 bg-gray-900 border-l border-gray-800 p-3 text-sm text-gray-200">
      <div className="mb-3 font-semibold">Watchlist</div>
      <ul className="space-y-2 mb-4">
        <li>BTCUSDT</li>
        <li>ETHUSDT</li>
        <li>SOLUSDT</li>
      </ul>

      <div className="mb-3 font-semibold">Indicators</div>
      <div className="space-y-2">
        <label className="flex items-center justify-between">
          <span>MA (50)</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="flex items-center justify-between">
          <span>Bollinger</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
    </aside>
  )
}
