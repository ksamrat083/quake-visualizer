import React from 'react'

export default function EarthquakeList({ earthquakes = [] }) {
  return (
    <div>
      <h2 className="text-sm font-medium mb-2">Earthquake List (filtered)</h2>

      {earthquakes.length === 0 ? (
        <div className="text-slate-500 text-sm">
          No earthquakes match this filter.
        </div>
      ) : (
        <ul className="space-y-2 max-h-[600px] overflow-auto pr-1">
          {earthquakes.map((f) => (
            <li
              key={f.id}
              className="p-2 border rounded bg-white hover:bg-slate-50 transition"
            >
              <div className="flex justify-between items-center">
                {/* Left: place + time */}
                <div>
                  <div className="font-semibold text-sm">
                    {f.properties.place}
                  </div>
                  <div className="text-xs text-slate-600">
                    {new Date(f.properties.time).toLocaleString()}
                  </div>
                </div>

                {/* Right: magnitude + depth */}
                <div className="text-right">
                  <div className="text-lg font-bold text-rose-600">
                    {f.properties.mag?.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-600">
                    Depth: {f.geometry?.coordinates?.[2]} km
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
