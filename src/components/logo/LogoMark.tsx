import React from "react";
import { ReactComponent as BlackLogo } from "./svg/storj-logomark-black.svg";
import { ReactComponent as ColorLogo } from "./svg/storj-logomark-color.svg";
import { ReactComponent as WhiteLogo } from "./svg/storj-logomark-white.svg";

export type LogoMarkVariant = "black" | "color" | "white";

export interface LogoMarkProps {
  variant: LogoMarkVariant;
}

export const LogoMark = ({ variant }: LogoMarkProps) => {
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

export default LogoMark;

LogoMark.defaultProps = {
  variant: "color",
};
