import * as React from "react";
declare function Input({ className, type, size, ...props }: Omit<React.ComponentProps<"input">, "size"> & {
    size?: "mini" | "sm" | "default";
}): React.JSX.Element;
export { Input };
