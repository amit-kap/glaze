import { z } from "zod";
export declare const builtInThemes: readonly ["nova", "vega", "maia", "lyra", "mira", "luma", "sera", "rhea", "gr8r"];
export declare const glazeConfigSchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    version: z.ZodLiteral<1>;
    name: z.ZodString;
    extends: z.ZodDefault<z.ZodEnum<{
        nova: "nova";
        vega: "vega";
        maia: "maia";
        lyra: "lyra";
        mira: "mira";
        luma: "luma";
        sera: "sera";
        rhea: "rhea";
        gr8r: "gr8r";
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
            canvas: z.ZodOptional<z.ZodString>;
            surface: z.ZodOptional<z.ZodString>;
            ink: z.ZodOptional<z.ZodString>;
            "ink-muted": z.ZodOptional<z.ZodString>;
            line: z.ZodOptional<z.ZodString>;
            brand: z.ZodOptional<z.ZodString>;
            "brand-ink": z.ZodOptional<z.ZodString>;
            danger: z.ZodOptional<z.ZodString>;
            warning: z.ZodOptional<z.ZodString>;
            success: z.ZodOptional<z.ZodString>;
            info: z.ZodOptional<z.ZodString>;
            "chart-1": z.ZodOptional<z.ZodString>;
            "chart-2": z.ZodOptional<z.ZodString>;
            "chart-3": z.ZodOptional<z.ZodString>;
            "chart-4": z.ZodOptional<z.ZodString>;
            "chart-5": z.ZodOptional<z.ZodString>;
            overlay: z.ZodOptional<z.ZodString>;
            caution: z.ZodOptional<z.ZodString>;
            "sidebar-brand": z.ZodOptional<z.ZodString>;
            "sidebar-brand-ink": z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        dark: z.ZodOptional<z.ZodObject<{
            canvas: z.ZodOptional<z.ZodString>;
            surface: z.ZodOptional<z.ZodString>;
            ink: z.ZodOptional<z.ZodString>;
            "ink-muted": z.ZodOptional<z.ZodString>;
            line: z.ZodOptional<z.ZodString>;
            brand: z.ZodOptional<z.ZodString>;
            "brand-ink": z.ZodOptional<z.ZodString>;
            danger: z.ZodOptional<z.ZodString>;
            warning: z.ZodOptional<z.ZodString>;
            success: z.ZodOptional<z.ZodString>;
            info: z.ZodOptional<z.ZodString>;
            "chart-1": z.ZodOptional<z.ZodString>;
            "chart-2": z.ZodOptional<z.ZodString>;
            "chart-3": z.ZodOptional<z.ZodString>;
            "chart-4": z.ZodOptional<z.ZodString>;
            "chart-5": z.ZodOptional<z.ZodString>;
            overlay: z.ZodOptional<z.ZodString>;
            caution: z.ZodOptional<z.ZodString>;
            "sidebar-brand": z.ZodOptional<z.ZodString>;
            "sidebar-brand-ink": z.ZodOptional<z.ZodString>;
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
    extends?: "nova" | "vega" | "maia" | "lyra" | "mira" | "luma" | "sera" | "rhea" | "gr8r" | undefined;
    defaults?: {
        mode?: "light" | "dark" | "system" | undefined;
        density?: "comfortable" | "compact" | undefined;
    } | undefined;
    fonts?: string[] | undefined;
    color?: {
        light?: {
            canvas?: string | undefined;
            surface?: string | undefined;
            ink?: string | undefined;
            "ink-muted"?: string | undefined;
            line?: string | undefined;
            brand?: string | undefined;
            "brand-ink"?: string | undefined;
            danger?: string | undefined;
            warning?: string | undefined;
            success?: string | undefined;
            info?: string | undefined;
            "chart-1"?: string | undefined;
            "chart-2"?: string | undefined;
            "chart-3"?: string | undefined;
            "chart-4"?: string | undefined;
            "chart-5"?: string | undefined;
            overlay?: string | undefined;
            caution?: string | undefined;
            "sidebar-brand"?: string | undefined;
            "sidebar-brand-ink"?: string | undefined;
        } | undefined;
        dark?: {
            canvas?: string | undefined;
            surface?: string | undefined;
            ink?: string | undefined;
            "ink-muted"?: string | undefined;
            line?: string | undefined;
            brand?: string | undefined;
            "brand-ink"?: string | undefined;
            danger?: string | undefined;
            warning?: string | undefined;
            success?: string | undefined;
            info?: string | undefined;
            "chart-1"?: string | undefined;
            "chart-2"?: string | undefined;
            "chart-3"?: string | undefined;
            "chart-4"?: string | undefined;
            "chart-5"?: string | undefined;
            overlay?: string | undefined;
            caution?: string | undefined;
            "sidebar-brand"?: string | undefined;
            "sidebar-brand-ink"?: string | undefined;
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
    components?: Record<string, string> | undefined;
};
