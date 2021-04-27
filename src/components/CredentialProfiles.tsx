import { auth, firestoreCollection } from "lib/firebase";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  CredentialProfile,
  CredentialProfileType,
  selectSettings,
  setSettings,
} from "store/settings/settingsSlice";
import { UpdateCredentialProfileButton } from "./UpdateCredentialProfileButton";

export interface CredentialProfileTypeDisplayProps {
  type: CredentialProfileType;
}

const CredentialProfileTypeDisplay = ({
  type,
}: CredentialProfileTypeDisplayProps) => {
  switch (type) {
    case "storjS3":
    default:
      return <span>Storj S3</span>;
  }
};

export interface ProfileCardsProps {
  credentialProfiles: CredentialProfile[];
}

const ProfileCards = ({ credentialProfiles }: ProfileCardsProps) => {
  const { settings, loading } = useSelector(selectSettings);
  const [user, userLoading] = useAuthState(auth);
  const dispatch = useDispatch();

  const deleteProfile = async (profileIndex: number) => {
    const newProfiles = [
      ...credentialProfiles.slice(0, profileIndex),
      ...credentialProfiles.slice(profileIndex + 1),
    ];
    await firestoreCollection
      .doc(user?.uid)
      .set({ credentialProfiles: newProfiles }, { merge: true });
    dispatch(
      setSettings({
        auth: settings?.auth,
        credentialProfiles: newProfiles,
      })
    );
  };

  const updateProfile = (profileIndex: number) => {
    const profile = credentialProfiles[profileIndex];
    console.log("updateProfile", profile);
  };

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {!loading &&
        !userLoading &&
        user &&
        settings &&
        credentialProfiles.map((profile, profileIndex) => (
          <li
            key={profile.nickname}
            className="col-span-1 bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-200"
          >
            <div className="w-full flex items-center justify-between p-6 space-x-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-900 text-sm font-medium truncate">
                    {profile.nickname}
                  </h3>
                </div>
                <p className="mt-1 text-gray-500 text-sm truncate">
                  <CredentialProfileTypeDisplay type={profile.type} />
                </p>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="w-0 flex-1 flex">
                  <button
                    type="button"
                    className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-red-700 font-medium border border-transparent rounded-bl-lg hover:text-red-500"
                    onClick={() => deleteProfile(profileIndex)}
                  >
                    Delete
                  </button>
                </div>
                <div className="-ml-px w-0 flex-1 flex">
                  <button
                    type="button"
                    className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                    onClick={() => updateProfile(profileIndex)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

export const CredentialProfiles = () => {
  const { settings, loading } = useSelector(selectSettings);

  return (
    <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <div className="shadow sm:rounded-md">
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Credential Profiles
            </h3>
          </div>

          {!loading &&
            settings &&
            settings.credentialProfiles &&
            settings.credentialProfiles.length > 0 && (
              <div>
                <ProfileCards
                  credentialProfiles={settings.credentialProfiles}
                />
              </div>
            )}
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <UpdateCredentialProfileButton />
        </div>
      </div>
    </div>
  );
};

export default CredentialProfiles;