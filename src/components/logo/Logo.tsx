import React from "react";
import { ReactComponent as BlackLogo } from "./svg/storj-box-lite-logo-black.svg";
import { ReactComponent as ColorLogo } from "./svg/storj-box-lite-logo-color.svg";
import { ReactComponent as WhiteLogo } from "./svg/storj-box-lite-logo-white.svg";

export type LogoVariant = "black" | "color" | "white";

export interface LogoProps {
  variant: LogoVariant;
}

export const Logo = ({ variant }: LogoProps) => {
  switch (variant) {
    case "black":
      return <BlackLogo className="w-full" />;
    case "white":
      return <WhiteLogo className="w-full" />;
    case "color":
    default:
      return <ColorLogo className="w-full" />;
  }
};

export default Logo;

Logo.defaultProps = {
  variant: "color",
};
