import React, { PropsWithChildren, ReactElement } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FullPageLayoutProperties {}

export default function FullPageLayout({
  children,
}: PropsWithChildren<FullPageLayoutProperties>): ReactElement {
  return <>{children}</>;
}
