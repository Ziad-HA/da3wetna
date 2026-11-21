import { toPng } from "html-to-image"

export async function downloadStory(node: HTMLElement, filename: string) {
  await document.fonts.ready
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 1,
    width: 1080,
    height: 1920,
  })
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = filename
  link.click()
}

export function fileName(groom: string, bride: string): string {
  const clean = (value: string) => value.trim().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "")
  const left = clean(groom) || "عريس"
  const right = clean(bride) || "عروسة"
  return `zaffa-${left}-${right}.png`
}
