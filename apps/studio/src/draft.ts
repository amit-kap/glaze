import * as React from "react"

import {
  autoInk,
  canonical,
  changed,
  countChanges,
  defaults,
  follows,
  sameColor,
  tokens,
  type Color,
  type Mode,
  type Theme,
} from "./theme"
import {
  countTypeChanges,
  typeDefaults,
  typeTokens,
  type TypeValues,
} from "./typography"

const storageKey = "glaze-studio-draft-v1"

type Unlinked = Record<Mode, string[]>

const noLinks: Unlinked = { light: [], dark: [] }

const onlyTokens = (
  colors: Record<string, Color> | undefined,
  fallback: Record<string, Color>
) =>
  Object.fromEntries(
    tokens.map((token) => [token, colors?.[token] ?? fallback[token]])
  )

type Stored = { theme: Theme; unlinked: Unlinked; type: TypeValues }

const onlyTypeTokens = (values: TypeValues | undefined): TypeValues =>
  Object.fromEntries(
    typeTokens.map((token) => [token, values?.[token] ?? typeDefaults[token]])
  )

function read(): Stored {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null") as {
      theme?: { light?: Record<string, Color>; dark?: Record<string, Color> }
      unlinked?: Unlinked
      type?: TypeValues
    } | null
    if (!stored?.theme)
      return { theme: defaults, unlinked: noLinks, type: typeDefaults }
    // Only tokens the panel still offers, so an old draft can't resurrect a
    // colour Studio no longer edits.
    return {
      theme: {
        light: onlyTokens(stored.theme.light, defaults.light),
        dark: onlyTokens(stored.theme.dark, defaults.dark),
      },
      unlinked: {
        light: stored.unlinked?.light ?? [],
        dark: stored.unlinked?.dark ?? [],
      },
      type: onlyTypeTokens(stored.type),
    }
  } catch {
    return { theme: defaults, unlinked: noLinks, type: typeDefaults }
  }
}

/** The value a following row takes from its source: ink gets the readable end. */
function followed(child: string, source: Color): Color {
  return child === "brand-ink" ? autoInk(source) : source
}

/** Apply the follow rules to one mode, in a pass per level of the chain. */
function settle(mode: Mode, colors: Record<string, Color>, unlinked: string[]) {
  for (let pass = 0; pass < 4; pass++) {
    let moved = false
    for (const [child, parent] of Object.entries(follows)) {
      // A row the user unlinked is theirs, not the rule's.
      if (unlinked.includes(child)) continue
      const next = followed(child, colors[parent])
      if (sameColor(colors[child], next)) continue
      colors[child] = next
      moved = true
    }
    if (!moved) break
  }
  return colors
}

const without = (list: string[], token: string) =>
  list.filter((item) => item !== token)

/**
 * The draft theme: two independent colour sets, the overrides derived by
 * comparing against Nova, and the follow rules that keep action colours tied
 * to identity until the user takes one over.
 */
export function useThemeDraft() {
  const [draft, setDraft] = React.useState(read)
  const { theme, unlinked, type } = draft

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(draft))
  }, [draft])

  /** A row differs from Nova when its value isn't the default. */
  const overridden = React.useCallback(
    (mode: Mode, token: string) => changed(mode, token, theme[mode][token]),
    [theme]
  )

  /** The row this one copies, until the user takes it over. */
  const following = React.useCallback(
    (mode: Mode, token: string) =>
      follows[token] && !unlinked[mode].includes(token) ? follows[token] : null,
    [unlinked]
  )

  const setColor = React.useCallback(
    (mode: Mode, token: string, value: Color) => {
      // The picker can write hex, rgb or hsl; Glaze stores OKLCH, so
      // convert once here and the whole draft stays in one notation.
      const color = canonical(value)
      setDraft((current) => {
        // Taking over a following row breaks its link, unless the value it
        // lands on is the one it would have followed anyway.
        const parent = follows[token]
        const staysLinked =
          parent !== undefined &&
          sameColor(color, followed(token, current.theme[mode][parent]))
        const nextUnlinked = staysLinked
          ? without(current.unlinked[mode], token)
          : parent && !current.unlinked[mode].includes(token)
            ? [...current.unlinked[mode], token]
            : current.unlinked[mode]
        return {
          ...current,
          theme: {
            ...current.theme,
            [mode]: settle(
              mode,
              { ...current.theme[mode], [token]: color },
              nextUnlinked
            ),
          },
          unlinked: { ...current.unlinked, [mode]: nextUnlinked },
        }
      })
    },
    []
  )

  /** Back to Nova, and back under the rule if the row has a source. */
  const resetColor = React.useCallback((mode: Mode, token: string) => {
    setDraft((current) => {
      const nextUnlinked = without(current.unlinked[mode], token)
      return {
        ...current,
        theme: {
          ...current.theme,
          [mode]: settle(
            mode,
            { ...current.theme[mode], [token]: defaults[mode][token] },
            nextUnlinked
          ),
        },
        unlinked: { ...current.unlinked, [mode]: nextUnlinked },
      }
    })
  }, [])

  const resetGroup = React.useCallback((mode: Mode, groupTokens: string[]) => {
    setDraft((current) => {
      const nextUnlinked = current.unlinked[mode].filter(
        (token) => !groupTokens.includes(token)
      )
      return {
        ...current,
        theme: {
          ...current.theme,
          [mode]: settle(
            mode,
            {
              ...current.theme[mode],
              ...Object.fromEntries(
                groupTokens.map((token) => [token, defaults[mode][token]])
              ),
            },
            nextUnlinked
          ),
        },
        unlinked: { ...current.unlinked, [mode]: nextUnlinked },
      }
    })
  }, [])

  const setType = React.useCallback((token: string, value: string) => {
    setDraft((current) => ({
      ...current,
      type: { ...current.type, [token]: value },
    }))
  }, [])

  const resetType = React.useCallback((tokens: string[]) => {
    setDraft((current) => ({
      ...current,
      type: {
        ...current.type,
        ...Object.fromEntries(tokens.map((t) => [t, typeDefaults[t]])),
      },
    }))
  }, [])

  /** Back to Nova everywhere: both modes, type, and every rule re-linked. */
  const resetAll = React.useCallback(() => {
    setDraft({ theme: defaults, unlinked: noLinks, type: typeDefaults })
  }, [])

  /** Number of edits, across both modes and type: the top bar's counter. */
  const changes = React.useMemo(
    () => countChanges(theme) + countTypeChanges(type),
    [theme, type]
  )

  return {
    theme,
    type,
    setType,
    resetType,
    overridden,
    following,
    setColor,
    resetColor,
    resetGroup,
    resetAll,
    changes,
  }
}

export type Draft = ReturnType<typeof useThemeDraft>
