import { paramCase } from "change-case";
import { CredentialProfile } from "../store/settings/settingsSlice";

export const getProfileType = (profile: string): string => paramCase(profile);

export const getProfileName = (profile: string): string => paramCase(profile);

export const getProfileUrl = (cp: CredentialProfile): string =>
  `/p/${getProfileType(cp.type)}/${getProfileName(cp.nickname)}`;

export const getProfileCredentials = (
  profile: string,
  credentialProfiles: CredentialProfile[]
) => {
  return credentialProfiles.find(
    (cp) => getProfileName(cp.nickname) === profile
  )?.credentials;
};

export const getProfileCredentialNickname = (
  profile: string,
  credentialProfiles: CredentialProfile[]
) => {
  return credentialProfiles.find(
    (cp) => getProfileName(cp.nickname) === profile
  )?.nickname;
};
