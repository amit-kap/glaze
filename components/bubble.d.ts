import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";
declare function BubbleGroup({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare const bubbleVariants: (props?: ({
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "muted" | "tinted" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Bubble({ variant, align, className, ...props }: React.ComponentProps<"div"> & VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end";
}): React.JSX.Element;
declare function BubbleContent({ className, render, ...props }: useRender.ComponentProps<"div">): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
declare function BubbleReactions({ side, align, className, ...props }: React.ComponentProps<"div"> & {
    align?: "start" | "end";
    side?: "top" | "bottom";
}): React.JSX.Element;
export { BubbleGroup, Bubble, BubbleContent, BubbleReactions };
