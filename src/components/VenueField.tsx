import { useEffect, useRef, useState } from "react"

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] }
  properties?: {
    name?: string
    street?: string
    housenumber?: string
    district?: string
    city?: string
    county?: string
    state?: string
    country?: string
    postcode?: string
  }
}
type PhotonResponse = { features?: PhotonFeature[] }

type LeafletLatLng = { lat: number; lng: number }
type LeafletMarker = {
  setLatLng(point: LeafletLatLng): LeafletMarker
  on(event: string, callback: () => void): LeafletMarker
  getLatLng(): LeafletLatLng
  addTo(map: LeafletMap): LeafletMarker
}
type LeafletMap = {
  setView(point: LeafletLatLng, zoom: number): LeafletMap
  on(event: string, callback: (event: { latlng: LeafletLatLng }) => void): LeafletMap
  remove(): void
}
type LeafletNamespace = {
  map(element: HTMLElement, options?: Record<string, unknown>): LeafletMap
  tileLayer(url: string, options: Record<string, unknown>): { addTo(map: LeafletMap): void }
  marker(point: LeafletLatLng, options: Record<string, unknown>): LeafletMarker
}
type LeafletWindow = Window & { L?: LeafletNamespace }

let leafletPromise: Promise<void> | null = null
function loadLeaflet(): Promise<void> {
  if ((window as LeafletWindow).L) return Promise.resolve()
  if (!leafletPromise) {
    leafletPromise = new Promise<void>((resolve, reject) => {
      if (!document.querySelector('link[data-da3wetna-leaflet="true"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        link.dataset.da3wetnaLeaflet = "true"
        document.head.appendChild(link)
      }
      const existing = document.querySelector<HTMLScriptElement>('script[data-da3wetna-leaflet="true"]')
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true })
        existing.addEventListener("error", () => reject(new Error("تعذر تحميل الخريطة. حاول تحديث الصفحة.")), { once: true })
        if ((window as LeafletWindow).L) resolve()
        return
      }
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.dataset.da3wetnaLeaflet = "true"
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("تعذر تحميل الخريطة. حاول تحديث الصفحة."))
      document.head.appendChild(script)
    }).catch((error) => { leafletPromise = null; throw error })
  }
  return leafletPromise
}

function featureLabel(feature: PhotonFeature): string {
  const p = feature.properties || {}
  return [p.name, [p.housenumber, p.street].filter(Boolean).join(" "), p.district, p.city, p.state, p.country]
    .filter(Boolean).join("، ")
}
function featureName(feature: PhotonFeature): string {
  const p = feature.properties || {}
  return p.name || [p.street, p.city].filter(Boolean).join(" — ") || "مكان بدون اسم"
}
function featureAddress(feature: PhotonFeature): string {
  const p = feature.properties || {}
  return [[p.housenumber, p.street].filter(Boolean).join(" "), p.district, p.city, p.state, p.postcode, p.country]
    .filter(Boolean).join("، ")
}
const coordinateLink = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

function cityCenter(city: string): LeafletLatLng {
  const normalized = city.trim().toLowerCase()
  if (/اسكندري|الإسكندرية|alexandria/.test(normalized)) return { lat: 31.2001, lng: 29.9187 }
  if (/الجيز|giza/.test(normalized)) return { lat: 30.0131, lng: 31.2089 }
  if (/القاهر|cairo/.test(normalized)) return { lat: 30.0444, lng: 31.2357 }
  if (/شرم|sharm/.test(normalized)) return { lat: 27.9158, lng: 34.3299 }
  if (/الغردق|hurghada/.test(normalized)) return { lat: 27.2579, lng: 33.8116 }
  if (/المنصور|mansoura/.test(normalized)) return { lat: 31.0409, lng: 31.3785 }
  if (/طنطا|tanta/.test(normalized)) return { lat: 30.7865, lng: 31.0004 }
  return { lat: 30.0444, lng: 31.2357 }
}

type Props = {
  value: string
  city: string
  mapUrl: string
  address: string
  latitude: number | null
  longitude: number | null
  onChange: (venue: string, address: string, latitude: number | null, longitude: number | null, mapUrl: string) => void
}

