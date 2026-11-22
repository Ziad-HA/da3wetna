/** زخارف نباتية مرسومة بالكود (أصلية) — وردة، كرمة متدلية، كاللا، سرو، نافورة. */

function rng(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

const ROSE = [["#B54A5E", "#7B1F30"], ["#E7A9B2", "#C9707F"], ["#F3CFC9", "#D99A9A"], ["#8E2A3E", "#5E1424"]]
const LEAF = ["#6C7A3A", "#58662E", "#7F8C4A", "#4F5C28"]

function Rose({ x, y, r, k }: { x: number; y: number; r: number; k: number }) {
  const [a, b] = ROSE[k % ROSE.length]
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={a} />
      <circle r={r * 0.78} fill={a} stroke={b} strokeWidth={r * 0.07} />
      <path d={`M${-r * 0.7} 0 A${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.7} 0`} fill="none" stroke={b} strokeWidth={r * 0.08} />
      <path d={`M${-r * 0.45} ${r * 0.1} A${r * 0.45} ${r * 0.45} 0 0 0 ${r * 0.45} ${r * 0.1}`} fill="none" stroke={b} strokeWidth={r * 0.08} />
      <circle r={r * 0.28} fill={b} opacity=".75" />
      <path d={`M${-r * 0.2} ${-r * 0.1} q${r * 0.2} ${r * 0.3} ${r * 0.4} 0`} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth={r * 0.06} />
    </g>
  )
}

function Leaf({ x, y, rot, s, c }: { x: number; y: number; rot: number; s: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 C6 -7 16 -7 24 0 C16 7 6 7 0 0Z" fill={c} />
      <path d="M2 0 L21 0" stroke="#fff" strokeOpacity=".28" strokeWidth=".8" />
    </g>
  )
}

const HYD = ["#E8A9B8", "#D98CA2", "#F2CCD2", "#C97690"]

function Hydrangea({ x, y, r, R }: { x: number; y: number; r: number; R: () => number }) {
  const dots = Array.from({ length: 16 }, (_, i) => {
    const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r
    return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={r * (0.2 + R() * 0.12)} fill={HYD[Math.floor(R() * 4)]} stroke="#B65F78" strokeWidth=".6" />
  })
  return <g>{dots}</g>
}

