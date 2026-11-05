/**
 * Glaze settings catalog.
 *
 * One list of everything a theme can edit, what it changes and where the
 * default comes from. Studio, Storybook and `npm run check:catalog` read
 * this file; nothing keeps a second copy of these names or notes.
 */
export type SettingKind = "color" | "font" | "text" | "weight" | "number" | "length" | "height" | "radius" | "shadow" | "duration" | "easing";
/** Where a value comes from. */
export type SettingSource = "input" | "derived" | "setting" | "fixed";
export type Setting = {
    /** CSS custom property the component reads. */
    token: `--${string}`;
    label: string;
    note: string;
    kind: SettingKind;
    /** Group id in `settingGroups`. */
    group: string | null;
    source: SettingSource;
    /** Settings this value is calculated from, for derived values. */
    follows?: string[];
    /** Default when the theme does not set the value. */
    fallback?: string;
};
export type SettingGroup = {
    id: string;
    section: string;
    title: string;
    note: string;
    collapsed?: boolean;
};
export type SettingSection = {
    id: string;
    title: string;
    note: string;
};
export declare const settingSections: SettingSection[];
export declare const settingGroups: SettingGroup[];
export declare const settings: Setting[];
/** Settings calculated from `token`. */
export declare function dependentsOf(token: string): Setting[];
/** Settings a theme sets, in catalog order. */
export declare const editableSettings: Setting[];
