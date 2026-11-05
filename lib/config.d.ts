import { z } from "zod";
/** Nova is the only built-in theme; everything else is a saved theme. */
export declare const builtInThemes: readonly ["nova"];
/**
 * Glaze release this config format and its generated CSS are written against.
 * Keep in step with `packages/ui/package.json`; `npm run check:catalog` does.
 */
export declare const glazeBaseline = "0.4.0";
export declare const glazeConfigSchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    version: z.ZodLiteral<1>;
    name: z.ZodString;
    extends: z.ZodDefault<z.ZodEnum<{
        nova: "nova";
    }>>;
    defaults: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<{
            light: "light";
            dark: "dark";
            system: "system";
        }>>;
        density: z.ZodOptional<z.ZodEnum<{
            comfortable: "comfortable";
            compact: "compact";
        }>>;
    }, z.core.$strict>>;
    fonts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    color: z.ZodOptional<z.ZodObject<{
        light: z.ZodOptional<z.ZodObject<{
            background: z.ZodOptional<z.ZodString>;
            foreground: z.ZodOptional<z.ZodString>;
            card: z.ZodOptional<z.ZodString>;
            "card-foreground": z.ZodOptional<z.ZodString>;
            popover: z.ZodOptional<z.ZodString>;
            "popover-foreground": z.ZodOptional<z.ZodString>;
            primary: z.ZodOptional<z.ZodString>;
            "primary-foreground": z.ZodOptional<z.ZodString>;
            secondary: z.ZodOptional<z.ZodString>;
            "secondary-foreground": z.ZodOptional<z.ZodString>;
            muted: z.ZodOptional<z.ZodString>;
            "muted-foreground": z.ZodOptional<z.ZodString>;
            accent: z.ZodOptional<z.ZodString>;
            "accent-foreground": z.ZodOptional<z.ZodString>;
            destructive: z.ZodOptional<z.ZodString>;
            border: z.ZodOptional<z.ZodString>;
            input: z.ZodOptional<z.ZodString>;
            ring: z.ZodOptional<z.ZodString>;
            "chart-1": z.ZodOptional<z.ZodString>;
            "chart-2": z.ZodOptional<z.ZodString>;
            "chart-3": z.ZodOptional<z.ZodString>;
            "chart-4": z.ZodOptional<z.ZodString>;
            "chart-5": z.ZodOptional<z.ZodString>;
            sidebar: z.ZodOptional<z.ZodString>;
            "sidebar-foreground": z.ZodOptional<z.ZodString>;
            "sidebar-primary": z.ZodOptional<z.ZodString>;
            "sidebar-primary-foreground": z.ZodOptional<z.ZodString>;
            "sidebar-accent": z.ZodOptional<z.ZodString>;
            "sidebar-accent-foreground": z.ZodOptional<z.ZodString>;
            "sidebar-border": z.ZodOptional<z.ZodString>;
            "sidebar-ring": z.ZodOptional<z.ZodString>;
            brand: z.ZodOptional<z.ZodString>;
            "brand-ink": z.ZodOptional<z.ZodString>;
            overlay: z.ZodOptional<z.ZodString>;
            "severity-critical": z.ZodOptional<z.ZodString>;
            "severity-high": z.ZodOptional<z.ZodString>;
            "severity-medium": z.ZodOptional<z.ZodString>;
            "severity-low": z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        dark: z.ZodOptional<z.ZodObject<{
            background: z.ZodOptional<z.ZodString>;
            foreground: z.ZodOptional<z.ZodString>;
            card: z.ZodOptional<z.ZodString>;
            "card-foreground": z.ZodOptional<z.ZodString>;
            popover: z.ZodOptional<z.ZodString>;
            "popover-foreground": z.ZodOptional<z.ZodString>;
            primary: z.ZodOptional<z.ZodString>;
            "primary-foreground": z.ZodOptional<z.ZodString>;
            secondary: z.ZodOptional<z.ZodString>;
            "secondary-foreground": z.ZodOptional<z.ZodString>;
            muted: z.ZodOptional<z.ZodString>;
            "muted-foreground": z.ZodOptional<z.ZodString>;
            accent: z.ZodOptional<z.ZodString>;
            "accent-foreground": z.ZodOptional<z.ZodString>;
            destructive: z.ZodOptional<z.ZodString>;
            border: z.ZodOptional<z.ZodString>;
            input: z.ZodOptional<z.ZodString>;
            ring: z.ZodOptional<z.ZodString>;
            "chart-1": z.ZodOptional<z.ZodString>;
            "chart-2": z.ZodOptional<z.ZodString>;
            "chart-3": z.ZodOptional<z.ZodString>;
            "chart-4": z.ZodOptional<z.ZodString>;
            "chart-5": z.ZodOptional<z.ZodString>;
            sidebar: z.ZodOptional<z.ZodString>;
            "sidebar-foreground": z.ZodOptional<z.ZodString>;
            "sidebar-primary": z.ZodOptional<z.ZodString>;
            "sidebar-primary-foreground": z.ZodOptional<z.ZodString>;
            "sidebar-accent": z.ZodOptional<z.ZodString>;
            "sidebar-accent-foreground": z.ZodOptional<z.ZodString>;
            "sidebar-border": z.ZodOptional<z.ZodString>;
            "sidebar-ring": z.ZodOptional<z.ZodString>;
            brand: z.ZodOptional<z.ZodString>;
            "brand-ink": z.ZodOptional<z.ZodString>;
            overlay: z.ZodOptional<z.ZodString>;
            "severity-critical": z.ZodOptional<z.ZodString>;
            "severity-high": z.ZodOptional<z.ZodString>;
            "severity-medium": z.ZodOptional<z.ZodString>;
            "severity-low": z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    shape: z.ZodOptional<z.ZodObject<{
        radius: z.ZodOptional<z.ZodString>;
        "shape-item": z.ZodOptional<z.ZodString>;
        "shape-control": z.ZodOptional<z.ZodString>;
        "shape-floating": z.ZodOptional<z.ZodString>;
        "shape-container": z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    space: z.ZodOptional<z.ZodObject<{
        "space-base": z.ZodOptional<z.ZodString>;
        "control-height": z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    type: z.ZodOptional<z.ZodObject<{
        "typeface-sans": z.ZodOptional<z.ZodString>;
        "typeface-heading": z.ZodOptional<z.ZodString>;
        "typeface-mono": z.ZodOptional<z.ZodString>;
        "type-caption": z.ZodOptional<z.ZodString>;
        "type-caption-leading": z.ZodOptional<z.ZodString>;
        "type-body": z.ZodOptional<z.ZodString>;
        "type-body-leading": z.ZodOptional<z.ZodString>;
        "type-title": z.ZodOptional<z.ZodString>;
        "type-title-leading": z.ZodOptional<z.ZodString>;
        "type-heading": z.ZodOptional<z.ZodString>;
        "type-heading-leading": z.ZodOptional<z.ZodString>;
        "type-display": z.ZodOptional<z.ZodString>;
        "type-display-leading": z.ZodOptional<z.ZodString>;
        "weight-normal": z.ZodOptional<z.ZodString>;
        "weight-medium": z.ZodOptional<z.ZodString>;
        "weight-strong": z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    elevation: z.ZodOptional<z.ZodObject<{
        "elevation-raised": z.ZodOptional<z.ZodString>;
        "elevation-floating": z.ZodOptional<z.ZodString>;
        "elevation-modal": z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    motion: z.ZodOptional<z.ZodObject<{
        "motion-fast": z.ZodOptional<z.ZodString>;
        "motion-base": z.ZodOptional<z.ZodString>;
        "motion-moderate": z.ZodOptional<z.ZodString>;
        "motion-slow": z.ZodOptional<z.ZodString>;
        "motion-ease-standard": z.ZodOptional<z.ZodString>;
        "motion-ease-emphasized": z.ZodOptional<z.ZodString>;
        "motion-ease-exit": z.ZodOptional<z.ZodString>;
        "motion-ease-enter": z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    system: z.ZodOptional<z.ZodObject<{
        light: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        dark: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
    components: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strict>;
/** A config as written (defaults may be left out). */
export type GlazeConfigInput = z.input<typeof glazeConfigSchema>;
/** A config after parsing, with defaults filled in. */
export type GlazeConfig = z.output<typeof glazeConfigSchema>;
/** Parses and validates a config; throws a readable error listing every problem. */
export declare function parseConfig(value: unknown): GlazeConfig;
/** Identity helper for typed configs written in TypeScript. */
export declare const defineConfig: (config: GlazeConfigInput) => {
    version: 1;
    name: string;
    $schema?: string | undefined;
    extends?: "nova" | undefined;
    defaults?: {
        mode?: "light" | "dark" | "system" | undefined;
        density?: "comfortable" | "compact" | undefined;
    } | undefined;
    fonts?: string[] | undefined;
    color?: {
        light?: {
            background?: string | undefined;
            foreground?: string | undefined;
            card?: string | undefined;
            "card-foreground"?: string | undefined;
            popover?: string | undefined;
            "popover-foreground"?: string | undefined;
            primary?: string | undefined;
            "primary-foreground"?: string | undefined;
            secondary?: string | undefined;
            "secondary-foreground"?: string | undefined;
            muted?: string | undefined;
            "muted-foreground"?: string | undefined;
            accent?: string | undefined;
            "accent-foreground"?: string | undefined;
            destructive?: string | undefined;
            border?: string | undefined;
            input?: string | undefined;
            ring?: string | undefined;
            "chart-1"?: string | undefined;
            "chart-2"?: string | undefined;
            "chart-3"?: string | undefined;
            "chart-4"?: string | undefined;
            "chart-5"?: string | undefined;
            sidebar?: string | undefined;
            "sidebar-foreground"?: string | undefined;
            "sidebar-primary"?: string | undefined;
            "sidebar-primary-foreground"?: string | undefined;
            "sidebar-accent"?: string | undefined;
            "sidebar-accent-foreground"?: string | undefined;
            "sidebar-border"?: string | undefined;
            "sidebar-ring"?: string | undefined;
            brand?: string | undefined;
            "brand-ink"?: string | undefined;
            overlay?: string | undefined;
            "severity-critical"?: string | undefined;
            "severity-high"?: string | undefined;
            "severity-medium"?: string | undefined;
            "severity-low"?: string | undefined;
        } | undefined;
        dark?: {
            background?: string | undefined;
            foreground?: string | undefined;
            card?: string | undefined;
            "card-foreground"?: string | undefined;
            popover?: string | undefined;
            "popover-foreground"?: string | undefined;
            primary?: string | undefined;
            "primary-foreground"?: string | undefined;
            secondary?: string | undefined;
            "secondary-foreground"?: string | undefined;
            muted?: string | undefined;
            "muted-foreground"?: string | undefined;
            accent?: string | undefined;
            "accent-foreground"?: string | undefined;
            destructive?: string | undefined;
            border?: string | undefined;
            input?: string | undefined;
            ring?: string | undefined;
            "chart-1"?: string | undefined;
            "chart-2"?: string | undefined;
            "chart-3"?: string | undefined;
            "chart-4"?: string | undefined;
            "chart-5"?: string | undefined;
            sidebar?: string | undefined;
            "sidebar-foreground"?: string | undefined;
            "sidebar-primary"?: string | undefined;
            "sidebar-primary-foreground"?: string | undefined;
            "sidebar-accent"?: string | undefined;
            "sidebar-accent-foreground"?: string | undefined;
            "sidebar-border"?: string | undefined;
            "sidebar-ring"?: string | undefined;
            brand?: string | undefined;
            "brand-ink"?: string | undefined;
            overlay?: string | undefined;
            "severity-critical"?: string | undefined;
            "severity-high"?: string | undefined;
            "severity-medium"?: string | undefined;
            "severity-low"?: string | undefined;
        } | undefined;
    } | undefined;
    shape?: {
        radius?: string | undefined;
        "shape-item"?: string | undefined;
        "shape-control"?: string | undefined;
        "shape-floating"?: string | undefined;
        "shape-container"?: string | undefined;
    } | undefined;
    space?: {
        "space-base"?: string | undefined;
        "control-height"?: string | undefined;
    } | undefined;
    type?: {
        "typeface-sans"?: string | undefined;
        "typeface-heading"?: string | undefined;
        "typeface-mono"?: string | undefined;
        "type-caption"?: string | undefined;
        "type-caption-leading"?: string | undefined;
        "type-body"?: string | undefined;
        "type-body-leading"?: string | undefined;
        "type-title"?: string | undefined;
        "type-title-leading"?: string | undefined;
        "type-heading"?: string | undefined;
        "type-heading-leading"?: string | undefined;
        "type-display"?: string | undefined;
        "type-display-leading"?: string | undefined;
        "weight-normal"?: string | undefined;
        "weight-medium"?: string | undefined;
        "weight-strong"?: string | undefined;
    } | undefined;
    elevation?: {
        "elevation-raised"?: string | undefined;
        "elevation-floating"?: string | undefined;
        "elevation-modal"?: string | undefined;
    } | undefined;
    motion?: {
        "motion-fast"?: string | undefined;
        "motion-base"?: string | undefined;
        "motion-moderate"?: string | undefined;
        "motion-slow"?: string | undefined;
        "motion-ease-standard"?: string | undefined;
        "motion-ease-emphasized"?: string | undefined;
        "motion-ease-exit"?: string | undefined;
        "motion-ease-enter"?: string | undefined;
    } | undefined;
    system?: {
        light?: Record<string, string> | undefined;
        dark?: Record<string, string> | undefined;
    } | undefined;
    components?: Record<string, string> | undefined;
};
