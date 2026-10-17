import * as React from "react"
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { Field, FieldError, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@amit-kap/glaze/components/input-group"

import type { ThemeEditor } from "../editor"
import { download } from "../../theme-builder"

// The fields inside the Install theme dialog: name, download, setup command.
export function InstallFields({
  editor,
  error,
  css,
  command,
  copied,
  onCopy,
  configJson,
}: {
  editor: ThemeEditor
  error: string | null
  css: string | null
  command: string
  copied: boolean
  onCopy: () => void
  configJson: string
}) {
  const { custom } = editor
  const invalid = error !== null
  return (
    <>
      <Field data-invalid={invalid || undefined}>
        <FieldLabel htmlFor="panel-name">Theme name</FieldLabel>
        <Input
          id="panel-name"
          value={custom.name}
          onChange={(e) =>
            editor.setCustom((c) => ({ ...c, name: e.target.value }))
          }
          aria-invalid={invalid || undefined}
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
      <Button
        variant="outline"
        className="w-full"
        disabled={!css}
        onClick={() => {
          if (!css) return
          download(`${custom.name}.css`, css, "text/css")
          download("glaze.config.json", configJson, "application/json")
        }}
      >
        <DownloadIcon />
        Download theme files
      </Button>
      {/* Text rather than an input, so a long command wraps instead of
          scrolling out of view. Each flag stays on one line with its value;
          browsers would otherwise break after the "--". */}
      <InputGroup className="h-auto items-start py-1">
        <code
          aria-label="Setup command"
          className="min-w-0 flex-1 px-3 py-1 break-words select-all"
        >
          {command.split(/ (?=--)/).map((part, i) => (
            <React.Fragment key={part}>
              {i > 0 && " "}
              <span className="whitespace-nowrap">{part}</span>
            </React.Fragment>
          ))}
        </code>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Copy setup command"
            onClick={onCopy}
          >
            <span className="icon-swap" data-swapped={copied || undefined}>
              <CopyIcon />
              <CheckIcon />
            </span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </>
  )
}
