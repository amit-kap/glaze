import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { type VariantProps } from "class-variance-authority";
declare function Tabs({ className, orientation, ...props }: TabsPrimitive.Root.Props): React.JSX.Element;
declare const tabsListVariants: (props?: ({
    variant?: "line" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function TabsList({ className, variant, children, ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>): React.JSX.Element;
declare function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props): React.JSX.Element;
declare function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props): React.JSX.Element;
declare function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props): React.JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator, tabsListVariants, };
