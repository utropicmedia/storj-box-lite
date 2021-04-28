import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { LogoMark } from "./logo/index";
import cn from "classnames";
import React, { ReactElement } from "react";

export type SpinnerVariant = "brand" | "dark" | "light";

interface SpinnerProperties {
  size?: SizeProp;
  variant?: SpinnerVariant;
}

export default function Spinner({
  size,
  variant,
}: SpinnerProperties): ReactElement {
  // let styles;
  // switch (size) {
  //   case "2x":
  //     styles = { height: 36, width: 32 };
  //     break;
  //   default:
  //     styles = { height: 18, width: 16 };
  // }
  // return (
  //   <div style={styles} className="animate-spin">
  //     <LogoMark />
  //   </div>
  // );
  const classes = cn({
    "text-brand": variant === "brand",
    "text-secondary": variant === "dark",
    "text-gray-50": variant === "light",
  });
  return (
    <FontAwesomeIcon
      className={classes}
      icon={faCircleNotch}
      spin
      size={size}
    />
  );
}

Spinner.defaultProps = {
  variant: "brand",
};
