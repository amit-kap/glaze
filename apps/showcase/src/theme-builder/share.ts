import { isBaseTheme, type BaseTheme } from "./base-themes"
import { emptyCustom, type Custom } from "./state"

// A theme as a URL fragment: the base and the overrides, JSON in URL-safe
// base64 (RFC 4648 §5, padding dropped), so a link carries the whole draft
// without touching a server. Keys are one letter to keep links short.

type Payload = { b: BaseTheme; c: Custom }

export function encodeShare(base: BaseTheme, custom: Custom): string {
  const json = JSON.stringify({ b: base, c: custom } satisfies Payload)
  // btoa only takes Latin-1, so the JSON goes through UTF-8 bytes first.
  const bytes = new TextEncoder().encode(json)
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "")
}

/** Reads a share hash (with or without the "#t=" prefix); null if unusable. */
export function decodeShare(
  hash: string
): { base: BaseTheme; custom: Custom } | null {
  try {
    const encoded = hash
      .replace(/^#?t=/, "")
      .replaceAll("-", "+")
      .replaceAll("_", "/")
    const binary = atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "="))
    const json = new TextDecoder().decode(
      Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
    )
    const payload = JSON.parse(json) as Partial<Payload> | null
    if (!payload || typeof payload !== "object") return null
    if (typeof payload.b !== "string" || !isBaseTheme(payload.b)) return null
    if (!payload.c || typeof payload.c !== "object") return null
    return { base: payload.b, custom: { ...emptyCustom, ...payload.c } }
  } catch {
    return null
  }
}
