"use client"
import React from "react"

const tools = ["Cross", "Trend", "Fib", "Brush", "Text"]

export default function LeftToolbar() {
  return (
    <div className="w-14 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-2 gap-2">
      {tools.map((t) => (
        <button
          key={t}
          title={t}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-200"
        >
          {t[0]}
        </button>
      ))}
    </div>
  )
}
