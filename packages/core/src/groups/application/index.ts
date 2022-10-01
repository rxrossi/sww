import { GroupsRepositoryInMemory } from "../infra/repository-in-memory";
import { Groups } from "./sdk";

export const buildSdk = () => {
  const repository = new GroupsRepositoryInMemory();

  const sdk = new Groups({
    repository,
  });

  return {
    sdk,
    repository,
  };
};
