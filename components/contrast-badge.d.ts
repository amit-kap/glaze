/** The WCAG level a ratio reaches, as the label the badge shows. */
declare function contrastLevel(ratio: number): "AAA" | "AA" | "AA Large" | "Fail";
/**
 * How readable one colour is on another, as AA / AAA / Fail. Hovering shows
 * the ratio. Sits on the colour that does the reading — text on a fill, an
 * icon on a surface — so the pair is never ambiguous. Alpha is ignored;
 * contrast is judged on the colour itself.
 */
declare function ContrastBadge({ foreground, background, className, }: {
    /** The colour being read: text, icon or line. */
    foreground: string;
    /** The colour behind it. */
    background: string;
    className?: string;
}): import("react").JSX.Element | null;
export { ContrastBadge, contrastLevel };
