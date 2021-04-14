import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";

interface SpinnerProperties {
  size?: SizeProp;
}

export default function Spinner({ size }: SpinnerProperties): ReactElement {
  return (
    <FontAwesomeIcon
      className="text-brand"
      icon={faCircleNotch}
      spin
      size={size}
    />
  );
}
