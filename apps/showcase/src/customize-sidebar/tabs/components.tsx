import { Badge } from "@amit-kap/glaze/components/badge"

import type { ThemeEditor } from "../editor"
import { Section } from "../fields"
import { PresetSelect, sameCss, type Preset } from "./preset-select"
import { shadowPresets } from "../../theme-builder"

// Tier-3 component tokens. Each row's first item is the token's own
// formula from tokens.css: shown when nothing is overridden, and picking
// it deletes the override so the token derives again. Values a theme set
// by hand that match no item show as a disabled "Custom".
const setComponent = (
  editor: ThemeEditor,
  token: string,
  css: string,
  fallback: string
) =>
  editor.setCustom((c) => {
    const next = { ...c.components }
    if (sameCss(css, fallback)) delete next[token]
    else next[token] = css
    return { ...c, components: Object.keys(next).length ? next : undefined }
  })

function ComponentRow({
  editor,
  token,
  label,
  presets,
}: {
  editor: ThemeEditor
  token: string
  label: string
  /** The first preset's css is the token's default formula. */
  presets: Preset[]
}) {
  const fallback = presets[0].css
  const override = editor.custom.components?.[token]
  return (
    <PresetSelect
      id={`panel-${token}`}
      label={label}
      presets={presets}
      value={override ?? fallback}
      onChange={(css) => setComponent(editor, token, css, fallback)}
    >
      {override !== undefined && (
        <Badge variant="secondary" className="shrink-0">
          Custom
        </Badge>
      )}
    </PresetSelect>
  )
}

const radiusPresets = (fallback: string, label = "Item radius") => [
  { value: "default", label, css: fallback },
  { value: "pill", label: "Pill", css: "9999px" },
  { value: "square", label: "Square", css: "0px" },
]

function Hint({ children }: { children: string }) {
  return <p className="text-caption text-muted-foreground">{children}</p>
}

export function ComponentsTab({ editor }: { editor: ThemeEditor }) {
  return (
    <>
      <Section title="Inputs" defaultOpen>
        <Hint>Background of text inputs, selects and textareas.</Hint>
        <ComponentRow
          editor={editor}
          token="input-fill"
          label="Fill"
          presets={[
            { value: "default", label: "Transparent", css: "transparent" },
            {
              value: "filled",
              label: "Filled",
              css: "color-mix(in oklab, var(--input) 30%, transparent)",
            },
            { value: "muted", label: "Muted", css: "var(--muted)" },
          ]}
        />
      </Section>
      <Section title="Buttons" defaultOpen>
        <Hint>Corners of the xs and sm button sizes.</Hint>
        <ComponentRow
          editor={editor}
          token="button-radius-xs"
          label="Extra small"
          presets={radiusPresets("min(var(--shape-item), 10px)")}
        />
        <ComponentRow
          editor={editor}
          token="button-radius-sm"
          label="Small"
          presets={radiusPresets("min(var(--shape-item), 12px)")}
        />
      </Section>
      <Section title="Cards" defaultOpen>
        <Hint>Shadow under cards; none by default, so they sit flat.</Hint>
        <ComponentRow
          editor={editor}
          token="card-shadow"
          label="Shadow"
          presets={shadowPresets}
        />
      </Section>
      <Section title="Checkbox" defaultOpen>
        <Hint>Corners of checkboxes; half the item radius by default.</Hint>
        <ComponentRow
          editor={editor}
          token="checkbox-radius"
          label="Radius"
          presets={[
            {
              value: "default",
              label: "Item radius",
              css: "calc(var(--shape-item) * 0.5)",
            },
            { value: "round", label: "Round", css: "9999px" },
            { value: "square", label: "Square", css: "0px" },
            { value: "soft", label: "Soft", css: "6px" },
          ]}
        />
      </Section>
      <Section title="Textarea" defaultOpen>
        <Hint>
          Corners of textareas; the control radius, capped by container.
        </Hint>
        <ComponentRow
          editor={editor}
          token="textarea-radius"
          label="Radius"
          presets={radiusPresets(
            "min(var(--shape-control), var(--shape-container))",
            "Control radius"
          )}
        />
      </Section>
      <Section title="Toast" defaultOpen>
        <Hint>Corners of toasts; 1.8× the radius by default.</Hint>
        <ComponentRow
          editor={editor}
          token="toast-radius"
          label="Radius"
          presets={[
            {
              value: "default",
              label: "Follow radius",
              css: "calc(var(--radius) * 1.8)",
            },
            { value: "pill", label: "Pill", css: "9999px" },
            { value: "square", label: "Square", css: "0px" },
            {
              value: "container",
              label: "Match container",
              css: "var(--shape-container)",
            },
          ]}
        />
      </Section>
    </>
  )
}
