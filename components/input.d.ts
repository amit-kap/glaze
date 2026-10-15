import * as React from "react";
declare function Input({ className, type, size, ...props }: Omit<React.ComponentProps<"input">, "size"> & {
    size?: "default" | "sm";
}): React.JSX.Element;
export { Input };
