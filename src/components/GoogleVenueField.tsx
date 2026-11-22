import { useEffect, useRef, useState } from "react"

type LatLng = { lat(): number; lng(): number }
type PlacePrediction = { text: { toString(): string }; toPlace(): PlaceDetails }
type PlaceDetails = {
  displayName?: { toString(): string } | string
  formattedAddress?: string
  googleMapsURI?: string
  location?: LatLng
  fetchFields(options: { fields: string[] }): Promise<void>
}
type PlacesLibrary = {
  AutocompleteSessionToken: new () => unknown
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: {
      input: string
      includedRegionCodes: string[]
      language: string
      region: string
      sessionToken: unknown
    }): Promise<{ suggestions: { placePrediction?: PlacePrediction }[] }>
  }
}
type GoogleMap = { setCenter(position: { lat: number; lng: number }): void; setZoom(zoom: number): void }
type GoogleMarker = {
  setPosition(position: { lat: number; lng: number }): void
  addListener(event: string, callback: () => void): void
  getPosition(): LatLng | null
}
type MapsLibrary = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMap
  Marker: new (options: Record<string, unknown>) => GoogleMarker
}
type GoogleMapsWindow = Window & { google?: { maps?: { importLibrary?: (name: string) => Promise<unknown> } } }

let scriptPromise: Promise<void> | null = null
function loadGoogleMaps(apiKey: string): Promise<void> {
  const win = window as GoogleMapsWindow
  if (win.google?.maps?.importLibrary) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-da3wetna-google-maps="true"]')
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true })
        existing.addEventListener("error", () => reject(new Error("تعذر تحميل خرائط جوجل. راجع إعدادات المفتاح.")), { once: true })
        if (win.google?.maps?.importLibrary) resolve()
        return
      }
      const script = document.createElement("script")
      script.dataset.da3wetnaGoogleMaps = "true"
      script.async = true
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&language=ar&region=EG`
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("تعذر تحميل خرائط جوجل. تأكد من تفعيل Maps JavaScript API والفوترة."))
      document.head.appendChild(script)
    }).catch((error) => { scriptPromise = null; throw error })
  }
  return scriptPromise
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
const coordinateLink = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

export function GoogleVenueField({ value, city, mapUrl, address, latitude, longitude, onChange }: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const [mapError, setMapError] = useState("")
  const requestId = useRef(0)
  const sessionToken = useRef<unknown>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  const mapElement = useRef<HTMLDivElement>(null)
  const mapRef = useRef<GoogleMap | null>(null)
  const markerRef = useRef<GoogleMarker | null>(null)
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
    const key = apiKey
    if (!key || search.length < 3 || (search === value && mapUrl)) {
      setSuggestions([])
      setLoading(false)
      return
    }
    const currentRequest = ++requestId.current
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError("")
      try {
        await loadGoogleMaps(key)
        const places = await (window as GoogleMapsWindow).google!.maps!.importLibrary!("places") as PlacesLibrary
        if (!sessionToken.current) sessionToken.current = new places.AutocompleteSessionToken()
        const response = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: [search, city.trim()].filter(Boolean).join(" "),
          includedRegionCodes: ["eg"], language: "ar", region: "eg",
          sessionToken: sessionToken.current,
        })
        if (currentRequest !== requestId.current) return
        const results = response.suggestions.flatMap((item) => item.placePrediction ? [item.placePrediction] : []).slice(0, 6)
        setSuggestions(results)
        setOpen(true)
        if (!results.length) setError("مفيش نتائج مطابقة. جرّب اسم القاعة مع المدينة.")
      } catch (cause) {
        if (currentRequest === requestId.current) setError(cause instanceof Error ? cause.message : "حصلت مشكلة أثناء البحث. حاول تاني.")
      } finally {
        if (currentRequest === requestId.current) setLoading(false)
      }
    }, 350)
    return () => { window.clearTimeout(timer); if (requestId.current === currentRequest) requestId.current += 1 }
  }, [query, city, apiKey, value, mapUrl])

  useEffect(() => {
    const key = apiKey
    if (latitude == null || longitude == null) {
      mapRef.current = null
      markerRef.current = null
    }
    if (!key || latitude == null || longitude == null || !mapElement.current) return
    let cancelled = false
    async function setupMap() {
      try {
        await loadGoogleMaps(key)
        const maps = await (window as GoogleMapsWindow).google!.maps!.importLibrary!("maps") as MapsLibrary
        if (cancelled || !mapElement.current) return
        const position = { lat: latitude!, lng: longitude! }
        if (!mapRef.current) {
          mapRef.current = new maps.Map(mapElement.current, { center: position, zoom: 16, mapTypeControl: false, streetViewControl: false, fullscreenControl: false, clickableIcons: false })
          markerRef.current = new maps.Marker({ map: mapRef.current, position, draggable: true, title: "اسحب العلامة لتحديد مكان القاعة" })
          markerRef.current.addListener("dragend", () => {
            const point = markerRef.current?.getPosition()
            if (!point) return
            const lat = Number(point.lat().toFixed(7))
            const lng = Number(point.lng().toFixed(7))
            onChangeRef.current(latest.current.venue, latest.current.address, lat, lng, coordinateLink(lat, lng))
          })
        } else {
          mapRef.current.setCenter(position)
          mapRef.current.setZoom(16)
          markerRef.current?.setPosition(position)
        }
        setMapError("")
      } catch (cause) {
        if (!cancelled) setMapError(cause instanceof Error ? cause.message : "تعذر عرض الخريطة.")
      }
    }
    void setupMap()
    return () => { cancelled = true }
  }, [apiKey, latitude, longitude])

  async function choosePlace(prediction: PlacePrediction) {
    if (!apiKey) {
      setError("خدمة البحث مش مفعّلة حاليًا. اكتب اسم القاعة يدويًا.")
      return
    }
    setSelecting(true)
    setError("")
    try {
      await loadGoogleMaps(apiKey)
      const place = prediction.toPlace()
      await place.fetchFields({ fields: ["displayName", "formattedAddress", "googleMapsURI", "location"] })
      const name = place.displayName?.toString() || prediction.text.toString()
      const lat = place.location?.lat()
      const lng = place.location?.lng()
      if (typeof lat !== "number" || typeof lng !== "number") throw new Error("المكان ده ملوش إحداثيات واضحة. اختار نتيجة تانية.")
      const fullAddress = place.formattedAddress || prediction.text.toString()
      const url = place.googleMapsURI || coordinateLink(lat, lng)
      setQuery(name)
      setSuggestions([])
      setOpen(false)
      sessionToken.current = null
      onChange(name, fullAddress, lat, lng, url)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذر حفظ المكان. حاول تاني.")
    } finally {
      setSelecting(false)
    }
  }

  return (
    <div ref={wrapper} className="relative w-full">
      <div className="relative">
        <input
          type="text" autoComplete="off" value={query} maxLength={80}
          placeholder={apiKey ? "اكتب اسم القاعة أو الفندق..." : "اكتب اسم القاعة يدويًا"}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            const next = event.target.value
            setQuery(next); setOpen(true); setError("")
            onChange(next, "", null, null, "")
          }}
          aria-label="ابحث عن القاعة على خرائط جوجل" aria-autocomplete="list" aria-expanded={open && suggestions.length > 0}
        />
        {loading || selecting ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#a64257]">جاري البحث…</span> : null}
      </div>
      {apiKey && open && suggestions.length > 0 ? (
        <ul role="listbox" className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[#efd5dc] bg-white p-2 shadow-[0_16px_40px_rgba(74,45,51,0.16)]">
          {suggestions.map((prediction, index) => (
            <li key={index} role="option" aria-selected="false">
              <button type="button" disabled={selecting} onClick={() => void choosePlace(prediction)} className="w-full rounded-xl px-3 py-3 text-right transition hover:bg-[#fff3f5] disabled:opacity-60">
                <span className="block text-sm font-bold text-[#4a2d33]">{prediction.text.toString()}</span>
                <span className="mt-1 block text-[10px] text-[#9a8187]">Google Maps</span>
              </button>
            </li>
          ))}
          <li className="px-3 py-1 text-left text-[10px] text-[#90777d]" dir="ltr">Powered by Google</li>
        </ul>
      ) : null}
      {error ? <p role="status" className="mt-2 text-xs text-[#b83b50]">{error}</p> : null}
      {!apiKey ? <p className="mt-2 text-[11px] leading-6 text-[#90777d]">البحث التلقائي والخريطة محتاجين إضافة VITE_GOOGLE_MAPS_API_KEY في إعدادات Vercel.</p> : null}
      {address ? <p className="mt-2 text-xs leading-6 text-[#527566]">العنوان: {address}</p> : null}
      {latitude != null && longitude != null ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-[#efd5dc] bg-[#fffafa]">
          <div ref={mapElement} className="h-56 w-full" aria-label="خريطة تفاعلية لمكان المناسبة" />
          <p className="px-3 py-2 text-[11px] leading-5 text-[#806b70]">حرّك العلامة على الخريطة لتعديل مكان القاعة يدويًا.</p>
          {mapError ? <p role="status" className="px-3 pb-3 text-xs text-[#b83b50]">{mapError}</p> : null}
        </div>
      ) : null}
      {mapUrl ? <p className="mt-2 text-[11px] font-bold text-[#527566]">✓ تم حفظ المكان وإحداثياته في بيانات الدعوة</p> : null}
    </div>
  )
}
