import React, { PropsWithChildren } from "react";

export const PageTitle = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <div className="flex-1 min-w-0">
      <h1 className="flex items-center text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
        {children}
      </h1>
    </div>
  );
};

export default PageTitle;
