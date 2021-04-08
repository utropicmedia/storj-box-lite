import cn from "classnames";
import React, { ReactElement } from "react";
import Logo, { LogoColor } from "./Logo";

export type AppLogoSize = "sm" | "md" | "lg";

export interface AppLogoProperties {
  color?: LogoColor;
  size?: AppLogoSize;
}

export default function AppLogo({
  color,
  size,
}: AppLogoProperties): ReactElement {
  const classes = cn("flex justify-center items-center", {
    "h-full": !size,
    "h-12": size === "sm",
    "h-16": size === "md",
    "h-20": size === "lg",
    "text-current": !color,
    "text-brand": color === "brand",
    "text-brand-contrast": color === "contrast",
  });
  return (
    <div className={classes}>
      <Logo />
      <div className="ml-2">Box Lite</div>
    </div>
  );
}
