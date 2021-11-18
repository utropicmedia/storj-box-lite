import cn from "classnames";
import { profileTypes } from "lib/profile-types";
import { getProfileUrl } from "lib/utils";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectSettings } from "store/settings/settingsSlice";
import Head from "../components/Head";
import { PageTitle } from "../components/typography";

export const ProfileList = () => {
  const { settings, loading } = useSelector(selectSettings);

  return (
    <>
      <Head title="Profiles | Box Lite" />
      <div className="mt-2 mb-4 md:flex md:items-center md:justify-between">
        <PageTitle>Profiles</PageTitle>
        <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4"></div>
      </div>

      {!loading &&
        settings &&
        settings.credentialProfiles &&
        settings.credentialProfiles.length <= 0 && <div>No Profiles</div>}

      {!loading &&
        settings &&
        settings.credentialProfiles &&
        settings.credentialProfiles.length > 0 && (
          <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {settings.credentialProfiles.map((cp) => {
              const pt = profileTypes.find((p) => p.id === cp.type);
              return (
                <li
                  key={cp.nickname}
                  className="col-span-1 flex shadow-sm rounded-md"
                >
                  <div
                    className={cn(
                      `bg-${pt?.bgColor}`,
                      "flex-shrink-0 flex items-center justify-center px-3 text-white text-sm font-medium rounded-l-md"
                    )}
                  >
                    {pt?.name}
                  </div>
                  <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                    <div className="flex-1 px-4 py-2 text-sm truncate">
                      <Link
                        to={getProfileUrl(cp)}
                        className="flex text-gray-900 font-medium hover:text-gray-600"
                      >
                        {cp.nickname}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
    </>
  );
};

export default ProfileList;
