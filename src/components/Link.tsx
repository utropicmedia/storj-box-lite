import React, { PropsWithChildren, ReactElement } from "react";
import { Link as ReactRouterLink, LinkProps } from "react-router-dom";

interface LinkProperties extends LinkProps {}

export default function Link({
  children,
  ...rest
}: PropsWithChildren<LinkProperties>): ReactElement {
  return (
    <ReactRouterLink className="text-brand hover:text-brand-lighter" {...rest}>
      {children}
    </ReactRouterLink>
  );
}
