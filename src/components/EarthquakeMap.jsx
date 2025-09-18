import React, { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import axios from 'axios'
import { magToColor } from '../utils/colorScale'

const USGS_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

// Helper component to fix Leaflet map resizing issues
function ResizeHandler() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 200)
  }, [map])
  return null
}

export default function EarthquakeMap({ minMag = 0, onDataLoaded }) {
  const [quakes, setQuakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    axios
      .get(USGS_URL)
      .then((res) => {
        if (cancelled) return
        setQuakes(res.data.features || [])
      })
      .catch((err) => {
        console.error(err)
        if (cancelled) return
        setError('Failed to load earthquake data')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const visible = useMemo(
    () => quakes.filter((f) => (f.properties.mag || 0) >= minMag),
    [quakes, minMag]
  )

  // Send filtered quakes back up to App.jsx
  useEffect(() => {
    if (onDataLoaded) {
      onDataLoaded(visible)
    }
  }, [visible, onDataLoaded])

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <div>
          <strong>Earthquakes (past day):</strong> {visible.length}
        </div>
        <div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm px-3 py-1 bg-slate-100 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="p-4 text-center">Loading...</div>}
      {error && <div className="p-4 text-center text-red-500">{error}</div>}

      {!loading && !error && (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom
          className="h-[600px] w-full rounded-xl shadow"
        >
          <ResizeHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {visible.map((f) => {
            const coords = f.geometry?.coordinates || [0, 0, 0]
            const [lon, lat, depth] = coords
            if (lat === undefined || lon === undefined) return null

            const mag = f.properties.mag || 0
            const radius = Math.max(4, mag * 4)
            const color = magToColor(mag)

            return (
              <CircleMarker
                key={f.id}
                center={[lat, lon]}
                radius={radius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.6,
                  weight: 1,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div>
                      <strong>{f.properties.place}</strong>
                    </div>
                    <div>Magnitude: {mag}</div>
                    <div>Depth: {depth} km</div>
                    <div>
                      Time: {new Date(f.properties.time).toLocaleString()}
                    </div>
                    <div>
                      <a
                        href={f.properties.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600"
                      >
                        More details
                      </a>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      )}
    </div>
  )
}
