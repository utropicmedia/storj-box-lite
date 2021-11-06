import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestoreCollection } from "lib/firebase";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthSettings,
  CredentialProfile,
  CredentialProfileType,
  selectSettings,
  setSettings,
} from "store/settings/settingsSlice";
import ConfirmDialog from "./ConfirmDialog";
import UpdateCredentialProfileButton from "./UpdateCredentialProfileButton";
import UpdateDialogProfile from "./UpdateDialogProfile";

export interface CredentialProfileTypeDisplayProps {
  type: CredentialProfileType;
}

const CredentialProfileTypeDisplay = ({
  type,
}: CredentialProfileTypeDisplayProps) => {
  switch (type) {
    case "storjDcs":
    default:
      return <span>Storj DCS</span>;
  }
};

interface DeleteProfileButtonProps {
  authSettings: AuthSettings;
  credentialProfiles: CredentialProfile[];
  profile: CredentialProfile;
  profileIndex: number;
  user: User;
}

const DeleteProfileButton = ({
  authSettings,
  credentialProfiles,
  profile,
  profileIndex,
  user,
}: DeleteProfileButtonProps) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const deleteProfile = async (idx: number) => {
    const newProfiles = [
      ...credentialProfiles.slice(0, idx),
      ...credentialProfiles.slice(idx + 1),
    ];
    const docRef = doc(firestoreCollection, user?.uid);
    await setDoc(docRef, { credentialProfiles: newProfiles }, { merge: true });
    dispatch(
      setSettings({
        auth: authSettings,
        credentialProfiles: newProfiles,
      })
    );
  };

  return (
    <>
      <button
        type="button"
        className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-red-700 font-medium border border-transparent rounded-bl-lg hover:text-red-500"
        onClick={() => setOpen(true)}
      >
        Delete
      </button>
      <ConfirmDialog
        confirmText="Delete"
        content={
          <span>
            Are you sure you want to delete your{" "}
            <span className="italic">{profile.nickname}</span> profile?
          </span>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => deleteProfile(profileIndex)}
        title="Delete Credential Profile"
      />
    </>
  );
};

interface UpdateProfileButtonProps {
  authSettings: AuthSettings;
  credentialProfiles: CredentialProfile[];
  profile: CredentialProfile;
  profileIndex: any;
  user: User;
}

const UpdateProfile = ({ profile, profileIndex }: UpdateProfileButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
        onClick={() => setOpen(true)}
      >
        Update
      </button>
      <UpdateDialogProfile
        accessKeyProfile={profile.credentials.accessKeyId}
        secretKeyProfile={profile.credentials.secretAccessKey}
        confirmText="Update"
        content={profile.nickname}
        index={profileIndex}
        open={open}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export interface ProfileCardsProps {
  credentialProfiles: CredentialProfile[];
}

const ProfileCards = ({ credentialProfiles }: ProfileCardsProps) => {
  const { settings, loading } = useSelector(selectSettings);
  const [user, userLoading] = useAuthState(auth);

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {!loading &&
        !userLoading &&
        user &&
        settings &&
        credentialProfiles.map((profile, profileIndex) => (
          <li
            key={`cp-${profileIndex}-${profile.nickname}`}
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
                  <DeleteProfileButton
                    authSettings={settings.auth as AuthSettings}
                    credentialProfiles={credentialProfiles}
                    profile={profile}
                    profileIndex={profileIndex}
                    user={user}
                  />
                </div>
                <div className="-ml-px w-0 flex-1 flex">
                  <UpdateProfile
                    authSettings={settings.auth as AuthSettings}
                    credentialProfiles={credentialProfiles}
                    profile={profile}
                    profileIndex={profileIndex}
                    user={user}
                  />
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
