import { Auth } from "./auth";
import { buildSdk } from "./groups";

export const buildSdks = () => {
  return {
    groups: buildSdk(),
    auth: new Auth(),
  };
};
