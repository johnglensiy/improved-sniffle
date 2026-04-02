import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type LatLng = { lat: number; lng: number }

interface MapProps {
  initialCenter?: LatLng
  initialZoom?: number
  onPick?: (p: LatLng) => void
  tileUrl?: string
  tileAttribution?: string
}

export function MapComponent({
  initialCenter = { lat: 33.812, lng: -117.920 },
  initialZoom = 14.3,
  onPick,
  tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) return // prevent double-init (React StrictMode)

    // ---- Initial map creation ----
    const map = L.map(containerRef.current, {
      zoomControl: true,
      zoomSnap: 0,
      zoomDelta: 0.5,
      worldCopyJump: true,
    }).setView([initialCenter.lat, initialCenter.lng], initialZoom)

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: tileAttribution,
    }).addTo(map)

    // ---- Map interaction ----
    map.on('click', (e) => {
      const p = { lat: e.latlng.lat, lng: e.latlng.lng }

      if (!markerRef.current) {
        markerRef.current = L.marker([p.lat, p.lng]).addTo(map)
      } else {
        markerRef.current.setLatLng([p.lat, p.lng])
      }

      onPick?.(p)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [initialCenter.lat, initialCenter.lng, initialZoom, onPick, tileUrl, tileAttribution])

  // ---- Adjust size on container hover ----
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize()
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
}

export default MapComponent;