import type { CnFunction } from "cn"
import { createCn } from "cn/config"

// Teach class merging the Glaze system utilities, so `text-body` is read as a
// font size (not a colour) and `rounded-control` conflicts with other radii.
export const cn: CnFunction = createCn({
  extend: {
    theme: {
      text: ["caption", "body", "title", "heading", "display"],
      radius: ["item-sm", "item", "control", "floating", "container", "pill"],
      shadow: ["raised", "floating", "modal"],
      ease: ["standard", "emphasized", "exit", "enter"],
      spacing: ["control-xs", "control-sm", "control-md", "control-lg"],
      "font-weight": ["strong"],
    },
  },
})
