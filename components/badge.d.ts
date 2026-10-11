import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
declare const badgeVariants: (props?: ({
    variant?: "default" | "link" | "outline" | "secondary" | "ghost" | "destructive" | "high" | "low" | "critical" | "medium" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Badge({ className, variant, render, children, ...props }: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>): import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
export { Badge, badgeVariants };
