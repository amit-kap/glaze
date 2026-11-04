import * as React from "react"

import {
  dialDefaults,
  dialTokens,
  dialMotionTokens,
  generatedFor,
  motionFor,
  scaleShapeTokens,
  scaleShapeValue,
  scaleTypeTokens,
  scaleTypeValue,
  toneTypeTokens,
  toneTypeValue,
  type Dials,
} from "./dials"
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
  sameMotion,
  motionTokens,
  type MotionValues,
} from "./motion"
import {
  countShapeChanges,
  sameShape,
  shapeDefaults,
  shapeTokens,
  type ShapeValues,
} from "./shape"
import {
  countTypeChanges,
  sameType,
  toCss as typeCss,
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

export type Stored = {
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

const fresh = (): Stored => ({
  theme: defaults,
  unlinked: noLinks,
  type: typeDefaults,
  shape: shapeDefaults,
  motion: motionDefaults,
  dials: dialDefaults,
})

/** A stored draft as the panel can use it: only tokens it still offers. */
function sanitize(stored: Partial<Stored> | null | undefined): Stored {
  if (!stored?.theme) return fresh()
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
      tone: stored.dials?.tone ?? 0,
      scale: stored.dials?.scale ?? 0,
      motion: stored.dials?.motion ?? "none",
    },
  }
}

function read(): Stored {
  try {
    return sanitize(JSON.parse(localStorage.getItem(storageKey) ?? "null"))
  } catch {
    return fresh()
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
  // A dial fills in only the colours the user has not taken over.
  for (const token of dialTokens) {
    if (unlinked.includes(token)) continue
    const made = generatedFor(mode, token, dials, colors.brand)
    if (made) colors[token] = made
  }

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

/** Colours for both modes after a dial moves: untouched ones follow it. */
const redial = (current: Stored, dials: Dials) => {
  const colors = (mode: Mode) => {
    const unlinked = current.unlinked[mode]
    const base = { ...current.theme[mode] }
    // A colour no dial reaches any more goes back to Nova.
    for (const token of dialTokens)
      if (
        !unlinked.includes(token) &&
        !generatedFor(mode, token, dials, base.brand)
      )
        base[token] = defaults[mode][token]
    return settle(base, unlinked, mode, dials)
  }
  return { light: colors("light"), dark: colors("dark") }
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
        // A colour a dial generates is taken over the same way, unless the
        // value lands on the one the dial would have made.
        const generated = generatedFor(
          mode,
          token,
          current.dials,
          current.theme[mode].brand
        )
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
      const dials = { ...current.dials, neutrals }
      return { ...current, dials, theme: redial(current, dials) }
    })
  }, [])

  /**
   * Move the quiet-to-bold slider. Colours follow like the neutrals do. Type
   * follows too, except a value the user set by hand: it is theirs when it
   * isn't what the slider last made.
   */
  const setTone = React.useCallback((tone: number) => {
    setDraft((current) => {
      const dials = { ...current.dials, tone }
      const made = (token: string, at: number) =>
        at === 0
          ? typeDefaults[token]
          : typeCss(token, toneTypeValue(token, at))
      const nextType = { ...current.type }
      for (const token of toneTypeTokens)
        if (
          sameType(token, current.type[token], made(token, current.dials.tone))
        )
          nextType[token] = made(token, tone)
      return {
        ...current,
        dials,
        type: nextType,
        theme: redial(current, dials),
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

  /**
   * Move the comfortable-to-compact slider. Spacing, radius and text size
   * follow it, except a value the user set by hand: it is theirs when it
   * isn't what the slider last made.
   */
  const setScale = React.useCallback((scale: number) => {
    setDraft((current) => {
      const before = current.dials.scale
      const nextShape = { ...current.shape }
      for (const token of scaleShapeTokens)
        if (
          sameShape(token, current.shape[token], scaleShapeValue(token, before))
        )
          nextShape[token] = scaleShapeValue(token, scale)
      const nextType = { ...current.type }
      for (const token of scaleTypeTokens)
        if (sameType(token, current.type[token], scaleTypeValue(token, before)))
          nextType[token] = scaleTypeValue(token, scale)
      return {
        ...current,
        dials: { ...current.dials, scale },
        shape: nextShape,
        type: nextType,
      }
    })
  }, [])

  /** Pick how much character the motion has; hand-set values are kept. */
  const setMotionDial = React.useCallback((motionDial: Dials["motion"]) => {
    setDraft((current) => {
      const nextMotion = { ...current.motion }
      for (const token of dialMotionTokens)
        if (
          sameMotion(
            token,
            current.motion[token],
            motionFor(token, current.dials.motion)
          )
        )
          nextMotion[token] = motionFor(token, motionDial)
      return {
        ...current,
        dials: { ...current.dials, motion: motionDial },
        motion: nextMotion,
      }
    })
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
    setTone,
    setScale,
    setMotionDial,
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
