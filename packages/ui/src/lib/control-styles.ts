// One recipe per control state, so every field and choice control hovers,
// focuses, fails validation and disables the same way. Plain class strings,
// not a Tailwind utility: `cn` can still merge a consumer's override, and a
// state selector inside a utility would outrank it.
//
// Hover, focus and invalid colours come from tokens.css (--control-*).
// Disabled controls fade once, on the control itself (`opacity-disabled`);
// the base layer already gives them the default cursor.

/** Bordered text fields: input, textarea, select trigger, native select, OTP slot. */
export const fieldState =
  "hover:not-disabled:not-aria-invalid:border-(--control-hover-border) focus-visible:border-ring aria-invalid:border-(--control-invalid-border) aria-invalid:ring-3 aria-invalid:ring-(--control-invalid-ring) user-invalid:border-(--control-invalid-border) user-invalid:ring-3 user-invalid:ring-(--control-invalid-ring) disabled:pointer-events-none disabled:opacity-disabled"

/** The same states for a wrapper around a field (input group, combobox). */
export const fieldWithinState =
  "hover:not-has-disabled:not-has-aria-invalid:border-(--control-hover-border) focus-within:border-ring has-aria-invalid:border-(--control-invalid-border) has-aria-invalid:ring-3 has-aria-invalid:ring-(--control-invalid-ring) has-disabled:pointer-events-none has-disabled:opacity-disabled"

/** Checkbox, radio, switch, icon switch: focus, invalid and disabled. */
export const choiceState =
  "focus-visible:border-ring aria-invalid:border-(--control-invalid-border) aria-invalid:ring-3 aria-invalid:ring-(--control-invalid-ring) data-disabled:pointer-events-none data-disabled:opacity-disabled"

/** Checkbox and radio, whose unchecked border is visible: add the hover border. */
export const choiceHover =
  "hover:not-data-checked:not-data-disabled:not-aria-invalid:border-(--control-hover-border)"

/** Text entry: body size, and 16px on touch so iOS does not zoom on focus. */
export const textControl =
  "text-body pointer-coarse:text-[length:max(1rem,var(--type-body))]"