function Anthurium({ x, y, s, rot }: { x: number; y: number; s: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 C-15 -6 -17 -27 0 -34 C17 -27 15 -6 0 0Z" fill="#7B1F30" />
      <path d="M0 -4 C-8 -10 -8 -24 0 -29" stroke="#B8485D" strokeWidth="1.2" fill="none" opacity=".7" />
      <path d="M0 -4 q3 -10 6 -22" stroke="#E7CB7A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  )
}

type Pt = [number, number]

/** بيفرش ورد وأوراق وهورتنسيا وأنثوريوم على طول خط (كرمة أو إكليل). */
function Flora({ pts, seed, rose = 1, tails = true }: { pts: Pt[]; seed: number; rose?: number; tails?: boolean }) {
  const R = rng(seed)
  const leaves: React.ReactNode[] = []
  const blooms: React.ReactNode[] = []
  const strands: React.ReactNode[] = []
  pts.forEach(([x, y], i) => {
    const ang = (R() < 0.5 ? -1 : 1) * (25 + R() * 70)
    leaves.push(<Leaf key={`a${i}`} x={x} y={y} rot={ang} s={1.1 + R() * 1.0} c={LEAF[Math.floor(R() * 4)]} />)
    if (R() < 0.8) leaves.push(<Leaf key={`b${i}`} x={x + (R() - 0.5) * 16} y={y + (R() - 0.5) * 16} rot={ang + 180} s={0.9 + R() * 0.9} c={LEAF[Math.floor(R() * 4)]} />)
    const k = R()
    const px = x + (R() - 0.5) * 34, py = y + (R() - 0.5) * 22
    if (k < 0.4 * rose) blooms.push(<Rose key={`r${i}`} x={px} y={py} r={11 + R() * 13} k={Math.floor(R() * 4)} />)
    else if (k < 0.58 * rose) blooms.push(<Hydrangea key={`h${i}`} x={px} y={py} r={14 + R() * 8} R={R} />)
    else if (k < 0.68 * rose) blooms.push(<Anthurium key={`n${i}`} x={px} y={py} s={0.8 + R() * 0.5} rot={(R() - 0.5) * 80} />)
    if (tails && R() < 0.3) {
      const len = 70 + R() * 130
      strands.push(<path key={`t${i}`} d={`M${x} ${y} q${(R() - 0.5) * 26} ${len / 2} ${(R() - 0.5) * 12} ${len}`} stroke="#8E2A3E" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeDasharray="1.2 4.2" />)
    }
  })
  return <>{leaves}{strands}{blooms}</>
}

/** كرمة متدلية من فوق، فيها ورد وهورتنسيا وأنثوريوم وأوراق وخيوط. */
export function Vine({ height = 420, seed = 3, mirror = false, className = "" }: { height?: number; seed?: number; mirror?: boolean; className?: string }) {
  const pts: Pt[] = []
  for (let y = 0; y < height; y += 15) pts.push([68 + Math.sin(y / 60 + seed) * 20, y])
  const stem = "M68 0 " + pts.map(([x, y]) => `L${x.toFixed(1)} ${y}`).join(" ")
  return (
    <svg className={className} viewBox={`0 0 160 ${height + 90}`} aria-hidden="true" style={mirror ? { transform: "scaleX(-1)" } : undefined}>
      <path d={stem} stroke="#55622B" strokeWidth="3.4" fill="none" />
      <Flora pts={pts} seed={seed} rose={1 - (pts.length ? 0 : 0)} />
    </svg>
  )
}

/** إكليل أفقي على شكل قوس فوق الصفحة. */
export function Garland({ className = "", seed = 21 }: { className?: string; seed?: number }) {
  const pts: Pt[] = []
  for (let x = -10; x <= 410; x += 13) pts.push([x, 38 + Math.sin(((x + 10) / 420) * Math.PI) * -22 + Math.sin(x / 31) * 6])
  const stem = "M-10 38 " + pts.map(([x, y]) => `L${x} ${y.toFixed(1)}`).join(" ")
  return (
    <svg className={className} viewBox="0 0 400 170" aria-hidden="true" preserveAspectRatio="xMidYMin slice">
      <path d={stem} stroke="#55622B" strokeWidth="3.4" fill="none" />
      <Flora pts={pts} seed={seed} />
    </svg>
  )
}

/** فاصل بين الأقسام: خط بوردة صغيرة وورقتين. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 40" aria-hidden="true">
      <path d="M10 20 H92 M128 20 H210" stroke="#7F8A47" strokeWidth="1.2" />
      <Leaf x={94} y={20} rot={-160} s={0.9} c="#6C7A3A" />
      <Leaf x={126} y={20} rot={-20} s={0.9} c="#6C7A3A" />
      <Rose x={110} y={20} r={9} k={0} />
    </svg>
  )
}

/** كاللا ليلي بأوراق. */
export function Calla({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 120 160" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M60 160 C58 120 62 90 70 50" stroke="#55622B" strokeWidth="3" fill="none" />
      <path d="M60 140 C30 120 14 90 22 60 C44 80 56 104 60 140Z" fill="#6C7A3A" />
      <path d="M62 150 C92 134 108 108 100 78 C80 96 66 120 62 150Z" fill="#58662E" />
      <path d="M70 52 C40 50 34 14 58 4 C84 0 100 24 88 44 C84 50 76 54 70 52Z" fill="#8A2A3D" />
      <path d="M70 52 C56 40 56 22 62 10" stroke="#5C1626" strokeWidth="1.5" fill="none" opacity=".6" />
      <path d="M66 50 C64 30 68 18 76 12 C80 30 76 44 66 50Z" fill="#B9485C" opacity=".7" />
      <rect x="66" y="22" width="5" height="22" rx="2.5" fill="#E2B94F" transform="rotate(12 68 33)" />
    </svg>
  )
}

export function Cypress({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 90" aria-hidden="true">
      <path d="M15 0 C26 22 28 60 24 90 L6 90 C2 60 4 22 15 0Z" fill="#4C5B30" />
      <path d="M15 8 C21 28 22 58 19 90" stroke="#6C7A3A" strokeWidth="2" fill="none" opacity=".6" />
    </svg>
  )
}

export function Fountain({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 190" aria-hidden="true">
      <defs>
        <linearGradient id="stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E9D9AE" /><stop offset="1" stopColor="#B99A62" /></linearGradient>
      </defs>
      <ellipse cx="100" cy="168" rx="92" ry="16" fill="url(#stone)" />
      <ellipse cx="100" cy="162" rx="84" ry="12" fill="#BFD6D2" />
      <path d="M92 150 L108 150 L112 100 L88 100Z" fill="url(#stone)" />
      <ellipse cx="100" cy="100" rx="52" ry="11" fill="url(#stone)" />
      <ellipse cx="100" cy="97" rx="44" ry="8" fill="#BFD6D2" />
      <path d="M95 96 L105 96 L108 56 L92 56Z" fill="url(#stone)" />
      <ellipse cx="100" cy="56" rx="26" ry="7" fill="url(#stone)" />
      <path d="M100 48 C94 40 96 30 100 20 C104 30 106 40 100 48Z" fill="#CBA566" />
      <circle cx="100" cy="17" r="5" fill="#CBA566" />
    </svg>
  )
}

/** إطار بيضاوي بحواف متموجة (scalloped). */
export function ScallopOval({ className = "" }: { className?: string }) {
  const pts: string[] = []
  const n = 56
  for (let i = 0; i <= 360; i += 2) {
    const t = (i * Math.PI) / 180
    const bump = 1 + 0.018 * Math.sin(t * n / 2)
    pts.push(`${i ? "L" : "M"}${(150 + 138 * bump * Math.cos(t)).toFixed(1)} ${(200 + 188 * bump * Math.sin(t)).toFixed(1)}`)
  }
  return (
    <svg className={className} viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">
      <path d={pts.join(" ") + "Z"} fill="none" stroke="#7F8A47" strokeWidth="3" />
    </svg>
  )
}
