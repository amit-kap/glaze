// CSS values ↔ numbers, plus small browser helpers.

/** "0.625rem" or "10px" → 10. */
export function toPx(value: string | undefined): number {
  const m = value?.match(/^\s*(-?[\d.]+)(rem|px)/)
  if (!m) return 0
  return m[2] === "rem" ? Number(m[1]) * 16 : Number(m[1])
}

export const pxToRem = (px: number) =>
  `${Math.round((px / 16) * 10000) / 10000}rem`

/** "1.5", "calc(1.25 / 0.875)" → a number; anything else → 0. */
export function toNumber(value: string | undefined): number {
  if (!value) return 0
  const div = value.match(/calc\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\)/)
  if (div) return Number(div[1]) / Number(div[2])
  const n = Number.parseFloat(value)
  return Number.isNaN(n) ? 0 : n
}

/** "150ms" or "0.2s" → milliseconds. */
export function toMs(value: string | undefined): number {
  const m = value?.match(/^\s*([\d.]+)(ms|s)/)
  if (!m) return 0
  return m[2] === "s" ? Number(m[1]) * 1000 : Number(m[1])
}

export function download(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  })
  a.click()
  URL.revokeObjectURL(url)
}

/** Black or white, whichever reads better on a hex colour (WCAG luminance). */
export function inkFor(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return (l + 0.05) / 0.05 > 1.05 / (l + 0.05) ? "#0a0a0a" : "#ffffff"
}
