import React, { useState } from 'react'
import EarthquakeMap from './components/EarthquakeMap'
import EarthquakeList from './components/EarthquakeList'
import { magToColor } from './utils/colorScale'

export default function App() {
  const [minMag, setMinMag] = useState(0)
  const [filteredQuakes, setFilteredQuakes] = useState([])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="p-4 bg-white shadow">
        <h1 className="text-xl font-semibold">Earthquake Visualizer</h1>
        <p className="text-sm text-slate-600">
          Recent earthquakes (past day) — interactive map
        </p>
      </header>

      {/* Main */}
      <main className="p-4 max-w-7xl mx-auto flex-1 w-full">
        {/* Magnitude Filter */}
        <section className="mb-4 flex gap-4 items-center">
          <label className="flex items-center gap-2 w-full max-w-md">
            <span className="text-sm whitespace-nowrap">Min magnitude:</span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="8"
                step="0.1"
                value={minMag}
                onChange={(e) => setMinMag(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    ${magToColor(0)}, 
                    ${magToColor(2)}, 
                    ${magToColor(3)}, 
                    ${magToColor(4)}, 
                    ${magToColor(5)}, 
                    ${magToColor(6)})`,
                }}
              />
            </div>
            <span className="w-10 text-right font-medium">
              {minMag.toFixed(1)}
            </span>
          </label>
        </section>

        {/* Layout: Map + List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map */}
          <div className="lg:col-span-2 bg-white p-2 rounded shadow">
            <EarthquakeMap
              minMag={minMag}
              onDataLoaded={setFilteredQuakes}
            />
          </div>

          {/* List */}
          <div className="bg-white p-2 rounded shadow">
            <EarthquakeList earthquakes={filteredQuakes} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-xs text-slate-500 text-center">
        Data from the USGS —{' '}
        <a
          href="https://earthquake.usgs.gov/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          https://earthquake.usgs.gov/
        </a>
      </footer>
    </div>
  )
}
