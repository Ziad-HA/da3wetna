/** هل اللون فاتح؟ (عشان نختار لون كتابة مقروء فوقه). */
export function isLight(hex: string): boolean {
  const value = hex.replace("#", "")
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  if ([r, g, b].some(Number.isNaN)) return false
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}
