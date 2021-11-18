import { User } from "firebase/auth";
import React, { ReactElement } from "react";

export interface UserAvatarProperties {
  user: User;
}

const getInitials = (name: string | null) => {
  if (!name) {
    return "";
  }
  const parts = name.split(" ");
  const firstInitial = parts[0].charAt(0);
  const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${firstInitial}${lastInitial}`;
};

export default function UserAvatar({
  user,
}: UserAvatarProperties): ReactElement {
  const initials = getInitials(user?.displayName);
  if (user.photoURL) {
    return (
      <div>
        <img
          className="inline-block h-10 w-10 rounded-full"
          src={user.photoURL}
          alt={`${user.displayName} avatar`}
        />
      </div>
    );
  }
  return (
    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-brand-contrast">
      <span className="font-medium leading-none text-brand">{initials}</span>
    </span>
  );
}
