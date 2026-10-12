import * as React from "react";
// Wrap bare text children in a span trimmed to cap height and baseline, so
// flex centring centres the letters rather than the line box. text-box-trim
// does not reach the anonymous text box of a flex container, hence the span.
export function trimText(children) {
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number"
        ? React.createElement("span", { "data-slot": "label", className: "[text-box:trim-both_cap_alphabetic]" }, child)
        : child);
}
// Like trimText, but for labels whose weight changes with state (a selected
// tab). A heavier weight is wider, so the label would push its neighbours
// when it changes. An invisible copy at the heavier weight shares the grid
// cell and reserves that width up front; the visible copy changes weight in
// place. Pass the class that sets the heavier weight.
export function reserveWeight(children, heavyClassName) {
    const trim = "col-start-1 row-start-1 [text-box:trim-both_cap_alphabetic]";
    return React.Children.map(children, (child) => typeof child === "string" || typeof child === "number"
        ? React.createElement("span", { className: "inline-grid" }, React.createElement("span", {
            "aria-hidden": true,
            className: `invisible ${heavyClassName} ${trim}`,
        }, child), React.createElement("span", { "data-slot": "label", className: trim }, child))
        : child);
}
