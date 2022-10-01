import { buildSdk as buildInvitesSdk } from "src/invites/application";
import { NewEventInput } from "src/sdk/application/events";
import {
  EmitEvent,
  EventHandler,
} from "src/sdk/application/io-client/application/base-io-client";
import { Groups } from "./application/sdk";
import { GroupsRepositoryInMemory } from "./infra/repository-in-memory";

export const buildSdk = ({
  emitEvent,
  addOnEvent,
}: {
  emitEvent: EmitEvent<NewEventInput<any, any>>;
  addOnEvent: (eventHandler: EventHandler<any>) => void;
}): Groups => {
  const groupsRepository = new GroupsRepositoryInMemory();

  const invites = buildInvitesSdk({
    emitEvent,
    groupsRepository: groupsRepository,
    addOnEvent,
  });

  const sdk = new Groups({
    repository: groupsRepository,
    invites: invites,
  });

  return sdk;
};
