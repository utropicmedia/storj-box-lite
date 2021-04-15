import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ButtonHTMLAttributes, ReactElement } from "react";

interface LinkProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconProp;
  text: string;
}

export default function IconButton({
  children,
  onClick,
  icon,
  text,
  ...rest
}: LinkProperties): ReactElement {
  return (
    <button type="button" onClick={onClick} {...rest}>
      <FontAwesomeIcon aria-hidden="true" icon={icon} />
      <span className="sr-only">{text}</span>
    </button>
  );
}
