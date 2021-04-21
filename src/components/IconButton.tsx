import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";
import React, { ButtonHTMLAttributes, ReactElement } from "react";

export type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type IconButtonColor = "brand" | "secondary" | "transparent";

interface LinkProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconProp;
  size: IconButtonSize;
  text: string;
}

export default function IconButton({
  children,
  className,
  onClick,
  icon,
  size,
  text,
  ...rest
}: LinkProperties): ReactElement {
  const buttonClasses = cn(
    "inline-flex items-center border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
      "p-1": size === "xs",
      "p-1.5": size === "sm",
      "p-2": !size || size === "md" || size === "lg",
      "p-3": size === "xl",
    },
    className
  );
  const iconClasses = cn({
    "h-5 w-5 flex items-center justify-center text-xl":
      size !== "lg" && size !== "xl",
    "h-6 w-6 flex items-center justify-center text-2xl":
      size === "lg" || size === "xl",
  });
  return (
    <button type="button" className={buttonClasses} onClick={onClick} {...rest}>
      <div className={iconClasses}>
        <FontAwesomeIcon aria-hidden="true" icon={icon} />
      </div>
      <span className="sr-only">{text}</span>
    </button>
  );
}

IconButton.defaultProps = {
  color: "transparent",
  size: "md",
};
