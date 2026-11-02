import * as React from "react"

import { dialDefaults, neutralFor, neutralTokens, type Dials } from "./dials"
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
  countMotionChanges,
  motionDefaults,
  motionTokens,
  type MotionValues,
} from "./motion"
import {
  countShapeChanges,
  shapeDefaults,
  shapeTokens,
  type ShapeValues,
} from "./shape"
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

type Stored = {
  theme: Theme
  unlinked: Unlinked
  type: TypeValues
  shape: ShapeValues
  motion: MotionValues
  dials: Dials
}

const onlyTypeTokens = (values: TypeValues | undefined): TypeValues =>
  Object.fromEntries(
    typeTokens.map((token) => [token, values?.[token] ?? typeDefaults[token]])
  )

const onlyMotionTokens = (values: MotionValues | undefined): MotionValues =>
  Object.fromEntries(
    motionTokens.map((token) => [
      token,
      values?.[token] ?? motionDefaults[token],
    ])
  )

const onlyShapeTokens = (values: ShapeValues | undefined): ShapeValues =>
  Object.fromEntries(
    shapeTokens.map((token) => [token, values?.[token] ?? shapeDefaults[token]])
  )

function read(): Stored {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null") as {
      theme?: { light?: Record<string, Color>; dark?: Record<string, Color> }
      unlinked?: Unlinked
      type?: TypeValues
      shape?: ShapeValues
      motion?: MotionValues
      dials?: Dials
    } | null
    if (!stored?.theme)
      return {
        theme: defaults,
        unlinked: noLinks,
        type: typeDefaults,
        shape: shapeDefaults,
        motion: motionDefaults,
        dials: dialDefaults,
      }
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
      shape: onlyShapeTokens(stored.shape),
      motion: onlyMotionTokens(stored.motion),
      dials: {
        neutrals: stored.dials?.neutrals ?? dialDefaults.neutrals,
      },
    }
  } catch {
    return {
      theme: defaults,
      unlinked: noLinks,
      type: typeDefaults,
      shape: shapeDefaults,
      motion: motionDefaults,
      dials: dialDefaults,
    }
  }
}

/** The value a following row takes from its source: ink gets the readable end. */
function followed(child: string, source: Color): Color {
  return child === "brand-ink" ? autoInk(source) : source
}

/** Apply the follow rules to one mode's colours, a pass per level of the chain. */
function settle(
  colors: Record<string, Color>,
  unlinked: string[],
  mode: Mode,
  dials: Dials
) {
  // A dial fills in only the neutrals the user has not taken over.
  if (dials.neutrals.strength > 0)
    for (const token of neutralTokens)
      if (!unlinked.includes(token))
        colors[token] = neutralFor(mode, token, dials.neutrals)

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
  const { theme, unlinked, type, shape, motion, dials } = draft

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
        // A neutral the dial generates is taken over the same way, unless the
        // value lands on the one the dial would have made.
        const generated =
          neutralTokens.includes(token) && current.dials.neutrals.strength > 0
            ? neutralFor(mode, token, current.dials.neutrals)
            : null
        const nextUnlinked =
          staysLinked || (generated && sameColor(color, generated))
            ? without(current.unlinked[mode], token)
            : (parent || generated) && !current.unlinked[mode].includes(token)
              ? [...current.unlinked[mode], token]
              : current.unlinked[mode]
        return {
          ...current,
          theme: {
            ...current.theme,
            [mode]: settle(
              { ...current.theme[mode], [token]: color },
              nextUnlinked,
              mode,
              current.dials
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
            { ...current.theme[mode], [token]: defaults[mode][token] },
            nextUnlinked,
            mode,
            current.dials
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
            {
              ...current.theme[mode],
              ...Object.fromEntries(
                groupTokens.map((token) => [token, defaults[mode][token]])
              ),
            },
            nextUnlinked,
            mode,
            current.dials
          ),
        },
        unlinked: { ...current.unlinked, [mode]: nextUnlinked },
      }
    })
  }, [])

  /** Move a dial: every neutral not taken over follows it, in both modes. */
  const setNeutrals = React.useCallback((neutrals: Dials["neutrals"]) => {
    setDraft((current) => {
      const next = { ...current, dials: { ...current.dials, neutrals } }
      const colors = (mode: Mode) => {
        const unlinked = current.unlinked[mode]
        const base = { ...current.theme[mode] }
        // At strength 0 the dial hands its tokens back to Nova.
        if (neutrals.strength <= 0)
          for (const token of neutralTokens)
            if (!unlinked.includes(token)) base[token] = defaults[mode][token]
        return settle(base, unlinked, mode, next.dials)
      }
      return {
        ...next,
        theme: { light: colors("light"), dark: colors("dark") },
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

  const setShape = React.useCallback((token: string, value: string) => {
    setDraft((current) => ({
      ...current,
      shape: { ...current.shape, [token]: value },
    }))
  }, [])

  const resetShape = React.useCallback((tokens: string[]) => {
    setDraft((current) => ({
      ...current,
      shape: {
        ...current.shape,
        ...Object.fromEntries(tokens.map((t) => [t, shapeDefaults[t]])),
      },
    }))
  }, [])

  const setMotion = React.useCallback((token: string, value: string) => {
    setDraft((current) => ({
      ...current,
      motion: { ...current.motion, [token]: value },
    }))
  }, [])

  const resetMotion = React.useCallback((tokens: string[]) => {
    setDraft((current) => ({
      ...current,
      motion: {
        ...current.motion,
        ...Object.fromEntries(tokens.map((t) => [t, motionDefaults[t]])),
      },
    }))
  }, [])

  /** Back to Nova everywhere: both modes, type, shape, motion, every rule. */
  const resetAll = React.useCallback(() => {
    setDraft({
      theme: defaults,
      unlinked: noLinks,
      type: typeDefaults,
      shape: shapeDefaults,
      motion: motionDefaults,
      dials: dialDefaults,
    })
  }, [])

  /** Number of edits, across modes, type, shape and motion: the counter. */
  const changes = React.useMemo(
    () =>
      countChanges(theme) +
      countTypeChanges(type) +
      countShapeChanges(shape) +
      countMotionChanges(motion),
    [theme, type, shape, motion]
  )

  return {
    theme,
    dials,
    setNeutrals,
    unlinked,
    type,
    setType,
    resetType,
    shape,
    setShape,
    resetShape,
    motion,
    setMotion,
    resetMotion,
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
