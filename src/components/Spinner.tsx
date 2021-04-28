import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
// import { LogoMark } from "./logo/index";

interface SpinnerProperties {
  size?: SizeProp;
}

export default function Spinner({ size }: SpinnerProperties): ReactElement {
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
  return (
    <FontAwesomeIcon
      className="text-brand"
      icon={faCircleNotch}
      spin
      size={size}
    />
  );
}
