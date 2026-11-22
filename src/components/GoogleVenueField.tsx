import { useEffect, useRef, useState } from "react"

type PlacePrediction = {
  text: { toString(): string }
  toPlace(): PlaceDetails
}

type PlaceDetails = {
  displayName?: { toString(): string } | string
  formattedAddress?: string
  googleMapsURI?: string
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

type GoogleMapsWindow = Window & {
  google?: {
    maps?: {
      importLibrary?: (name: string) => Promise<unknown>
    }
  }
}

let placesPromise: Promise<PlacesLibrary> | null = null

function loadPlacesLibrary(apiKey: string): Promise<PlacesLibrary> {
  const win = window as GoogleMapsWindow
  if (win.google?.maps?.importLibrary) {
    return win.google.maps.importLibrary("places") as Promise<PlacesLibrary>
  }
  if (!placesPromise) {
    placesPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-da3wetna-google-maps="true"]')
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true })
        existing.addEventListener("error", () => reject(new Error("تعذر تحميل خدمة خرائط جوجل.")), { once: true })
        if (win.google?.maps?.importLibrary) resolve()
        return
      }
      const script = document.createElement("script")
      script.dataset.da3wetnaGoogleMaps = "true"
      script.async = true
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&language=ar&region=EG`
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("تعذر تحميل خدمة خرائط جوجل. راجع إعدادات مفتاح API."))
      document.head.appendChild(script)
    }).then(async () => {
      const importLibrary = (window as GoogleMapsWindow).google?.maps?.importLibrary
      if (!importLibrary) throw new Error("خدمة البحث عن الأماكن غير متاحة حاليًا.")
      return importLibrary("places") as Promise<PlacesLibrary>
    }).catch((error) => {
      placesPromise = null
      throw error
    })
  }
  return placesPromise
}

type Props = {
  value: string
  city: string
  mapUrl: string
  onChange: (venue: string, mapUrl: string) => void
}

export function GoogleVenueField({ value, city, mapUrl, onChange }: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const requestId = useRef(0)
  const sessionToken = useRef<unknown>(null)
  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => setQuery(value), [value])

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (wrapper.current && !wrapper.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  useEffect(() => {
    const search = query.trim()
    if (!apiKey || search.length < 3 || search === value && mapUrl) {
      setSuggestions([])
      setLoading(false)
      return
    }

    const currentRequest = ++requestId.current
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError("")
      try {
        const places = await loadPlacesLibrary(apiKey)
        if (!sessionToken.current) sessionToken.current = new places.AutocompleteSessionToken()
        const { suggestions: results } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: [search, city.trim()].filter(Boolean).join(" "),
          includedRegionCodes: ["eg"],
          language: "ar",
          region: "eg",
          sessionToken: sessionToken.current,
        })
        if (currentRequest !== requestId.current) return
        setSuggestions(results.flatMap((item) => item.placePrediction ? [item.placePrediction] : []).slice(0, 6))
        setOpen(true)
      } catch (cause) {
        if (currentRequest === requestId.current) {
          setSuggestions([])
          setError(cause instanceof Error ? cause.message : "حصلت مشكلة أثناء البحث. حاول تاني.")
        }
      } finally {
        if (currentRequest === requestId.current) setLoading(false)
      }
    }, 350)

    return () => window.clearTimeout(timer)
  }, [query, city, apiKey, value, mapUrl])

  async function choosePlace(prediction: PlacePrediction) {
    setSelecting(true)
    setError("")
    try {
      const place = prediction.toPlace()
      await place.fetchFields({ fields: ["displayName", "formattedAddress", "googleMapsURI"] })
      const name = place.displayName?.toString() || prediction.text.toString()
      const url = place.googleMapsURI || ""
      if (!url) throw new Error("جوجل مرجّعش رابط المكان. اختار نتيجة تانية.")
      setQuery(name)
      setSuggestions([])
      setOpen(false)
      sessionToken.current = null
      onChange(name, url)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذر حفظ المكان. حاول تاني.")
    } finally {
      setSelecting(false)
    }
  }

  return (
    <div ref={wrapper} className="relative">
      <div className="relative">
        <input
          type="text"
          autoComplete="off"
          value={query}
          maxLength={80}
          placeholder={apiKey ? "اكتب اسم القاعة..." : "اكتب اسم القاعة يدويًا"}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            const next = event.target.value
            setQuery(next)
            setOpen(true)
            onChange(next, "")
          }}
          aria-label="ابحث عن القاعة على خرائط جوجل"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
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

      {apiKey && open && query.trim().length >= 3 && !loading && !selecting && !suggestions.length && !error ? (
        <p className="mt-2 text-xs text-[#90777d]">مفيش نتائج ظاهرة. جرّب تكتب اسم القاعة والمدينة.</p>
      ) : null}
      {error ? <p role="status" className="mt-2 text-xs text-[#b83b50]">{error}</p> : null}
      {!apiKey ? <p className="mt-2 text-[11px] leading-6 text-[#90777d]">البحث التلقائي هيتفعل بعد إضافة مفتاح Google Maps للموقع. تقدر تكتب اسم القاعة حاليًا، أو تستخدم خانة الرابط اليدوية في الإضافات.</p> : mapUrl ? <p className="mt-2 text-[11px] font-bold text-[#527566]">✓ تم اختيار القاعة وحفظ رابطها من Google Maps</p> : <p className="mt-2 text-[11px] text-[#90777d]">اكتب ٣ حروف على الأقل، وبعدها اختار القاعة من النتائج.</p>}
    </div>
  )
}
