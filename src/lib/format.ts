export function formatArabicDate(iso: string): string {
  if (!iso) return "التاريخ"
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatArabicTime(time: string): string {
  if (!time) return "الوقت"
  const [hours, minutes] = time.split(":").map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return new Intl.DateTimeFormat("ar-EG", { hour: "numeric", minute: "2-digit" }).format(date)
}

export function money(amount: number): string {
  return `${new Intl.NumberFormat("ar-EG").format(amount)} جنيه`
}
