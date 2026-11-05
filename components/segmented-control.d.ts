import type { ReactNode } from "react";
export type SegmentedControlOption<T extends string> = {
    value: T;
    label: ReactNode;
    disabled?: boolean;
};
declare function SegmentedControl<T extends string>({ className, label, size, value, onValueChange, options, }: {
    className?: string;
    /** Names the choice for assistive tech; not drawn. */
    label: string;
    size?: "mini" | "sm" | "default";
    value: T;
    onValueChange: (value: T) => void;
    options: SegmentedControlOption<T>[];
}): import("react").JSX.Element;
export { SegmentedControl };
