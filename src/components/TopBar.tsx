"use client"
import React from "react"

export default function TopBar() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 text-white border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="text-xl font-semibold">find-scan</div>
        <div className="flex items-center bg-gray-900/50 rounded px-2 py-1 text-sm">
          <span className="mr-2 text-gray-300">Symbol</span>
          <input className="bg-transparent outline-none w-36 text-white" defaultValue="BTCUSDT" />
        </div>
        <div className="ml-2 flex items-center gap-2">
          <select className="bg-gray-900/50 text-white rounded px-2 py-1 text-sm">
            <option>1m</option>
            <option>5m</option>
            <option>15m</option>
            <option>1h</option>
            <option>4h</option>
            <option>1D</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <button className="px-3 py-1 bg-gray-700 rounded">Indicators</button>
        <button className="px-3 py-1 bg-gray-700 rounded">Templates</button>
        <div className="px-3 py-1 rounded bg-green-600">Save</div>
      </div>
    </header>
  )
}