export function VenueField({ value, city, mapUrl, address, latitude, longitude, onChange }: Props) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const [mapError, setMapError] = useState("")
  const [mapPickerOpen, setMapPickerOpen] = useState(false)
  const requestId = useRef(0)
  const wrapper = useRef<HTMLDivElement>(null)
  const mapElement = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<LeafletMarker | null>(null)
  const onChangeRef = useRef(onChange)
  const latest = useRef({ latitude, longitude, venue: value, address })

  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  useEffect(() => {
    latest.current = { latitude, longitude, venue: value, address }
    setQuery(value)
  }, [value, address, latitude, longitude])

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  useEffect(() => {
    const search = query.trim()
    if (search.length < 3 || (search === value && mapUrl)) {
      setSuggestions([])
      setLoading(false)
      return
    }
    const currentRequest = ++requestId.current
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError("")
      try {
        const queries = [...new Set([
          [search, city.trim(), "مصر"].filter(Boolean).join(" "),
          [search, city.trim()].filter(Boolean).join(" "),
          search,
        ])]
        let results: PhotonFeature[] = []
        let requestFailed = false
        for (const text of queries) {
          const params = new URLSearchParams({ q: text, limit: "6" })
          const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, { headers: { Accept: "application/json" } })
          if (!response.ok) { requestFailed = true; continue }
          const data = await response.json() as PhotonResponse
          results = (data.features || []).filter((item) => item.geometry?.coordinates?.length === 2)
          if (results.length) break
        }
        if (currentRequest !== requestId.current) return
        setSuggestions(results.slice(0, 6))
        setOpen(true)
        if (!results.length) setError(requestFailed
          ? "تعذر الوصول لخدمة البحث. تقدر تحدد المكان من الخريطة أو تكتب بياناته يدويًا."
          : "المكان مش موجود في نتائج البحث. جرّب الاسم بالإنجليزي أو حدده من الخريطة واكتب اسمه يدويًا.")
      } catch (cause) {
        if (currentRequest === requestId.current) setError(cause instanceof Error ? cause.message : "حصلت مشكلة أثناء البحث. حاول تاني.")
      } finally {
        if (currentRequest === requestId.current) setLoading(false)
      }
    }, 550)
    return () => { window.clearTimeout(timer); if (requestId.current === currentRequest) requestId.current += 1 }
  }, [query, city, value, mapUrl])

  useEffect(() => {
    if (!mapPickerOpen || !mapElement.current) {
      if (!mapPickerOpen) {
        mapRef.current?.remove()
        mapRef.current = null
        markerRef.current = null
      }
      return
    }
    let cancelled = false
    async function setupMap() {
      try {
        await loadLeaflet()
        const L = (window as LeafletWindow).L
        if (cancelled || !L || !mapElement.current) return
        const point = latitude != null && longitude != null ? { lat: latitude, lng: longitude } : cityCenter(city)
        if (!mapRef.current) {
          const map = L.map(mapElement.current, { scrollWheelZoom: false }).setView(point, 16)
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          }).addTo(map)
          mapRef.current = map
          markerRef.current = L.marker(point, { draggable: true }).addTo(map)
          markerRef.current.on("dragend", () => {
            const moved = markerRef.current?.getLatLng()
            if (!moved) return
            const lat = Number(moved.lat.toFixed(7))
            const lng = Number(moved.lng.toFixed(7))
            onChangeRef.current(latest.current.venue, latest.current.address, lat, lng, coordinateLink(lat, lng))
          })
          map.on("click", (event) => {
            const lat = Number(event.latlng.lat.toFixed(7))
            const lng = Number(event.latlng.lng.toFixed(7))
            markerRef.current?.setLatLng({ lat, lng })
            onChangeRef.current(latest.current.venue, latest.current.address, lat, lng, coordinateLink(lat, lng))
          })
        } else {
          mapRef.current.setView(point, 16)
          markerRef.current?.setLatLng(point)
        }
        setMapError("")
      } catch (cause) {
        if (!cancelled) setMapError(cause instanceof Error ? cause.message : "تعذر عرض الخريطة.")
      }
    }
    void setupMap()
    return () => { cancelled = true }
  }, [latitude, longitude, mapPickerOpen, city])

  useEffect(() => () => { mapRef.current?.remove(); mapRef.current = null; markerRef.current = null }, [])

  function choosePlace(feature: PhotonFeature) {
    const coordinates = feature.geometry?.coordinates
    if (!coordinates) return
    const [lng, lat] = coordinates
    const name = featureName(feature)
    const fullAddress = featureAddress(feature) || featureLabel(feature)
    setQuery(name)
    setSuggestions([])
    setOpen(false)
    setError("")
    onChange(name, fullAddress, lat, lng, coordinateLink(lat, lng))
  }

  return (
    <div ref={wrapper} className="relative w-full">
      <div className="relative">
        <input
          type="text" autoComplete="off" value={query} maxLength={100}
          placeholder="اكتب اسم القاعة أو الفندق..."
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            const next = event.target.value
            setQuery(next); setOpen(true); setError("")
            onChange(next, "", null, null, "")
          }}
          aria-label="ابحث عن القاعة أو المكان" aria-autocomplete="list" aria-expanded={open && suggestions.length > 0}
        />
        {loading ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#a64257]">جاري البحث…</span> : null}
      </div>
      {open && suggestions.length > 0 ? (
        <ul role="listbox" className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[#efd5dc] bg-white p-2 shadow-[0_16px_40px_rgba(74,45,51,0.16)]">
          {suggestions.map((feature, index) => (
            <li key={`${feature.geometry?.coordinates?.join(",") || "place"}-${index}`} role="option" aria-selected="false">
              <button type="button" onClick={() => choosePlace(feature)} className="w-full rounded-xl px-3 py-3 text-right transition hover:bg-[#fff3f5]">
                <span className="block text-sm font-bold text-[#4a2d33]">{featureName(feature)}</span>
                <span className="mt-1 block text-[11px] text-[#9a8187]">{featureLabel(feature)}</span>
              </button>
            </li>
          ))}
          <li className="px-3 py-1 text-left text-[11px] text-[#90777d]" dir="ltr">© OpenStreetMap contributors · Search by Photon</li>
        </ul>
      ) : null}
      {error ? <p role="status" className="mt-2 text-xs text-[#b83b50]">{error}</p> : null}
      <p className="mt-2 text-[11px] leading-6 text-[#90777d]">لو القاعة مش ظاهرة في البحث، اكتب اسمها وافتح الخريطة وحدد مكانها بنفسك. جرّب البحث بالعربي أو الإنجليزي.</p>
      <button type="button" onClick={() => setMapPickerOpen((current) => !current)} className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-[#d9a3ae] bg-white px-4 text-xs font-bold text-[#a64257] transition hover:bg-[#fff3f5]">
        {mapPickerOpen || (latitude != null && longitude != null) ? "إخفاء الخريطة" : "📍 تحديد المكان على الخريطة"}
      </button>
      {address ? <p className="mt-2 text-xs leading-6 text-[#527566]">العنوان: {address}</p> : null}
      {mapPickerOpen ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-[#efd5dc] bg-[#fffafa]">
          <div ref={mapElement} className="h-64 w-full" aria-label="خريطة تفاعلية لاختيار مكان المناسبة" />
          <p className="px-3 py-2 text-[11px] leading-5 text-[#806b70]">اضغط على الخريطة لنقل العلامة، أو اسحب العلامة للمكان الصحيح. {latitude == null || longitude == null ? "الخريطة تبدأ من المدينة المكتوبة، أو القاهرة لو المدينة فاضية." : "تم حفظ الإحداثيات تلقائيًا."}</p>
          {mapError ? <p role="status" className="px-3 pb-3 text-xs text-[#b83b50]">{mapError}</p> : null}
        </div>
      ) : null}
      {mapUrl ? <p className="mt-2 text-[11px] font-bold text-[#527566]">✓ تم حفظ المكان وإحداثياته في بيانات الدعوة</p> : null}
    </div>
  )
}
