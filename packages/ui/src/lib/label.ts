import * as React from "react"

// Wrap bare text children in a span trimmed to cap height and baseline, so
// flex centring centres the letters rather than the line box. text-box-trim
// does not reach the anonymous text box of a flex container, hence the span.
export function trimText(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number"
      ? React.createElement(
          "span",
          { "data-slot": "label", className: "[text-box:trim-both_cap_alphabetic]" },
          child
        )
      : child
  )
}
