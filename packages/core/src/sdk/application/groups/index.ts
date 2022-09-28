import { Invites } from "./application/invites/application";
import { Groups } from "./application/sdk";
import { GroupsRepositoryInMemory } from "./infra/repository-in-memory";

export const buildSdk = (): Groups => {
  const repository = new GroupsRepositoryInMemory();

  const sdk = new Groups({
    repository,
    invites: new Invites({
      groupsRepository: repository,
    }),
  });

  return sdk;
};
