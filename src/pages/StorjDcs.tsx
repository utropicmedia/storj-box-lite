import React from "react";
import { useLocation } from "react-router";

export const StorjDcs = () => {
  const location = useLocation();

  return (
    <div>
      <div>Storj DCS</div>
      <div>location: {location.pathname}</div>
    </div>
  );
};

export default StorjDcs;
