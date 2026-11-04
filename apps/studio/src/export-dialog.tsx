import * as React from "react"
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@amit-kap/glaze/components/dialog"

import type { Stored } from "./draft"
import { slug, themeConfig, themeCss } from "./export"
import { download, themeFile } from "./theme-file"

export function ExportDialog({
  open,
  onOpenChange,
  name,
  stored,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  stored: Stored
}) {
  const [copied, setCopied] = React.useState(false)
  const css = React.useMemo(() => themeCss(stored, name), [stored, name])
  const file = slug(name)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* Clipboard needs a secure context; the downloads still work. */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Export {name || "Untitled theme"}</DialogTitle>
          <DialogDescription>
            CSS goes on top of Nova. The config regenerates it with the Glaze
            CLI. The theme file reopens in Studio.
          </DialogDescription>
        </DialogHeader>

        <pre
          tabIndex={0}
          className="max-h-64 overflow-auto rounded-control border bg-muted p-3 font-mono text-caption"
        >
          {css}
        </pre>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={copy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy CSS"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => download(`${file}.css`, css, "text/css")}
          >
            <DownloadIcon />
            CSS
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              download(
                "glaze.config.json",
                JSON.stringify(themeConfig(stored, name), null, 2) + "\n",
                "application/json"
              )
            }
          >
            <DownloadIcon />
            Config
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              download(
                `${file}.glaze.json`,
                JSON.stringify(themeFile(name, stored), null, 2) + "\n",
                "application/json"
              )
            }
          >
            <DownloadIcon />
            Theme file
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
