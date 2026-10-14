import * as React from "react"

import { DownloadIcon, RotateCcwIcon, XIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amit-kap/glaze/components/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amit-kap/glaze/components/tabs"

import {
  ColorsTab,
  InstallFields,
  OtherTab,
  TypographyTab,
  type ThemeEditor,
} from "./sections"
import { toHex } from "./fields"
import {
  inkFor,
  pxToRem,
  toPx,
  type Custom,
  type Defaults,
} from "../theme-builder"

// Panel width lives in the --panel-w custom property on <html>: the drag
// handle writes it, and the sidebar, settings bar and main view all read it,
// so resizing never re-renders React. data-panel-dragging on <html> marks a
// drag in progress so the open/close transitions don't lag behind the cursor.
const PANEL_MIN = 320
const panelMax = () => window.innerWidth / 2
const panelClamp = (w: number) => Math.min(Math.max(w, PANEL_MIN), panelMax())

// The Customize panel: a slide-in sidebar that edits the theme in tabbed,
// collapsible sections, resizable by dragging its inline-start edge.
// `custom` holds only what the user changed; everything else reads through
// to `defaults`, the base theme's own values.
export function CustomizeSidebar({
  open,
  onOpenChange,
  mode,
  custom,
  setCustom,
  defaults,
  customized,
  error,
  css,
  command,
  copied,
  onCopy,
  onReset,
  configJson,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The mode being shown and edited: already resolved, never "system". */
  mode: "light" | "dark"
  custom: Custom
  setCustom: (update: (c: Custom) => Custom) => void
  defaults: Defaults
  customized: boolean
  error: string | null
  css: string | null
  command: string
  copied: boolean
  onCopy: () => void
  onReset: () => void
  configJson: string
}) {
  const shared = (key: string) => custom.shared[key] ?? defaults.shared[key]
  const color = (m: "light" | "dark", key: string) =>
    custom[m][key] ?? defaults[m][key]

  // An override equal to the theme's own is no change, so it's dropped.
  const setShared = (key: string, value: string, unchanged: boolean) =>
    setCustom((c) => {
      const next = { ...c.shared, [key]: value }
      if (unchanged) delete next[key]
      return { ...c, shared: next }
    })
  const setPx = (key: string, px: number) =>
    setShared(
      key,
      pxToRem(px),
      Math.abs(toPx(defaults.shared[key]) - px) < 0.01
    )
  const setNum = (
    key: string,
    n: number,
    parse: (v: string) => number,
    unit = ""
  ) =>
    setShared(
      key,
      `${n}${unit}`,
      Math.abs(parse(defaults.shared[key]) - n) < 0.001
    )

  const setColor = (m: "light" | "dark", key: string, hex: string) =>
    setCustom((c) => {
      const next = { ...c[m], [key]: hex }
      if (toHex(defaults[m][key]) === hex) delete next[key]
      const out = { ...c, [m]: next }
      // Ink on the brand colour follows it until edited by hand.
      if (key === "brand" && c.inkAuto !== false)
        out[m] = { ...next, "brand-ink": inkFor(hex.slice(0, 7)) }
      if (key === "brand-ink") out.inkAuto = false
      return out
    })

  const radius = toPx(shared("radius"))
  const pill = (custom.controls ?? defaults.controls) === "pill"

  const editor: ThemeEditor = {
    custom,
    defaults,
    mode,
    color,
    shared,
    setCustom,
    setPx,
    setNum,
    setColor,
    radius,
    pill,
  }

  // Drag to resize: track the pointer (captured to the handle, so drags that
  // leave it keep working) and write the clamped width to --panel-w.
  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const handle = e.currentTarget
    const rtl =
      getComputedStyle(document.documentElement).direction === "rtl"
    const move = (ev: PointerEvent) => {
      const w = rtl ? ev.clientX : window.innerWidth - ev.clientX
      document.documentElement.style.setProperty(
        "--panel-w",
        `${Math.round(panelClamp(w))}px`
      )
    }
    const stop = () => {
      document.documentElement.removeAttribute("data-panel-dragging")
      handle.removeEventListener("pointermove", move)
    }
    handle.setPointerCapture(e.pointerId)
    document.documentElement.setAttribute("data-panel-dragging", "")
    handle.addEventListener("pointermove", move)
    handle.addEventListener("pointerup", stop, { once: true })
    handle.addEventListener("pointercancel", stop, { once: true })
    move(e.nativeEvent)
  }

  // A shrunken viewport can push the stored width past the max; re-clamp.
  React.useEffect(() => {
    const clamp = () => {
      const root = document.documentElement
      const w = parseFloat(root.style.getPropertyValue("--panel-w"))
      if (w > panelMax())
        root.style.setProperty("--panel-w", `${Math.round(panelMax())}px`)
    }
    window.addEventListener("resize", clamp)
    return () => window.removeEventListener("resize", clamp)
  }, [])

  return (
    <aside
      id="customize-sidebar"
      aria-label="Customize"
      inert={!open}
      data-open={open || undefined}
      className="invisible fixed inset-y-0 inset-e-0 z-50 flex w-full translate-x-full flex-col gap-5 overflow-y-auto border-s border-border bg-background px-4 pt-4 pb-6 transition-[translate,visibility] duration-(--duration-moderate) ease-standard motion-reduce:transition-none sm:w-[var(--panel-w,420px)] data-open:visible data-open:translate-x-0"
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panel"
        onPointerDown={startResize}
        className="absolute inset-y-0 start-0 w-2 cursor-ew-resize touch-none max-sm:hidden"
      />
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-title font-medium">Customize</h2>
        <div className="flex items-center gap-1">
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Install theme"
                  title="Install theme"
                />
              }
            >
              <DownloadIcon />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Theme setup</DialogTitle>
                <DialogDescription>
                  Install this theme with the Glaze CLI, or copy the variables
                  into your project.
                </DialogDescription>
              </DialogHeader>
              <InstallFields
                editor={editor}
                error={error}
                css={css}
                command={command}
                copied={copied}
                onCopy={onCopy}
                configJson={configJson}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Reset to theme defaults"
            title="Reset to theme defaults"
            disabled={!customized}
            onClick={onReset}
          >
            <RotateCcwIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close customize"
            onClick={() => onOpenChange(false)}
          >
            <XIcon />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Tabs defaultValue="colors" className="gap-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="colors">
            <ColorsTab editor={editor} />
          </TabsContent>
          <TabsContent value="typography">
            <TypographyTab editor={editor} />
          </TabsContent>
          <TabsContent value="other">
            <OtherTab editor={editor} />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  )
}
